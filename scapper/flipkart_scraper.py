import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import quote_plus, urljoin

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://www.flipkart.com"
SEARCH_URL = f"{BASE_URL}/search?q={{query}}&page={{page}}"
DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-IN,en;q=0.9",
}


def get_text(node):
    return node.get_text(" ", strip=True) if node else ""


def first_text(root, selectors):
    for selector in selectors:
        node = root.select_one(selector)
        text = get_text(node)
        if text:
            return text
    return ""


def first_attr(root, selectors, attr_name):
    for selector in selectors:
        node = root.select_one(selector)
        if node and node.get(attr_name):
            return node[attr_name]
    return ""


def parse_price(value):
    digits = re.sub(r"[^\d]", "", value or "")
    return int(digits) if digits else 0


def parse_rating(value):
    match = re.search(r"\d+(?:\.\d+)?", value or "")
    return float(match.group(0)) if match else 0.0


def normalize_image_url(url):
    if not url:
        return ""
    if url.startswith("//"):
        return f"https:{url}"
    return url


def canonicalize_image_url(url):
    normalized = normalize_image_url(url).strip()
    if not normalized:
        return ""
    normalized = re.sub(r"([?&])q=\d+", r"\1", normalized)
    normalized = re.sub(r"[?&]+$", "", normalized)
    return normalized


def parse_price_from_text(text):
    match = re.search(r"₹\s?([\d,]+)", text or "")
    return match.group(1).replace(",", "") if match else "0"


def parse_rating_from_text(text):
    text = text or ""
    match = re.search(r"\b(\d(?:\.\d)?)\s+\d[\d,]*\s+Ratings?\b", text)
    if match:
        return match.group(1)
    match = re.search(r"\b(\d(?:\.\d)?)\s+\((\d[\d,]*)\)", text)
    if match:
        return match.group(1)
    return "No rating"


def slug_to_brand(name):
    cleaned = (name or "").strip()
    return cleaned.split()[0] if cleaned else "Generic"


def dedupe(items):
    seen = set()
    unique = []

    for item in items:
        key = item.get("link") or item.get("title")
        if not key or key in seen:
            continue
        seen.add(key)
        unique.append(item)

    return unique


def parse_query_list(single_query, query_csv):
    if query_csv:
        queries = [item.strip() for item in query_csv.split(",") if item.strip()]
        return queries or [single_query]
    return [single_query]


def is_valid_product_record(product):
    title = (product.get("title") or "").strip()
    image = normalize_image_url(product.get("main_image") or "")
    price = str(product.get("price") or "").strip()
    link = (product.get("link") or "").strip()

    if not title or title.lower() == "flipkart":
        return False
    if not link or "pid=" not in link:
        return False
    if not price or price == "0":
        return False
    if not image or "static-assets-web.flixcart.com" in image.lower():
        return False
    return True


def extract_specifications(product_soup):
    specs = {}

    for row in product_soup.select("tr._1s_Smc, tr._1OjC5I, tr._3ENrHu"):
        key = first_text(row, ["td._1hKmbr", "td:first-child", "th:first-child"])
        value = first_text(row, ["td.URwL2w", "td:last-child", "td:nth-child(2)"])
        if key and value:
            specs[key] = value

    for block in product_soup.select("div._2418kt"):
        key = first_text(block, ["div._1hKmbr", "div:first-child"])
        value = first_text(block, ["div.URwL2w", "div:last-child"])
        if key and value and key not in specs:
            specs[key] = value

    return specs


def extract_sizes(product_soup):
    size_text_candidates = []

    for node in product_soup.select('div, span, button, li'):
        text = get_text(node)
        if 'Size Chart' in text or text.startswith('Select Size'):
            size_text_candidates.append(text)

    combined_text = ' '.join(size_text_candidates)
    patterns = [
        r'\b(?:XXXS|XXS|XS|S|M|L|XL|XXL|XXXL|3XL|4XL|5XL)\b',
        r'\b\d{2,3}\b',
        r'\b\d{1,2}-\d{1,2}\s*(?:Years|Yrs)\b',
        r'\b\d{1,2}\s*(?:Years|Yrs)\b',
    ]

    sizes = []
    for pattern in patterns:
        for match in re.findall(pattern, combined_text, flags=re.IGNORECASE):
            normalized = re.sub(r'\s+', ' ', match).strip()
            if normalized and normalized not in sizes:
                sizes.append(normalized)

    return sizes[:12]


def extract_images(product_soup, raw_html, fallback_image):
    images = []
    attrs_to_check = ["src", "data-src", "data-lazy", "data-srcset", "srcset", "href", "data-image-url"]

    for node in product_soup.select("img, source, a, div"):
        for attr_name in attrs_to_check:
            raw_value = node.get(attr_name)
            if not raw_value:
                continue

            candidates = re.findall(r"https?://[^\"'\s,]+", raw_value)
            if not candidates and raw_value.startswith(("http://", "https://", "//")):
                candidates = [raw_value]

            for candidate in candidates:
                lowered = candidate.lower()
                if (
                    ".svg" in lowered
                    or "static-assets-web.flixcart.com" in lowered
                    or ("rukmini" not in lowered and "rukminim" not in lowered)
                ):
                    continue
                images.append(normalize_image_url(candidate))

    html_candidates = re.findall(
        r"https?://[^\"'\\]+(?:rukminim|rukmini)[^\"'\\]+?\.(?:jpg|jpeg|png|webp)(?:\?[^\"'\\]*)?",
        raw_html or "",
        flags=re.IGNORECASE,
    )
    images.extend(normalize_image_url(candidate) for candidate in html_candidates)

    fallback_image = normalize_image_url(fallback_image)
    if fallback_image:
        images.insert(0, fallback_image)

    unique_images = []
    seen = set()
    for image in images:
        canonical = canonicalize_image_url(image)
        if not canonical or canonical in seen:
            continue
        seen.add(canonical)
        unique_images.append(image)

    return unique_images[:12]


def extract_structured_product_data(product_soup):
    script_tag = product_soup.select_one('script[type="application/ld+json"]')
    if not script_tag:
        return {}

    raw_json = script_tag.string or script_tag.get_text(strip=True)
    if not raw_json:
        return {}

    try:
        payload = json.loads(raw_json)
    except json.JSONDecodeError:
        return {}

    if isinstance(payload, list):
        product_data = next(
            (item for item in payload if isinstance(item, dict) and item.get("@type") == "Product"),
            payload[0] if payload and isinstance(payload[0], dict) else {},
        )
    elif isinstance(payload, dict):
        product_data = payload
    else:
        return {}

    if not isinstance(product_data, dict):
        return {}

    return product_data


def build_raw_product(search_card, product_soup, raw_html, product_url, fallback_title, fallback_price, fallback_rating, fallback_image):
    structured = extract_structured_product_data(product_soup)
    offers = structured.get("offers", {}) if isinstance(structured.get("offers"), dict) else {}
    aggregate_rating = structured.get("aggregateRating", {}) if isinstance(structured.get("aggregateRating"), dict) else {}
    brand = structured.get("brand", {}) if isinstance(structured.get("brand"), dict) else {}

    title = fallback_title or first_text(
        search_card,
        ["div._4rR01T", "a[title]", "div.KzDlHZ", "div.syl9yP"],
    )
    title = structured.get("name") or title
    if not title:
        title = first_text(product_soup, ["span.VU-ZEz", "h1", "span.B_NuCI"])

    price_text = fallback_price or first_text(
        search_card,
        ["div._30jeq3", "div.Nx9bqj._4b5DiR", "div.Nx9bqj"],
    )
    if offers.get("price"):
        price_text = str(offers["price"])
    if not price_text:
        price_text = first_text(product_soup, ["div.Nx9bqj", "div._30jeq3"])

    rating_text = fallback_rating or first_text(
        search_card,
        ["div._3LWZlK", "div.XQDdHH", "span.Y1HWO0"],
    )
    if aggregate_rating.get("ratingValue"):
        rating_text = str(aggregate_rating["ratingValue"])
    description = first_text(
        product_soup,
        ["div._1mXcCf", "div.yN+eNk", "div._1AN87F", "div._4aGKX3"],
    ) or structured.get("description") or "No description"

    specs = extract_specifications(product_soup)
    sizes = extract_sizes(product_soup)
    images = extract_images(product_soup, raw_html, fallback_image)
    if structured.get("image"):
        structured_images = structured["image"] if isinstance(structured["image"], list) else [structured["image"]]
        images = dedupe([{"link": image, "title": image} for image in [*structured_images, *images]])
        images = [item["link"] for item in images][:8]

    if brand.get("name"):
        specs.setdefault("Brand", brand["name"])
    if structured.get("category"):
        specs.setdefault("Category", structured["category"])
    if aggregate_rating.get("ratingCount"):
        specs.setdefault("Rating Count", str(aggregate_rating["ratingCount"]))
    if aggregate_rating.get("reviewCount"):
        specs.setdefault("Review Count", str(aggregate_rating["reviewCount"]))
    if sizes:
        specs.setdefault("Size Chart", ', '.join(sizes))

    return {
        "title": title or "Untitled product",
        "price": price_text or "0",
        "rating": rating_text or "No rating",
        "main_image": images[0] if images else fallback_image,
        "images": images,
        "sizes": sizes,
        "description": description,
        "specifications": specs,
        "link": product_url,
    }


def build_search_only_product(candidate):
    title = candidate.get("fallback_title") or "Untitled product"
    return {
        "title": title,
        "price": candidate.get("fallback_price") or "0",
        "rating": candidate.get("fallback_rating") or "No rating",
        "main_image": normalize_image_url(candidate.get("fallback_image") or ""),
        "images": [normalize_image_url(candidate.get("fallback_image"))] if candidate.get("fallback_image") else [],
        "sizes": [],
        "description": "",
        "specifications": {},
        "link": candidate.get("product_url") or "",
    }


def normalize_for_app(raw_product, index):
    current_price = parse_price(raw_product.get("price"))
    original_price = parse_price(raw_product.get("specifications", {}).get("MRP")) or current_price
    rating_value = raw_product.get("rating")

    return {
        "id": f"flipkart-{index + 1}",
        "name": raw_product.get("title") or f"Flipkart Product {index + 1}",
        "category": "Electronics",
        "brand": slug_to_brand(raw_product.get("title")),
        "price": current_price,
        "originalPrice": original_price,
        "rating": parse_rating(rating_value if isinstance(rating_value, str) else str(rating_value)),
        "stock": 0,
        "reviewsCount": 0,
        "description": raw_product.get("description") or "",
        "image": raw_product.get("main_image") or "",
        "images": raw_product.get("images") or [],
        "featureImages": [],
        "isTrending": parse_rating(str(rating_value)) >= 4.2,
        "isDeal": original_price > current_price > 0,
        "sizes": raw_product.get("sizes") or [],
        "measurements": raw_product.get("specifications") or {},
        "source": raw_product.get("link") or "",
    }


def build_card_candidates(search_soup):
    candidates = []
    seen_ids = set()

    for card in search_soup.select("div[data-id]"):
        product_id = card.get("data-id")
        if not product_id or product_id in seen_ids:
            continue
        seen_ids.add(product_id)

        link_tag = card.select_one("a[href*='pid=']")
        if not link_tag or not link_tag.get("href"):
            continue

        image_tag = card.select_one("img") or link_tag.select_one("img")
        fallback_image = ""
        if image_tag:
            fallback_image = normalize_image_url(image_tag.get("src") or image_tag.get("data-src") or "")

        fallback_title = ""
        if image_tag and image_tag.get("alt") and image_tag.get("alt").strip().lower() != "flipkart":
            fallback_title = image_tag["alt"]
        if not fallback_title:
            card_text = card.get_text(" ", strip=True)
            cleaned_text = re.sub(r"\s+", " ", card_text)
            cleaned_text = re.sub(r"^Add to Compare\s*", "", cleaned_text, flags=re.IGNORECASE)
            title_match = re.match(r"(.+?)\s+₹\s?[\d,]+", cleaned_text)
            fallback_title = title_match.group(1).strip() if title_match else link_tag.get_text(" ", strip=True)

        card_text = card.get_text(" ", strip=True)
        fallback_price = parse_price_from_text(card_text)
        fallback_rating = parse_rating_from_text(card_text)

        candidates.append({
            "card": card,
            "product_url": urljoin(BASE_URL, link_tag["href"].split("&lid=")[0]),
            "fallback_title": fallback_title,
            "fallback_price": fallback_price,
            "fallback_rating": fallback_rating,
            "fallback_image": fallback_image,
        })

    return candidates


def scrape_query(query, max_pages, max_products, delay_seconds, timeout, search_only=False):
    session = requests.Session()
    session.headers.update(DEFAULT_HEADERS)
    collected = []

    for page in range(1, max_pages + 1):
        search_url = SEARCH_URL.format(query=quote_plus(query), page=page)
        response = session.get(search_url, timeout=timeout)
        if response.status_code == 403 and "recaptcha" in response.text.lower():
            raise RuntimeError(
                "Flipkart returned a reCAPTCHA challenge. Plain requests scraping is blocked "
                "for this session, so use a browser-backed approach or valid session cookies."
            )
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "lxml")
        candidates = build_card_candidates(soup)
        if not candidates:
            break

        for candidate in candidates:
            if search_only:
                collected.append(build_search_only_product(candidate))
            else:
                try:
                    product_response = session.get(candidate["product_url"], timeout=timeout)
                    product_response.raise_for_status()
                    product_soup = BeautifulSoup(product_response.text, "lxml")

                    raw_product = build_raw_product(
                        candidate["card"],
                        product_soup,
                        product_response.text,
                        candidate["product_url"],
                        candidate["fallback_title"],
                        candidate["fallback_price"],
                        candidate["fallback_rating"],
                        candidate["fallback_image"],
                    )
                    collected.append(raw_product)
                except requests.RequestException:
                    continue

            if max_products and len(collected) >= max_products:
                return dedupe(collected)[:max_products]

            if not search_only:
                time.sleep(delay_seconds)

    products = dedupe(collected)
    return products[:max_products] if max_products else products


def scrape_query_with_playwright(query, max_pages, max_products, delay_seconds, timeout, channel, search_only=False):
    try:
        from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
        from playwright.sync_api import sync_playwright
    except ImportError as error:
        raise RuntimeError(
            "Playwright is not installed. Run `python -m pip install playwright` first."
        ) from error

    collected = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            channel=channel,
            headless=True,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = browser.new_context(
            user_agent=DEFAULT_HEADERS["User-Agent"],
            locale="en-IN",
            viewport={"width": 1440, "height": 2200},
        )
        page = context.new_page()

        try:
            for current_page in range(1, max_pages + 1):
                search_url = SEARCH_URL.format(query=quote_plus(query), page=current_page)
                page.goto(search_url, wait_until="domcontentloaded", timeout=timeout * 1000)
                page.wait_for_timeout(1200)

                search_html = page.content()
                if "Are you a human?" in search_html or "recaptcha" in search_html.lower():
                    raise RuntimeError(
                        "Flipkart returned a reCAPTCHA challenge even in the browser session."
                    )

                search_soup = BeautifulSoup(search_html, "lxml")
                candidates = build_card_candidates(search_soup)
                if not candidates:
                    break

                for candidate in candidates:
                    if search_only:
                        collected.append(build_search_only_product(candidate))
                    else:
                        try:
                            detail_page = context.new_page()
                            detail_page.goto(
                                candidate["product_url"],
                                wait_until="domcontentloaded",
                                timeout=timeout * 1000,
                            )
                            detail_page.wait_for_timeout(800)
                            detail_html = detail_page.content()
                            detail_page.close()

                            product_soup = BeautifulSoup(detail_html, "lxml")
                            raw_product = build_raw_product(
                                candidate["card"],
                                product_soup,
                                detail_html,
                                candidate["product_url"],
                                candidate["fallback_title"],
                                candidate["fallback_price"],
                                candidate["fallback_rating"],
                                candidate["fallback_image"],
                            )
                            collected.append(raw_product)
                        except PlaywrightTimeoutError:
                            continue

                    if max_products and len(collected) >= max_products:
                        return dedupe(collected)[:max_products]

                    if not search_only:
                        time.sleep(delay_seconds)
        finally:
            context.close()
            browser.close()

    products = dedupe(collected)
    return products[:max_products] if max_products else products


def scrape_multiple_queries(queries, max_pages, max_products, delay_seconds, timeout, engine, channel, search_only=False):
    collected = []

    for query in queries:
        remaining = max(max_products - len(collected), 0) if max_products else 0
        if max_products and remaining == 0:
            break

        if engine == "playwright":
            query_products = scrape_query_with_playwright(
                query=query,
                max_pages=max_pages,
                max_products=remaining or max_products,
                delay_seconds=delay_seconds,
                timeout=timeout,
                channel=channel,
                search_only=search_only,
            )
        else:
            query_products = scrape_query(
                query=query,
                max_pages=max_pages,
                max_products=remaining or max_products,
                delay_seconds=delay_seconds,
                timeout=timeout,
                search_only=search_only,
            )

        collected.extend(query_products)
        collected = dedupe(collected)
        collected = [item for item in collected if is_valid_product_record(item)]

        if max_products and len(collected) >= max_products:
            return collected[:max_products]

    collected = [item for item in collected if is_valid_product_record(item)]
    return collected[:max_products] if max_products else collected


def write_json(output_path, payload):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Scrape Flipkart search results and product detail pages.")
    parser.add_argument("--query", default="laptop", help="Search query to use on Flipkart.")
    parser.add_argument(
        "--queries",
        default="",
        help="Comma-separated list of queries to scrape in one run.",
    )
    parser.add_argument("--pages", type=int, default=1, help="Number of search result pages to scrape.")
    parser.add_argument("--max-products", type=int, default=12, help="Maximum number of products to save.")
    parser.add_argument("--delay", type=float, default=2.0, help="Delay between product detail requests in seconds.")
    parser.add_argument("--timeout", type=int, default=20, help="HTTP timeout in seconds.")
    parser.add_argument(
        "--output",
        default="scapper/flipkart_products_full.json",
        help="Output JSON path.",
    )
    parser.add_argument(
        "--format",
        choices=["raw", "app"],
        default="raw",
        help="raw keeps the scraped fields; app writes the storefront electronics JSON shape.",
    )
    parser.add_argument(
        "--engine",
        choices=["playwright", "requests"],
        default="playwright",
        help="Browser-backed Playwright is the default because Flipkart often blocks plain HTTP scraping.",
    )
    parser.add_argument(
        "--browser-channel",
        default="msedge",
        help="Browser channel for Playwright, for example msedge or chrome.",
    )
    parser.add_argument(
        "--search-only",
        action="store_true",
        help="Collect from search result cards only for much faster large crawls.",
    )
    args = parser.parse_args()

    queries = parse_query_list(args.query, args.queries)

    scraper_kwargs = {
        "queries": queries,
        "max_pages": max(args.pages, 1),
        "max_products": max(args.max_products, 1),
        "delay_seconds": max(args.delay, 0),
        "timeout": max(args.timeout, 1),
        "engine": args.engine,
        "channel": args.browser_channel,
        "search_only": args.search_only,
    }

    raw_products = scrape_multiple_queries(**scraper_kwargs)

    payload = raw_products if args.format == "raw" else [
        normalize_for_app(product, index) for index, product in enumerate(raw_products)
    ]

    output_path = Path(args.output)
    write_json(output_path, payload)
    print(f"Saved {len(payload)} products to {output_path}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Scrape failed: {error}")
        raise

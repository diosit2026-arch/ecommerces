import fs from 'fs'

const brands = [
"Samsung","Sony","LG","Apple","Dell","HP","Lenovo","Asus",
"Acer","OnePlus","Realme","Xiaomi","Boat","JBL","Canon","Nikon"
]

const productNames = [
"Smart LED TV",
"Wireless Bluetooth Headphones",
"Gaming Laptop",
"Mechanical Keyboard",
"Wireless Mouse",
"Smartphone",
"DSLR Camera",
"Smart Watch",
"Portable Speaker",
"Tablet",
"Gaming Monitor",
"Noise Cancelling Headphones",
"External SSD",
"VR Headset",
"Drone Camera"
]

const products = []

for(let i=1;i<=150;i++){

const brand = brands[Math.floor(Math.random()*brands.length)]
const name = productNames[Math.floor(Math.random()*productNames.length)]

const price = Math.floor(Math.random()*50000)+2000
const originalPrice = price + Math.floor(Math.random()*10000)

products.push({
id: i + 100,
name: `${brand} ${name} Model ${i}`,
description: `High performance ${name} from ${brand}. Designed with latest technology for premium performance, durability and seamless connectivity.`,
price: price,
originalPrice: originalPrice,
rating: parseFloat((Math.random()*1+4).toFixed(1)),
reviewsCount: Math.floor(Math.random()*10000),
category: "Electronics",
brand: brand,

image: `https://picsum.photos/seed/electronics${i}/600/600`,

images:[
`https://picsum.photos/seed/electronics${i}a/600/600`,
`https://picsum.photos/seed/electronics${i}b/600/600`,
`https://picsum.photos/seed/electronics${i}c/600/600`,
`https://picsum.photos/seed/electronics${i}d/600/600`
],

isTrending: Math.random()>0.6,
isDeal: Math.random()>0.5,

sizes: [],
measurements: {}

})

}

fs.writeFileSync("c:\\ecommercanti\\src\\data\\electronicsProducts.json", JSON.stringify(products,null,2))

console.log("150 Electronics Products Generated Successfully")

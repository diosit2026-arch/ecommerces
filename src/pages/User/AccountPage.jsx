import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Bell,
  Eye,
  EyeOff,
  LogOut,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  User,
} from 'lucide-react';
import Seo from '../../components/seo/Seo';
import { siteName, siteUrl } from '../../utils/siteContent';
import { useUserStore } from '../../store/useUserStore';

const authTabs = [
  { id: 'login', label: 'Log In' },
  { id: 'signup', label: 'Sign Up' },
];

const accountTabs = [
  { id: 'profile', label: 'Account Details', icon: User },
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'addresses', label: 'Saved Address', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9]\d{9}$/;
const pinCodePattern = /^\d{6}$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const formatTrackingDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getOrderTracking = (createdAt) => {
  const placedAt = new Date(createdAt || new Date().toISOString());
  const dispatchedAt = new Date(placedAt.getTime() + 5 * DAY_IN_MS);
  const inTransitAt = new Date(placedAt.getTime() + 10 * DAY_IN_MS);
  const deliveredAt = new Date(placedAt.getTime() + 15 * DAY_IN_MS);
  const now = new Date();

  let status = 'Placed';
  let activeIndex = 0;
  if (now >= deliveredAt) {
    status = 'Delivered';
    activeIndex = 3;
  } else if (now >= inTransitAt) {
    status = 'In Transit';
    activeIndex = 2;
  } else if (now >= dispatchedAt) {
    status = 'Dispatched';
    activeIndex = 1;
  }

  return {
    status,
    steps: [
      { label: 'Placed', date: formatTrackingDate(placedAt) },
      { label: 'Dispatched', date: formatTrackingDate(dispatchedAt) },
      { label: 'In Transit', date: formatTrackingDate(inTransitAt) },
      { label: 'Delivered', date: formatTrackingDate(deliveredAt) },
    ],
    activeIndex,
  };
};

const defaultAddressForm = {
  title: 'Home',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

const AccountPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, login, signup, logout, updateProfile, addAddress } =
    useUserStore();

  const tabFromQuery = searchParams.get('tab');
  const activeTab = accountTabs.some((tab) => tab.id === tabFromQuery) ? tabFromQuery : 'profile';

  const [authMode, setAuthMode] = useState('login');
  const [authMessage, setAuthMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [addressMessage, setAddressMessage] = useState('');
  const [authErrors, setAuthErrors] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [addressForm, setAddressForm] = useState({
    ...defaultAddressForm,
    fullName: user?.name || '',
    phone: user?.phone || '',
  });

  React.useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setAddressForm((state) => ({
      ...state,
      fullName: user?.name || state.fullName || '',
      phone: user?.phone || state.phone || '',
    }));
  }, [user]);

  const userInitials = useMemo(() => {
    if (!user?.name) {
      return 'NC';
    }

    return user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [user]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!emailPattern.test(loginForm.email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!loginForm.password.trim()) {
      errors.password = 'Password is required.';
    }
    setAuthErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    const result = login(loginForm);
    setAuthMessage(result.message);
    if (result.success) {
      navigate('/account?tab=profile');
    }
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    const errors = {};

    if (!signupForm.name.trim()) errors.name = 'Full name is required.';
    if (!emailPattern.test(signupForm.email.trim())) errors.email = 'Enter a valid email address.';
    if (!phonePattern.test(signupForm.phone.trim())) errors.phone = 'Enter a valid 10-digit mobile number.';
    if (signupForm.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (signupForm.password !== signupForm.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    setAuthErrors(errors);
    if (Object.keys(errors).length > 0) {
      setAuthMessage('Please fix the highlighted fields.');
      return;
    }

    const result = signup({
      name: signupForm.name,
      email: signupForm.email,
      phone: signupForm.phone,
      password: signupForm.password,
    });

    setAuthMessage(result.message);
    if (result.success) {
      navigate('/account?tab=profile');
    }
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!profileForm.name.trim()) errors.name = 'Full name is required.';
    if (!emailPattern.test(profileForm.email.trim())) errors.email = 'Enter a valid email address.';
    if (profileForm.phone.trim() && !phonePattern.test(profileForm.phone.trim())) {
      errors.phone = 'Enter a valid 10-digit mobile number.';
    }
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) {
      setProfileMessage('Please fix the highlighted fields.');
      return;
    }
    const result = updateProfile(profileForm);
    setProfileMessage(result.message);
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!addressForm.title.trim()) errors.title = 'Address title is required.';
    if (!addressForm.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!phonePattern.test(addressForm.phone.trim())) errors.phone = 'Enter a valid 10-digit mobile number.';
    if (!addressForm.line1.trim()) errors.line1 = 'Street address is required.';
    if (!addressForm.city.trim()) errors.city = 'City is required.';
    if (!addressForm.state.trim()) errors.state = 'State is required.';
    if (!pinCodePattern.test(addressForm.postalCode.trim())) errors.postalCode = 'Enter a valid 6-digit PIN code.';
    if (!addressForm.country.trim()) errors.country = 'Country is required.';
    setAddressErrors(errors);
    if (Object.keys(errors).length > 0) {
      setAddressMessage('Please fix the highlighted fields.');
      return;
    }
    const result = addAddress(addressForm);
    setAddressMessage(result.message);

    if (result.success) {
      setAddressForm({
        ...defaultAddressForm,
        fullName: user?.name || '',
        phone: user?.phone || '',
      });
      setShowAddAddress(false);
    }
  };

  const handleLogout = () => {
    logout();
    setSearchParams({});
  };

  if (!isAuthenticated) {
    const isLogin = authMode === 'login';

    return (
      <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
        <Seo
          title="Login and Signup"
          description={`Create your ${siteName} account or log in to access saved orders, addresses, and notifications.`}
          canonical={`${siteUrl}/account`}
        />

        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.92))] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr,0.95fr]">
              <div className="border-b border-white/8 p-8 sm:p-10 lg:border-b-0 lg:border-r">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  <ShieldCheck size={14} />
                  NamshyCart Account
                </div>
                <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight text-white">
                  Shop faster with your saved details in one clean account.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
                  Log in to view your orders, saved addresses, and alerts. Sign up once and the same
                  details will work every time on this device.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
                    <p className="text-sm font-semibold text-white">Order history</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Every order you place from checkout appears in your account automatically.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
                    <p className="text-sm font-semibold text-white">Saved addresses</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Add and reuse delivery addresses directly from your profile page.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
                    <p className="text-sm font-semibold text-white">Frontend only</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      This demo stores your account data locally in the browser for easy testing.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
                    <p className="text-sm font-semibold text-white">Fast access</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Your account icon, profile details, and notifications stay available after login.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="rounded-[1.8rem] border border-white/10 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
                  <div className="grid grid-cols-2 gap-2 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-2">
                    {authTabs.map((tab) => {
                      const active = tab.id === authMode;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setAuthMode(tab.id);
                            setAuthMessage('');
                          }}
                          className={`rounded-[1.1rem] px-5 py-4 text-base font-semibold transition-all ${
                            active
                              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(168,85,247,0.28)]'
                              : 'border border-white/10 bg-slate-900 text-slate-300 hover:border-white/20 hover:bg-slate-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8">
                    <h2 className="text-4xl font-bold text-white">
                      {isLogin ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="mt-3 text-lg text-slate-400">
                      {isLogin
                        ? 'Log in with the same email and password used during signup.'
                        : 'Sign up once and use the same details every time you log in.'}
                    </p>
                  </div>

                  {authMessage ? (
                    <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                      {authMessage}
                    </div>
                  ) : null}

                  {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
                        <input
                          type="email"
                          value={loginForm.email}
                          onChange={(event) =>
                            setLoginForm((state) => ({ ...state, email: event.target.value }))
                          }
                          placeholder="you@example.com"
                          required
                          className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 text-lg text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {authErrors.email && <p className="mt-2 text-xs text-red-400">{authErrors.email}</p>}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                        <div className="relative">
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            value={loginForm.password}
                            onChange={(event) =>
                              setLoginForm((state) => ({ ...state, password: event.target.value }))
                            }
                            placeholder="Enter your password"
                            required
                            className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 pr-14 text-lg text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword((value) => !value)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                            aria-label="Toggle password visibility"
                          >
                            {showLoginPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                          </button>
                        </div>
                        {authErrors.password && <p className="mt-2 text-xs text-red-400">{authErrors.password}</p>}
                      </div>

                      <button
                        type="submit"
                        className="h-16 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-xl font-bold text-white shadow-[0_16px_35px_rgba(168,85,247,0.28)] transition-transform hover:-translate-y-0.5"
                      >
                        Log In
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignupSubmit} className="mt-8 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Full name</label>
                        <input
                          type="text"
                          value={signupForm.name}
                          onChange={(event) =>
                            setSignupForm((state) => ({ ...state, name: event.target.value }))
                          }
                          placeholder="Enter your full name"
                          required
                          className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 text-lg text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {authErrors.name && <p className="mt-2 text-xs text-red-400">{authErrors.name}</p>}
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
                          <input
                            type="email"
                            value={signupForm.email}
                            onChange={(event) =>
                              setSignupForm((state) => ({ ...state, email: event.target.value }))
                            }
                            placeholder="you@example.com"
                            required
                            className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 text-lg text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                          />
                          {authErrors.email && <p className="mt-2 text-xs text-red-400">{authErrors.email}</p>}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-200">Phone number</label>
                          <input
                            type="tel"
                            value={signupForm.phone}
                            onChange={(event) =>
                              setSignupForm((state) => ({ ...state, phone: event.target.value }))
                            }
                            placeholder="+91 98765 43210"
                            className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 text-lg text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                          />
                          {authErrors.phone && <p className="mt-2 text-xs text-red-400">{authErrors.phone}</p>}
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                          <div className="relative">
                            <input
                              type={showSignupPassword ? 'text' : 'password'}
                              value={signupForm.password}
                              onChange={(event) =>
                                setSignupForm((state) => ({ ...state, password: event.target.value }))
                              }
                              placeholder="Minimum 6 characters"
                              required
                              className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 pr-14 text-lg text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword((value) => !value)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                              aria-label="Toggle signup password visibility"
                            >
                              {showSignupPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                            </button>
                          </div>
                          {authErrors.password && <p className="mt-2 text-xs text-red-400">{authErrors.password}</p>}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-200">Confirm password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={signupForm.confirmPassword}
                              onChange={(event) =>
                                setSignupForm((state) => ({
                                  ...state,
                                  confirmPassword: event.target.value,
                                }))
                              }
                              placeholder="Repeat your password"
                              required
                              className="h-16 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-5 pr-14 text-lg text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((value) => !value)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                              aria-label="Toggle confirm password visibility"
                            >
                              {showConfirmPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                            </button>
                          </div>
                          {authErrors.confirmPassword && <p className="mt-2 text-xs text-red-400">{authErrors.confirmPassword}</p>}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="h-16 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-xl font-bold text-white shadow-[0_16px_35px_rgba(168,85,247,0.28)] transition-transform hover:-translate-y-0.5"
                      >
                        Create Account
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title="My Account"
        description={`Manage your ${siteName} profile, view order history, save addresses, and track account notifications.`}
        canonical={`${siteUrl}/account`}
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[290px,1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
            <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,211,238,0.12),rgba(15,23,42,0.7))] p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 text-xl font-bold text-slate-950">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-white">{user?.name}</p>
                  <p className="truncate text-sm text-slate-300">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="mt-5 space-y-2">
              {accountTabs.map((tab) => {
                const Icon = tab.icon;
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-medium transition-all ${
                      active
                        ? 'bg-white text-slate-950 shadow-[0_16px_35px_rgba(255,255,255,0.12)]'
                        : 'border border-white/8 bg-white/[0.03] text-slate-200 hover:bg-white/[0.07]'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-slate-950' : 'text-cyan-300'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/15 bg-red-500/8 px-4 py-4 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/12"
            >
              <LogOut size={18} />
              Logout
            </button>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.25)] sm:p-7">
            {activeTab === 'profile' && (
              <div>
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Profile</p>
                  <h1 className="mt-3 text-3xl font-bold text-white">Account details</h1>
                  <p className="mt-3 max-w-2xl text-slate-400">
                    Keep your contact information updated so checkout and saved addresses feel faster.
                  </p>
                </div>

                {profileMessage ? (
                  <div className="mb-6 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                    {profileMessage}
                  </div>
                ) : null}

                <form onSubmit={handleProfileSubmit} className="grid gap-5 lg:grid-cols-2">
                  <div className="lg:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-200">Full name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(event) =>
                        setProfileForm((state) => ({ ...state, name: event.target.value }))
                      }
                      required
                      className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                    />
                    {profileErrors.name && <p className="mt-2 text-xs text-red-400">{profileErrors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(event) =>
                        setProfileForm((state) => ({ ...state, email: event.target.value }))
                      }
                      required
                      className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                    />
                    {profileErrors.email && <p className="mt-2 text-xs text-red-400">{profileErrors.email}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">Phone number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(event) =>
                        setProfileForm((state) => ({ ...state, phone: event.target.value }))
                      }
                      className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                    />
                    {profileErrors.phone && <p className="mt-2 text-xs text-red-400">{profileErrors.phone}</p>}
                  </div>

                  <div className="lg:col-span-2">
                    <button
                      type="submit"
                      className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-4 text-sm font-bold text-white shadow-[0_16px_35px_rgba(168,85,247,0.28)] transition-transform hover:-translate-y-0.5"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Orders</p>
                  <h1 className="mt-3 text-3xl font-bold text-white">Order history</h1>
                  <p className="mt-3 max-w-2xl text-slate-400">
                    Orders placed from checkout are stored for this logged-in user and shown here.
                  </p>
                </div>

                {user?.orders?.length ? (
                  <div className="space-y-5">
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5"
                      >
                        {(() => {
                          const tracking = getOrderTracking(order.createdAt);
                          return (
                            <>
                        <div className="flex flex-col gap-4 border-b border-white/8 pb-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-lg font-semibold text-white">{order.id}</p>
                            <p className="mt-1 text-sm text-slate-400">Placed on {order.date}</p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                              {tracking.status}
                            </span>
                            <span className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                              {formatInr(order.total)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 lg:grid-cols-4">
                          {tracking.steps.map((step, index) => {
                            const isCompleted = index < tracking.activeIndex;
                            const isActive = index === tracking.activeIndex;

                            return (
                              <div
                                key={`${order.id}-${step.label}`}
                                className={`rounded-2xl border px-4 py-4 ${
                                  isCompleted
                                    ? 'border-emerald-400/20 bg-emerald-400/10'
                                    : isActive
                                      ? 'border-cyan-300/20 bg-cyan-400/10'
                                      : 'border-white/8 bg-slate-950/60'
                                }`}
                              >
                                <p
                                  className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                                    isCompleted
                                      ? 'text-emerald-300'
                                      : isActive
                                        ? 'text-cyan-200'
                                        : 'text-slate-500'
                                  }`}
                                >
                                  {isCompleted ? `${step.label} Done` : isActive ? step.label : `Expected ${step.label}`}
                                </p>
                                <p className="mt-2 text-sm font-medium text-white">{step.date}</p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-5 grid gap-4 xl:grid-cols-[1.3fr,0.7fr]">
                          <div className="space-y-3">
                            {order.items?.map((item) => (
                              <div
                                key={`${order.id}-${item.id}`}
                                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-slate-950/70 p-3"
                              >
                                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white p-1">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold leading-6 text-white">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-400">
                                    Qty {item.quantity} • {formatInr(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
                            <p className="text-sm font-semibold text-white">Delivery address</p>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                              {order.address?.fullName}
                              <br />
                              {order.address?.line1}
                              {order.address?.line2 ? `, ${order.address.line2}` : ''}
                              <br />
                              {order.address?.city}, {order.address?.state} {order.address?.postalCode}
                              <br />
                              {order.address?.country}
                            </p>
                          </div>
                        </div>
                            </>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.8rem] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
                    <Package size={36} className="mx-auto text-cyan-300" />
                    <h2 className="mt-5 text-2xl font-semibold text-white">No orders yet</h2>
                    <p className="mx-auto mt-3 max-w-lg text-slate-400">
                      Once this user places an order from checkout, it will appear here automatically.
                    </p>
                    <Link
                      to="/products"
                      className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Addresses</p>
                    <h1 className="mt-3 text-3xl font-bold text-white">Saved address</h1>
                    <p className="mt-3 max-w-2xl text-slate-400">
                      Add delivery locations for faster checkout and keep them saved to this account.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAddress((value) => !value);
                      setAddressMessage('');
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(168,85,247,0.28)]"
                  >
                    <Plus size={18} />
                    Add Address
                  </button>
                </div>

                {addressMessage ? (
                  <div className="mb-6 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                    {addressMessage}
                  </div>
                ) : null}

                {showAddAddress && (
                  <form
                    onSubmit={handleAddressSubmit}
                    className="mb-6 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Address title</label>
                        <input
                          type="text"
                          value={addressForm.title}
                          onChange={(event) =>
                            setAddressForm((state) => ({ ...state, title: event.target.value }))
                          }
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {addressErrors.title && <p className="mt-2 text-xs text-red-400">{addressErrors.title}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Full name</label>
                        <input
                          type="text"
                          value={addressForm.fullName}
                          onChange={(event) =>
                            setAddressForm((state) => ({ ...state, fullName: event.target.value }))
                          }
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {addressErrors.fullName && <p className="mt-2 text-xs text-red-400">{addressErrors.fullName}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Phone number</label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(event) =>
                            setAddressForm((state) => ({ ...state, phone: event.target.value }))
                          }
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {addressErrors.phone && <p className="mt-2 text-xs text-red-400">{addressErrors.phone}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Street address</label>
                        <input
                          type="text"
                          value={addressForm.line1}
                          onChange={(event) =>
                            setAddressForm((state) => ({ ...state, line1: event.target.value }))
                          }
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {addressErrors.line1 && <p className="mt-2 text-xs text-red-400">{addressErrors.line1}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-200">
                          Apartment, suite, landmark
                        </label>
                        <input
                          type="text"
                          value={addressForm.line2}
                          onChange={(event) =>
                            setAddressForm((state) => ({ ...state, line2: event.target.value }))
                          }
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">City</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(event) =>
                            setAddressForm((state) => ({ ...state, city: event.target.value }))
                          }
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {addressErrors.city && <p className="mt-2 text-xs text-red-400">{addressErrors.city}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">State</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(event) =>
                            setAddressForm((state) => ({ ...state, state: event.target.value }))
                          }
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {addressErrors.state && <p className="mt-2 text-xs text-red-400">{addressErrors.state}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">PIN code</label>
                        <input
                          type="text"
                          value={addressForm.postalCode}
                          onChange={(event) =>
                            setAddressForm((state) => ({
                              ...state,
                              postalCode: event.target.value,
                            }))
                          }
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {addressErrors.postalCode && <p className="mt-2 text-xs text-red-400">{addressErrors.postalCode}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">Country</label>
                        <input
                          type="text"
                          value={addressForm.country}
                          onChange={(event) =>
                            setAddressForm((state) => ({ ...state, country: event.target.value }))
                          }
                          required
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-5 text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                        />
                        {addressErrors.country && <p className="mt-2 text-xs text-red-400">{addressErrors.country}</p>}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.05]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {user?.addresses?.length ? (
                  <div className="grid gap-5 xl:grid-cols-2">
                    {user.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold text-white">{address.title}</p>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                              {address.fullName}
                              <br />
                              {address.line1}
                              {address.line2 ? `, ${address.line2}` : ''}
                              <br />
                              {address.city}, {address.state} {address.postalCode}
                              <br />
                              {address.country}
                              <br />
                              {address.phone}
                            </p>
                          </div>
                          <span className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                            Saved
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.8rem] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
                    <MapPin size={36} className="mx-auto text-cyan-300" />
                    <h2 className="mt-5 text-2xl font-semibold text-white">No saved addresses yet</h2>
                    <p className="mx-auto mt-3 max-w-lg text-slate-400">
                      Use the Add Address button to save delivery details for faster future checkouts.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Alerts</p>
                  <h1 className="mt-3 text-3xl font-bold text-white">Notifications</h1>
                  <p className="mt-3 max-w-2xl text-slate-400">
                    Frontend order updates and account messages for this user appear here.
                  </p>
                </div>

                {user?.notifications?.length ? (
                  <div className="space-y-4">
                    {user.notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                            <Bell size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-white">{notification.title}</p>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                              {notification.detail}
                            </p>
                            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.8rem] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
                    <Bell size={36} className="mx-auto text-cyan-300" />
                    <h2 className="mt-5 text-2xl font-semibold text-white">No notifications yet</h2>
                    <p className="mx-auto mt-3 max-w-lg text-slate-400">
                      New order updates and important account messages will appear here for this user.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

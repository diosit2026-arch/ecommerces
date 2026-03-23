import React, { useEffect, useMemo, useState } from 'react';
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
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9]\d{9}$/;
const pinCodePattern = /^\d{6}$/;

const defaultAddressForm = {
  title: 'Office',
  fullName: '',
  phone: '9047770806',
  line1: 'Arihant Technopolis, 131 Rajiv Gandhi Salai',
  line2: 'Kandhanchavadi, Perungudi',
  city: 'Chennai',
  state: 'Tamil Nadu',
  postalCode: '600096',
  country: 'India',
};

const AccountPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, login, signup, logout, updateProfile, addAddress } = useUserStore();
  const activeTab = accountTabs.some((tab) => tab.id === searchParams.get('tab')) ? searchParams.get('tab') : 'profile';

  const [authMode, setAuthMode] = useState('login');
  const [authMessage, setAuthMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [addressMessage, setAddressMessage] = useState('');
  const [authErrors, setAuthErrors] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [addressForm, setAddressForm] = useState(defaultAddressForm);

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setAddressForm({
      ...defaultAddressForm,
      fullName: user?.name || '',
      phone: user?.phone || '',
    });
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

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!emailPattern.test(loginForm.email.trim())) errors.email = 'Enter a valid email address.';
    if (!loginForm.password.trim()) errors.password = 'Password is required.';
    setAuthErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = login(loginForm);
    setAuthMessage(result.message);
    if (result.success) navigate('/account?tab=profile');
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
    if (result.success) navigate('/account?tab=profile');
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!profileForm.name.trim()) errors.name = 'Full name is required.';
    if (!emailPattern.test(profileForm.email.trim())) errors.email = 'Enter a valid email address.';
    if (profileForm.phone.trim() && !phonePattern.test(profileForm.phone.trim())) errors.phone = 'Enter a valid 10-digit mobile number.';
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

  if (!isAuthenticated) {
    const isLogin = authMode === 'login';

    return (
      <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
        <Seo
          title="Login and Signup"
          description={`Create your ${siteName} account or log in to access saved orders, addresses, and notifications.`}
          canonical={`${siteUrl}/account`}
        />

        <div className="aurora-panel mx-auto grid max-w-6xl gap-0 overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(199,255,107,0.12),rgba(11,27,35,0.96),rgba(255,122,81,0.14),rgba(99,245,210,0.08))] shadow-[0_34px_100px_rgba(0,0,0,0.32)] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfff9b33] bg-[#c7ff6b18] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f2ffcc]">
              <ShieldCheck size={14} />
              Infinity Cart Account
            </div>
            <h1 className="section-title mt-6 max-w-md text-4xl font-bold leading-tight text-white">
              Animated account space with bolder color and cleaner control.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-textSecondary">
              Login, profile, order history, and address management now sit inside the same high-energy visual language as the storefront.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                'Saved order history',
                'Faster address reuse',
                'Frontend-only demo storage',
                'Cleaner profile editing',
              ].map((item) => (
                <div key={item} className="spot-grid rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-[#d7edf9]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="spot-grid rounded-[1.8rem] border border-white/10 bg-[#0a1c24]/80 p-5">
              <div className="grid grid-cols-2 gap-2 rounded-[1.4rem] border border-white/10 bg-[#091a2a] p-2">
                {authTabs.map((tab) => {
                  const active = tab.id === authMode;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setAuthMode(tab.id);
                        setAuthMessage('');
                        setAuthErrors({});
                      }}
                      className={`rounded-[1rem] px-4 py-3 text-base font-semibold transition-all ${
                        active ? 'bg-white text-slate-950' : 'text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8">
                <h2 className="section-title text-4xl font-bold text-white">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="mt-3 text-lg text-textSecondary">
                  {isLogin ? 'Use your saved account details to log in.' : 'Sign up once and reuse the same account every time you shop.'}
                </p>
              </div>

              {authMessage && (
                <div className="mt-6 rounded-[1.2rem] border border-[#dfff9b33] bg-[#c7ff6b18] px-4 py-3 text-sm text-[#f2ffcc]">
                  {authMessage}
                </div>
              )}

              {isLogin ? (
                <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
                  <Field
                    label="Email address"
                    type="email"
                    value={loginForm.email}
                    onChange={(value) => setLoginForm((state) => ({ ...state, email: value }))}
                    error={authErrors.email}
                    placeholder="you@example.com"
                  />
                  <PasswordField
                    label="Password"
                    value={loginForm.password}
                    onChange={(value) => setLoginForm((state) => ({ ...state, password: value }))}
                    error={authErrors.password}
                    placeholder="Enter your password"
                    visible={showLoginPassword}
                    onToggle={() => setShowLoginPassword((value) => !value)}
                  />
                  <button type="submit" className="shimmer-line h-14 w-full rounded-full bg-white text-lg font-bold text-slate-950 transition-colors hover:bg-[#f2ffc8]">
                    Log In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="mt-8 space-y-5">
                  <Field
                    label="Full name"
                    value={signupForm.name}
                    onChange={(value) => setSignupForm((state) => ({ ...state, name: value }))}
                    error={authErrors.name}
                    placeholder="Enter your full name"
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Email address"
                      type="email"
                      value={signupForm.email}
                      onChange={(value) => setSignupForm((state) => ({ ...state, email: value }))}
                      error={authErrors.email}
                      placeholder="you@example.com"
                    />
                    <Field
                      label="Phone number"
                      type="tel"
                      value={signupForm.phone}
                      onChange={(value) => setSignupForm((state) => ({ ...state, phone: value }))}
                      error={authErrors.phone}
                      placeholder="9876543210"
                    />
                  </div>
                  <PasswordField
                    label="Password"
                    value={signupForm.password}
                    onChange={(value) => setSignupForm((state) => ({ ...state, password: value }))}
                    error={authErrors.password}
                    placeholder="At least 6 characters"
                    visible={showSignupPassword}
                    onToggle={() => setShowSignupPassword((value) => !value)}
                  />
                  <PasswordField
                    label="Confirm password"
                    value={signupForm.confirmPassword}
                    onChange={(value) => setSignupForm((state) => ({ ...state, confirmPassword: value }))}
                    error={authErrors.confirmPassword}
                    placeholder="Re-enter your password"
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((value) => !value)}
                  />
                  <button type="submit" className="shimmer-line h-14 w-full rounded-full bg-white text-lg font-bold text-slate-950 transition-colors hover:bg-[#f2ffc8]">
                    Create Account
                  </button>
                </form>
              )}
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
        description={`Manage your ${siteName} profile, orders, saved addresses, and notifications.`}
        canonical={`${siteUrl}/account`}
      />

      <div className="mx-auto max-w-7xl">
        <div className="aurora-panel mb-8 rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(199,255,107,0.12),rgba(11,27,35,0.95),rgba(255,122,81,0.12),rgba(99,245,210,0.08))] p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="pulse-ring flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-slate-950">
                {userInitials}
              </div>
              <div>
                <p className="eyebrow">Account dashboard</p>
                <h1 className="section-title mt-2 text-3xl font-bold text-white">{user?.name}</h1>
                <p className="mt-2 text-sm text-textSecondary">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                setSearchParams({});
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="spot-grid rounded-[2rem] border border-white/10 bg-[#0a1c24]/90 p-4">
            <div className="space-y-2">
              {accountTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchParams({ tab: tab.id })}
                  className={`flex w-full items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'bg-white text-slate-950' : 'text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <tab.icon size={17} />
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          <section className="aurora-panel rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(10,24,31,0.96))] p-6 sm:p-8">
            {activeTab === 'profile' && (
              <div>
                <SectionHeader
                  eyebrow="Profile"
                  title="Account details"
                  description="Update your name, email, and phone number for faster checkout."
                />
                {profileMessage && <MessageBox message={profileMessage} />}
                <form onSubmit={handleProfileSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
                  <Field
                    label="Full name"
                    value={profileForm.name}
                    onChange={(value) => setProfileForm((state) => ({ ...state, name: value }))}
                    error={profileErrors.name}
                  />
                  <Field
                    label="Email address"
                    type="email"
                    value={profileForm.email}
                    onChange={(value) => setProfileForm((state) => ({ ...state, email: value }))}
                    error={profileErrors.email}
                  />
                  <Field
                    label="Phone number"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(value) => setProfileForm((state) => ({ ...state, phone: value }))}
                    error={profileErrors.phone}
                  />
                  <div className="md:col-span-2">
                    <button type="submit" className="shimmer-line rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-[#f2ffc8]">
                      Save profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <SectionHeader
                  eyebrow="Orders"
                  title="Order history"
                  description="Orders placed from checkout appear here automatically."
                />
                {user?.orders?.length ? (
                  <div className="mt-8 space-y-5">
                    {user.orders.map((order) => (
                      <div key={order.id} className="spot-grid rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-sm text-textSecondary">Order {order.id}</p>
                            <h3 className="mt-2 text-xl font-semibold text-white">{order.status}</h3>
                            <p className="mt-2 text-sm text-textSecondary">Placed on {order.date}</p>
                          </div>
                          <div className="rounded-full bg-[#c7ff6b18] px-4 py-2 text-sm font-medium text-[#f2ffcc]">
                            Total {formatInr(order.total)}
                          </div>
                        </div>
                        <div className="mt-5 grid gap-3">
                          {order.items?.map((item) => (
                            <div key={`${order.id}-${item.id}`} className="flex items-center gap-4 rounded-[1.2rem] border border-white/10 bg-[#09161d] p-3">
                              <div className="h-16 w-16 overflow-hidden rounded-[1rem] bg-white p-1">
                                <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-white">{item.name}</p>
                                <p className="mt-1 text-xs text-textSecondary">Qty {item.quantity} | {formatInr(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Package}
                    title="No orders yet"
                    description="Once you place an order from checkout, it will appear here."
                    action={<Link to="/products" className="shimmer-line rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">Start Shopping</Link>}
                  />
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <SectionHeader
                    eyebrow="Addresses"
                    title="Saved addresses"
                    description="Save delivery locations for quicker future checkouts."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAddress((value) => !value);
                      setAddressMessage('');
                    }}
                    className="shimmer-line inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                  >
                    <Plus size={16} />
                    Add Address
                  </button>
                </div>

                {addressMessage && <MessageBox message={addressMessage} />}

                {showAddAddress && (
                  <form onSubmit={handleAddressSubmit} className="mb-6 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Address title" value={addressForm.title} onChange={(value) => setAddressForm((state) => ({ ...state, title: value }))} error={addressErrors.title} />
                      <Field label="Full name" value={addressForm.fullName} onChange={(value) => setAddressForm((state) => ({ ...state, fullName: value }))} error={addressErrors.fullName} />
                      <Field label="Phone number" type="tel" value={addressForm.phone} onChange={(value) => setAddressForm((state) => ({ ...state, phone: value }))} error={addressErrors.phone} />
                      <Field label="Street address" value={addressForm.line1} onChange={(value) => setAddressForm((state) => ({ ...state, line1: value }))} error={addressErrors.line1} />
                      <div className="md:col-span-2">
                        <Field label="Apartment, suite, landmark" value={addressForm.line2} onChange={(value) => setAddressForm((state) => ({ ...state, line2: value }))} />
                      </div>
                      <Field label="City" value={addressForm.city} onChange={(value) => setAddressForm((state) => ({ ...state, city: value }))} error={addressErrors.city} />
                      <Field label="State" value={addressForm.state} onChange={(value) => setAddressForm((state) => ({ ...state, state: value }))} error={addressErrors.state} />
                      <Field label="PIN code" value={addressForm.postalCode} onChange={(value) => setAddressForm((state) => ({ ...state, postalCode: value }))} error={addressErrors.postalCode} />
                      <Field label="Country" value={addressForm.country} onChange={(value) => setAddressForm((state) => ({ ...state, country: value }))} error={addressErrors.country} />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="submit" className="shimmer-line rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">Save Address</button>
                      <button type="button" onClick={() => setShowAddAddress(false)} className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white">Cancel</button>
                    </div>
                  </form>
                )}

                {user?.addresses?.length ? (
                  <div className="grid gap-5 xl:grid-cols-2">
                    {user.addresses.map((address) => (
                      <div key={address.id} className="spot-grid rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold text-white">{address.title}</p>
                            <p className="mt-3 text-sm leading-7 text-textSecondary">
                              {address.fullName}<br />
                              {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                              {address.city}, {address.state} {address.postalCode}<br />
                              {address.country}<br />
                              {address.phone}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#c7ff6b18] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f2ffcc]">Saved</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={MapPin} title="No saved addresses yet" description="Use the Add Address button to save delivery details for faster checkouts." />
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <SectionHeader
                  eyebrow="Notifications"
                  title="Alerts and updates"
                  description="Frontend order updates and important account messages appear here."
                />
                {user?.notifications?.length ? (
                  <div className="mt-8 space-y-4">
                    {user.notifications.map((notification) => (
                      <div key={notification.id} className="spot-grid rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c7ff6b18] text-primary">
                            <Bell size={18} />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-white">{notification.title}</p>
                            <p className="mt-2 text-sm leading-7 text-textSecondary">{notification.detail}</p>
                            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#74b7b0]">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Bell} title="No notifications yet" description="New order updates and important account messages will appear here." />
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ eyebrow, title, description }) => (
  <div>
    <p className="eyebrow">{eyebrow}</p>
    <h1 className="section-title mt-3 text-3xl font-bold text-white">{title}</h1>
    <p className="mt-3 max-w-2xl text-textSecondary">{description}</p>
  </div>
);

const MessageBox = ({ message }) => (
  <div className="mb-6 rounded-[1.2rem] border border-[#dfff9b33] bg-[#c7ff6b18] px-4 py-3 text-sm text-[#f2ffcc]">
    {message}
  </div>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="rounded-[1.8rem] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
    <Icon size={36} className="mx-auto text-primary" />
    <h2 className="mt-5 text-2xl font-semibold text-white">{title}</h2>
    <p className="mx-auto mt-3 max-w-lg text-textSecondary">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

const Field = ({ label, value, onChange, error, placeholder = '', type = 'text' }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-[#d6e9f7]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-14 w-full rounded-[1rem] border border-white/10 bg-[#09161d] px-4 text-white outline-none focus:border-[#dfff9b55]"
    />
    {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
  </div>
);

const PasswordField = ({ label, value, onChange, error, placeholder, visible, onToggle }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-[#d6e9f7]">{label}</label>
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-[1rem] border border-white/10 bg-[#09161d] px-4 pr-12 text-white outline-none focus:border-[#dfff9b55]"
      />
      <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary">
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
  </div>
);

export default AccountPage;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

const MotionDiv = motion.div;
const formatInr = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const AccountPage = () => {
  const { isAuthenticated, user, login, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, name: email.split('@')[0] });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl border border-gray-800"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your FlipShop account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 font-bold hover:shadow-lg transition-all"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Don't have an account? <a href="#" className="text-primary hover:underline font-medium">Sign up</a>
          </div>
        </MotionDiv>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const mockOrders = [
    { id: '#ORD-1092', date: 'Oct 24, 2026', total: 129.99, status: 'Delivered', items: 2 },
    { id: '#ORD-0842', date: 'Sep 12, 2026', total: 349.5, status: 'Shipped', items: 1 },
    { id: '#ORD-0711', date: 'Aug 05, 2026', total: 89, status: 'Delivered', items: 3 },
  ];

  return (
    <div className="min-h-screen bg-background pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-surface rounded-2xl border border-gray-800 p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'} alt="User Avatar" className="w-16 h-16 rounded-full bg-gray-800 border-2 border-primary" />
                <div>
                  <h2 className="text-xl font-bold text-white capitalize">{user?.name}</h2>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <tab.icon size={18} className="mr-3" />
                      {tab.label}
                    </div>
                    {activeTab === tab.id && <ChevronRight size={16} />}
                  </button>
                ))}
              </nav>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-3 bg-surface border border-gray-800 hover:bg-red-500/10 hover:text-red-500 text-gray-400 rounded-2xl transition-all"
            >
              <LogOut size={18} className="mr-2" /> Log Out
            </button>
          </div>

          <div className="md:w-3/4">
            <div className="bg-surface rounded-2xl border border-gray-800 p-8 min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <MotionDiv
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <input type="text" defaultValue={user?.name} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <input type="email" defaultValue={user?.email} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary opacity-70" disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                        <input type="tel" placeholder="+91 98765 43210" className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
                        <input type="date" className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                      <button className="px-6 py-3 bg-primary hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </MotionDiv>
                )}

                {activeTab === 'orders' && (
                  <MotionDiv
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border border-gray-800 rounded-xl p-6 bg-background hover:border-gray-600 transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-800">
                            <div>
                              <h3 className="font-bold text-white">{order.id}</h3>
                              <p className="text-sm text-gray-400">Placed on {order.date}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 text-left sm:text-right">
                              <p className="font-bold text-white">{formatInr(order.total)}</p>
                              <p className="text-sm text-gray-400">{order.items} items</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                            <button className="text-primary hover:text-white font-medium text-sm">View Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </MotionDiv>
                )}

                {activeTab === 'settings' && (
                  <MotionDiv
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border border-gray-800 rounded-xl">
                        <div>
                          <h4 className="text-white font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-400">Receive order updates and promotions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-800 rounded-xl">
                        <div>
                          <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-400">Add an extra layer of security</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-600 rounded-lg text-white text-sm hover:bg-gray-800 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-gray-800">
                      <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
                      <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

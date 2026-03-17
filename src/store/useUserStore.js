import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const createAvatar = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'demo')}`;

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const normalizeAddress = (address = {}, fallbackName = '') => ({
  id: address.id || `addr-${Date.now()}`,
  title: address.title || 'Address',
  fullName: address.fullName || fallbackName || 'Account Holder',
  phone: address.phone || '',
  line1: address.line1 || '',
  line2: address.line2 || '',
  city: address.city || '',
  state: address.state || '',
  postalCode: address.postalCode || '',
  country: address.country || 'India',
});

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: normalizeEmail(user.email),
  phone: user.phone || '',
  avatar: user.avatar || createAvatar(user.email || user.name),
  createdAt: user.createdAt || new Date().toISOString(),
  orders: Array.isArray(user.orders) ? user.orders : [],
  addresses: Array.isArray(user.addresses) ? user.addresses : [],
  notifications: Array.isArray(user.notifications) ? user.notifications : [],
});

const updateRegisteredUser = (registeredUsers, userId, updater) =>
  registeredUsers.map((registeredUser) =>
    registeredUser.id === userId ? updater(registeredUser) : registeredUser,
  );

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],

      signup: ({ name, email, password, phone = '' }) => {
        const normalizedEmail = normalizeEmail(email);
        const existingUser = get().registeredUsers.find(
          (registeredUser) => normalizeEmail(registeredUser.email) === normalizedEmail,
        );

        if (existingUser) {
          return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser = sanitizeUser({
          id: `user-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          avatar: createAvatar(normalizedEmail),
          createdAt: new Date().toISOString(),
          orders: [],
          addresses: [],
          notifications: [],
        });

        const userRecord = { ...newUser, password };

        set((state) => ({
          registeredUsers: [...state.registeredUsers, userRecord],
          user: newUser,
          isAuthenticated: true,
        }));

        return { success: true, message: 'Account created successfully.' };
      },

      login: ({ email, password }) => {
        const normalizedEmail = normalizeEmail(email);
        const existingUser = get().registeredUsers.find(
          (registeredUser) => normalizeEmail(registeredUser.email) === normalizedEmail,
        );

        if (!existingUser) {
          return { success: false, message: 'No account found with this email.' };
        }

        if (existingUser.password !== password) {
          return { success: false, message: 'Incorrect password. Please try again.' };
        }

        set({
          user: sanitizeUser(existingUser),
          isAuthenticated: true,
        });

        return { success: true, message: 'Login successful.' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        set((state) => {
          if (!state.user) {
            return state;
          }

          const updatedUser = sanitizeUser({
            ...state.user,
            ...updates,
            avatar: createAvatar(updates.email || state.user.email),
          });

          const updatedRegisteredUsers = updateRegisteredUser(
            state.registeredUsers,
            state.user.id,
            (registeredUser) => ({ ...registeredUser, ...updatedUser }),
          );

          return {
            user: updatedUser,
            registeredUsers: updatedRegisteredUsers,
          };
        });

        return { success: true, message: 'Profile updated successfully.' };
      },

      addAddress: (address) => {
        const state = get();
        if (!state.user) {
          return { success: false, message: 'Please log in to add an address.' };
        }

        const currentAddresses = Array.isArray(state.user.addresses) ? state.user.addresses : [];
        const nextAddress = normalizeAddress(address, state.user.name);
        const updatedUser = sanitizeUser({
          ...state.user,
          addresses: [...currentAddresses, nextAddress],
        });

        set({
          user: updatedUser,
          registeredUsers: updateRegisteredUser(
            state.registeredUsers,
            state.user.id,
            (registeredUser) => ({
              ...registeredUser,
              addresses: [...(registeredUser.addresses || []), nextAddress],
            }),
          ),
        });

        return { success: true, message: 'Address added successfully.' };
      },

      placeOrder: ({ items, totals, shippingAddress }) => {
        const state = get();
        if (!state.user) {
          return { success: false, message: 'Please log in to save your order.' };
        }

        const currentOrders = Array.isArray(state.user.orders) ? state.user.orders : [];
        const currentAddresses = Array.isArray(state.user.addresses) ? state.user.addresses : [];
        const currentNotifications = Array.isArray(state.user.notifications)
          ? state.user.notifications
          : [];
        const orderId = `#ORD-${Date.now().toString().slice(-6)}`;
        const normalizedAddress = normalizeAddress(shippingAddress, state.user.name);
        const createdAt = new Date().toISOString();
        const order = {
          id: orderId,
          date: new Date(createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          createdAt,
          total: totals.total,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          status: 'Placed',
          address: normalizedAddress,
        };

        const notification = {
          id: `note-${Date.now()}`,
          title: 'Order placed successfully',
          detail: `Your order ${orderId} has been placed and will be processed shortly.`,
          time: 'Just now',
          createdAt,
        };

        const hasAddress = currentAddresses.some(
          (address) =>
            address.line1 === normalizedAddress.line1 &&
            address.postalCode === normalizedAddress.postalCode,
        );

        const nextAddresses = hasAddress
          ? currentAddresses
          : [...currentAddresses, normalizedAddress];

        const updatedUser = sanitizeUser({
          ...state.user,
          orders: [order, ...currentOrders],
          addresses: nextAddresses,
          notifications: [notification, ...currentNotifications],
        });

        set({
          user: updatedUser,
          registeredUsers: updateRegisteredUser(
            state.registeredUsers,
            state.user.id,
            (registeredUser) => ({
              ...registeredUser,
              orders: [order, ...(registeredUser.orders || [])],
              addresses: hasAddress
                ? (registeredUser.addresses || [])
                : [...(registeredUser.addresses || []), normalizedAddress],
              notifications: [notification, ...(registeredUser.notifications || [])],
            }),
          ),
        });

        return { success: true, message: 'Order placed successfully.', order };
      },
    }),
    {
      name: 'user-storage',
    },
  ),
);

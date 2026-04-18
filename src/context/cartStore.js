import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  total: 0,

  // Add to cart
  addItem: (cartItem) => set((state) => {
    const existingItem = state.items.find(item => item.id === cartItem.id);
    let updated;
    
    if (existingItem) {
      updated = state.items.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + cartItem.quantity }
          : item
      );
    } else {
      updated = [...state.items, cartItem];
    }
    
    return {
      items: updated,
      total: updated.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  }),

  // Remove from cart
  removeItem: (productId) => set((state) => {
    const updated = state.items.filter(item => item.id !== productId);
    return {
      items: updated,
      total: updated.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  }),

  // Update quantity
  updateQuantity: (productId, quantity) => set((state) => {
    const updated = state.items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    return {
      items: updated,
      total: updated.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  }),

  // Clear cart
  clearCart: () => set({ items: [], total: 0 }),

  // Set items
  setItems: (items) => set((state) => ({
    items,
    total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })),
}));

export default useCartStore;

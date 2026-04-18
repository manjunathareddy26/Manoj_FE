import api from './api';

// Auth API calls
export const authService = {
  // Google login with role
  googleLogin: (token, role) => api.post('/auth/google', { token, role }),
  
  // Google auth URL (for redirect flow if needed)
  getGoogleAuthURL: () => {
    // This would be used if implementing server-side Google OAuth
    return 'https://accounts.google.com/o/oauth2/v2/auth';
  },
  
  // Check if user exists (by email)
  checkUserExists: (email) => api.post('/auth/check-user', { email }),
  
  // Request OTP for signup
  requestOTPSignup: (email, firstName, lastName) => 
    api.post('/auth/request-otp-signup', { email, firstName, lastName }),
  
  // Verify OTP for signup
  verifyOTPSignup: (email, otp, password) => 
    api.post('/auth/verify-otp-signup', { email, otp, password }),
  
  // Request OTP for signin
  requestOTPSignin: (email, password) => 
    api.post('/auth/request-otp-signin', { email, password }),
  
  // Verify OTP for signin
  verifyOTPSignin: (email, otp) => 
    api.post('/auth/verify-otp-signin', { email, otp }),
  
  // Complete profile
  completeProfile: (data) => api.post('/auth/complete-profile', data),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Update profile
  updateProfile: (data) => api.put('/auth/profile', data),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

// Products API calls
export const productService = {
  // Get all products
  getAllProducts: (filters = {}) => api.get('/products', { params: filters }),
  
  // Get single product
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Get farmer products
  getFarmerProducts: () => api.get('/products/farmer/my-products'),
  
  // Add product
  addProduct: (data) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Update product
  updateProduct: (id, data) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Search products
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
};

// Cart API calls
export const cartService = {
  // Get cart
  getCart: () => api.get('/cart'),
  
  // Add to cart
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  
  // Update cart item
  updateCartItem: (cartItemId, quantity) => api.put(`/cart/${cartItemId}`, { quantity }),
  
  // Remove from cart
  removeFromCart: (cartItemId) => api.delete(`/cart/${cartItemId}`),
  
  // Clear cart
  clearCart: () => api.delete('/cart'),
};

// Orders API calls
export const orderService = {
  // Get all orders (consumer view)
  getConsumerOrders: () => api.get('/orders'),
  
  // Get single order
  getOrder: (id) => api.get(`/orders/${id}`),
  
  // Get order tracking details
  getOrderTracking: (id) => api.get(`/orders/${id}/tracking`),
  
  // Farmer - get received orders
  getFarmerOrders: () => api.get('/orders/farmer/received'),
  
  // Create order
  createOrder: (data) => api.post('/orders', data),
  
  // Update order status (Farmer - for delivery tracking)
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  
  // Accept order (Farmer)
  acceptOrder: (id) => api.post(`/orders/${id}/accept`),
  
  // Reject order (Farmer)
  rejectOrder: (id, reason) => api.post(`/orders/${id}/reject`, { reason }),
  
  // Update payment status
  updatePaymentStatus: (id, paymentStatus) => api.put(`/orders/${id}/payment-status`, { paymentStatus }),
};

// Payments API calls
export const paymentService = {
  // Create Razorpay order
  createRazorpayOrder: (amount) => api.post('/payments/razorpay/create', { amount }),
  
  // Verify Razorpay payment
  verifyRazorpayPayment: (paymentData) => api.post('/payments/razorpay/verify', paymentData),
  
  // Get payment status
  getPaymentStatus: (orderId) => api.get(`/payments/status/${orderId}`),
};

// Dashboard API calls
export const dashboardService = {
  // Farmer dashboard stats
  getFarmerStats: () => api.get('/dashboard/farmer/stats'),
  
  // Consumer dashboard stats
  getConsumerStats: () => api.get('/dashboard/consumer/stats'),
  
  // Earnings
  getEarnings: (period = 'month') => api.get('/dashboard/farmer/earnings', { params: { period } }),
};

const services = {
  authService,
  productService,
  cartService,
  orderService,
  paymentService,
  dashboardService,
};

export default services;

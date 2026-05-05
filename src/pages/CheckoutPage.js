import React, { useState } from 'react';
import { MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCartStore from '../context/cartStore';
import { orderService } from '../services/index';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (item.price * (item.quantityType === 'kg' ? item.quantity / item.weight_per_bag : item.quantity));
    }, 0);
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() ||
        !formData.address.trim() || !formData.city.trim() || !formData.state.trim() ||
        !formData.zipCode.trim()) {
      toast.error('All fields are required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email address');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          quantityType: item.quantityType,
          price: item.price,
          weight_per_bag: item.weight_per_bag,
        })),
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
      };

      const response = await orderService.createOrder(orderData);
      const orderId = response.data.data.id;

      if (paymentMethod === 'cod') {
        // Direct COD order - mark as unpaid
        await orderService.updatePaymentStatus(orderId, 'pending_payment');
        clearCart();
        toast.success('✅ Order placed successfully! Pay on delivery.');
        navigate('/orders');
      } else if (paymentMethod === 'upi') {
        // Redirect to payment page for UPI/Razorpay payment
        clearCart();
        navigate(`/payment/${orderId}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMsg = error.response?.data?.message || 'Failed to place order';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-[#10b981] font-semibold mb-8 hover:text-[#059669]"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-[#64748B]">Your cart is empty</p>
            <button
              onClick={() => navigate('/consumer')}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-[#10b981] font-semibold mb-8 hover:text-[#059669]"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Delivery Address Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                  <MapPin size={24} className="text-[#10b981]" />
                  Delivery Address
                </h2>

                <div className="space-y-4">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
                    pattern="\d{10}"
                    required
                  />

                  {/* Address */}
                  <textarea
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
                    required
                  />

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
                      required
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                  <CreditCard size={24} className="text-[#10b981]" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#10b981] bg-[#10b98110]'
                        : 'border-[#E2E8F0] hover:border-[#10b981]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 mt-1 cursor-pointer"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-[#0F172A]">Cash on Delivery (COD)</p>
                      <p className="text-sm text-[#64748B]">Pay when your order is delivered</p>
                    </div>
                  </label>

                  {/* UPI Payment */}
                  <label
                    className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#10b981] bg-[#10b98110]'
                        : 'border-[#E2E8F0] hover:border-[#10b981]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 mt-1 cursor-pointer"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-[#0F172A]">UPI Payment</p>
                      <p className="text-sm text-[#64748B]">Pay via UPI, Debit Card, or Wallet using Razorpay</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 mb-6 pb-6 border-b border-[#E2E8F0]">
                {items.map((item, index) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#64748B]">
                      {item.name} ({item.quantityType === 'bags' ? `${item.quantity} bags` : `${item.quantity}kg`})
                    </span>
                    <span className="font-semibold text-[#0F172A]">
                      ₹{(item.price * (item.quantityType === 'kg' ? item.quantity / item.weight_per_bag : item.quantity)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-[#E2E8F0]">
                <div className="flex justify-between text-[#64748B]">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-[#0F172A]">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-[#10b981]">FREE</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Tax (estimated)</span>
                  <span className="font-semibold text-[#0F172A]">₹0</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6 text-xl">
                <span className="font-bold text-[#0F172A]">Total Amount</span>
                <span className="font-bold text-[#10b981]">₹{total.toLocaleString()}</span>
              </div>

              {/* Info Box */}
              <div className="bg-[#10b98110] border-l-4 border-[#10b981] p-4 rounded text-sm text-[#10b981]">
                {paymentMethod === 'cod'
                  ? 'You will pay ₹' + total.toLocaleString() + ' when the order is delivered'
                  : 'You will be redirected to payment gateway after placing order'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

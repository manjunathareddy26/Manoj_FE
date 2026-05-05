import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCartStore from '../context/cartStore';
import imgSrc from '../utils/imgSrc';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const handleQuantityUpdate = (itemId, quantity, type) => {
    if (quantity <= 0) return;
    updateQuantity(itemId, quantity, type);
  };

  // Calculate total price
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const weightPerBag = Number(item.weight_per_bag) || 1;
      
      const itemTotal = item.quantityType === 'kg'
        ? price * (quantity / weightPerBag)
        : price * quantity;
      
      return sum + (itemTotal || 0);
    }, 0);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8EFF7]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate('/consumer')}
            className="text-[#10b981] font-semibold mb-6 hover:text-[#059669]"
          >
            ← Back to Shop
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart size={64} className="mx-auto mb-4 text-[#CBD5E1]" />
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Your Cart is Empty</h1>
            <p className="text-[#64748B] mb-8 text-lg">Explore our farm products and add items to get started</p>
            <button
              onClick={() => navigate('/consumer')}
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all"
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/consumer')}
          className="text-[#10b981] font-semibold mb-6 hover:text-[#059669]"
        >
          ← Back to Shop
        </button>

        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Shopping Cart</h1>
        <p className="text-[#64748B] mb-8">Review and manage your items</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const type = item.quantityType || 'bags';
              const quantity = Number(item.quantity) || 0;
              const price = Number(item.price) || 0;
              const weightPerBag = Number(item.weight_per_bag) || 1;
              
              // Calculate based on quantity type
              let displayQuantity = '';
              let itemPrice = 0;
              
              if (type === 'kg') {
                displayQuantity = `${quantity}kg`;
                itemPrice = (quantity / weightPerBag) * price;
              } else {
                displayQuantity = `${quantity} ${quantity === 1 ? 'bag' : 'bags'}`;
                itemPrice = quantity * price;
              }

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex gap-4 mb-4">
                    {item.image && (
                      <img
                        src={imgSrc(item.image)}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#0F172A]">{item.name}</h3>
                      <p className="text-[#64748B]">
                        ₹{price.toLocaleString()} / bag
                        {weightPerBag > 0 && <span className="text-sm ml-2 text-[#94A3B8]">(₹{(price / weightPerBag).toFixed(0)}/kg)</span>}
                      </p>
                      <p className="text-sm text-[#94A3B8]">{weightPerBag}kg per bag</p>
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <div className="bg-[#F1F5F9] p-4 rounded-lg mb-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm text-[#64748B] font-semibold block mb-2">Buy by Bags</label>
                        <div className="flex items-center border-2 border-[#E2E8F0] rounded-lg bg-white">
                          <button
                            onClick={() => handleQuantityUpdate(item.id, Math.max(1, quantity - 1), 'bags')}
                            className="p-2 text-[#64748B] hover:text-[#10b981]"
                          >
                            <Minus size={18} />
                          </button>
                          <input
                            type="number"
                            value={type === 'bags' ? quantity : ''}
                            onChange={(e) => handleQuantityUpdate(item.id, Math.max(1, parseInt(e.target.value) || 1), 'bags')}
                            className="flex-1 px-3 py-2 text-center font-semibold text-[#0F172A] border-0 outline-none"
                            placeholder={type === 'kg' ? '1' : quantity}
                            min="1"
                          />
                          <button
                            onClick={() => handleQuantityUpdate(item.id, quantity + 1, 'bags')}
                            className="p-2 text-[#64748B] hover:text-[#10b981]"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="text-sm text-[#64748B] font-semibold block mb-2">Or by Weight (kg)</label>
                        <div className="flex items-center border-2 border-[#E2E8F0] rounded-lg bg-white">
                          <button
                            onClick={() => handleQuantityUpdate(item.id, Math.max(weightPerBag, quantity - weightPerBag), 'kg')}
                            className="p-2 text-[#64748B] hover:text-[#10b981]"
                          >
                            <Minus size={18} />
                          </button>
                          <input
                            type="number"
                            value={type === 'kg' ? quantity : ''}
                            onChange={(e) => handleQuantityUpdate(item.id, Math.max(weightPerBag, parseInt(e.target.value) || weightPerBag), 'kg')}
                            className="flex-1 px-3 py-2 text-center font-semibold text-[#0F172A] border-0 outline-none"
                            placeholder={type === 'bags' ? weightPerBag : quantity}
                            min={weightPerBag}
                            step={weightPerBag}
                          />
                          <button
                            onClick={() => handleQuantityUpdate(item.id, quantity + weightPerBag, 'kg')}
                            className="p-2 text-[#64748B] hover:text-[#10b981]"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]">
                    <div>
                      <p className="text-sm text-[#64748B] font-semibold">
                        {displayQuantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#10b981]">
                          ₹{(itemPrice || 0).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-bold text-[#0F172A] mb-6">Order Summary</h2>

              {/* breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-[#E2E8F0]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Items ({items.length})</span>
                  <span className="font-semibold text-[#0F172A]">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Delivery</span>
                  <span className="font-semibold text-[#10b981]">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Tax</span>
                  <span className="font-semibold text-[#0F172A]">Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6 text-xl">
                <span className="font-bold text-[#0F172A]">Total</span>
                <span className="font-bold text-[#10b981]">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              {/* Buttons */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/consumer')}
                className="w-full px-6 py-3 border-2 border-[#E2E8F0] text-[#0F172A] font-bold rounded-xl hover:bg-[#F8FAFC] transition-colors"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => {
                  clearCart();
                  toast.info('Cart cleared');
                }}
                className="w-full px-6 py-3 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors mt-3"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

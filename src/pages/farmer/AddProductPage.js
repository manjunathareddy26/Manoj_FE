import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';
import { productService } from '../../services/index';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    bags: '',
    weight_per_bag: '',
    description: '',
    image: null,
    imagePreview: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return false;
    }
    if (!formData.bags || parseInt(formData.bags) <= 0) {
      toast.error('Number of bags must be greater than 0');
      return false;
    }
    if (!formData.weight_per_bag || parseFloat(formData.weight_per_bag) <= 0) {
      toast.error('Weight per bag must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const productForm = new FormData();
      productForm.append('name', formData.name);
      productForm.append('price', parseFloat(formData.price));
      productForm.append('bags', parseInt(formData.bags));
      productForm.append('weight_per_bag', parseFloat(formData.weight_per_bag));
      productForm.append('description', formData.description || '');
      
      if (formData.image) {
        productForm.append('image', formData.image);
      }

      await productService.addProduct(productForm);
      
      toast.success('Product added successfully!');
      navigate('/farmer/products');
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add product';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Add New Product</h1>
        <p className="text-[#64748B]">List your farm products on FarmBridge</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-[#0F172A] font-semibold mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Organic Rice, Fresh Tomatoes"
              className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#0F172A] font-semibold mb-2">
              Price per Bag (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 2500"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
            />
          </div>

          {/* Bags and Weight Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#0F172A] font-semibold mb-2">
                Number of Bags *
              </label>
              <input
                type="number"
                name="bags"
                value={formData.bags}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                min="1"
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-[#0F172A] font-semibold mb-2">
                Weight per Bag (kg) *
              </label>
              <input
                type="number"
                name="weight_per_bag"
                value={formData.weight_per_bag}
                onChange={handleInputChange}
                placeholder="e.g., 25"
                min="0.1"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#0F172A] font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about your product (quality, farming method, certifications, etc.)"
              rows="4"
              className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A]"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[#0F172A] font-semibold mb-3">
              Product Image
            </label>

            {formData.imagePreview ? (
              <div className="relative inline-block">
                <img 
                  src={formData.imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-xl border-2 border-[#10b981]"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                <Upload className="w-8 h-8 text-[#10b981] mb-2" />
                <span className="text-sm text-[#64748B]">
                  Click to upload product image
                </span>
                <span className="text-xs text-[#94A3B8] mt-1">
                  Max 5MB. JPG, PNG, GIF
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Product Summary */}
          <div className="bg-[#F1F5F9] p-4 rounded-xl">
            <h3 className="font-semibold text-[#0F172A] mb-2">Product Summary</h3>
            <div className="space-y-1 text-sm text-[#64748B]">
              <p>
                <span className="font-medium">Total Weight:</span> {formData.bags && formData.weight_per_bag ? `${(parseInt(formData.bags) * parseFloat(formData.weight_per_bag))} kg` : 'N/A'}
              </p>
              <p>
                <span className="font-medium">Total Value:</span> ₹{formData.bags && formData.price ? (parseInt(formData.bags) * parseFloat(formData.price)).toLocaleString() : '0'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/farmer/products')}
              className="flex-1 px-6 py-3 border-2 border-[#E2E8F0] text-[#0F172A] font-bold rounded-xl hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;

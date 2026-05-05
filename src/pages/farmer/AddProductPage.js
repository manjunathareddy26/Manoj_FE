import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, X, Tag, Package, Scale, FileText, Loader2, IndianRupee, Hash } from 'lucide-react';
import { productService } from '../../services/index';

const FieldError = ({ msg }) => msg ? (
  <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
    <span className="w-1 h-1 bg-red-500 rounded-full" /> {msg}
  </p>
) : null;

const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errs.price = 'Enter a valid price greater than 0';
    if (!formData.bags || parseInt(formData.bags) <= 0) errs.bags = 'Number of bags must be at least 1';
    if (!formData.weight_per_bag || parseFloat(formData.weight_per_bag) <= 0) errs.weight_per_bag = 'Weight per bag must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
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

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Product Name */}
          <div>
            <label className="block text-[#0F172A] font-semibold mb-1.5 text-sm">Product Name *</label>
            <div className="relative">
              <Tag size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Organic Rice, Fresh Tomatoes"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A] text-sm ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                }`}
              />
            </div>
            <FieldError msg={errors.name} />
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#0F172A] font-semibold mb-1.5 text-sm">Price per Bag (₹) *</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 2500"
                min="0"
                step="0.01"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A] text-sm ${
                  errors.price ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                }`}
              />
            </div>
            <FieldError msg={errors.price} />
          </div>

          {/* Bags and Weight Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#0F172A] font-semibold mb-1.5 text-sm">Number of Bags *</label>
              <div className="relative">
                <Hash size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="number"
                  name="bags"
                  value={formData.bags}
                  onChange={handleInputChange}
                  placeholder="e.g., 10"
                  min="1"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A] text-sm ${
                    errors.bags ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                  }`}
                />
              </div>
              <FieldError msg={errors.bags} />
            </div>
            <div>
              <label className="block text-[#0F172A] font-semibold mb-1.5 text-sm">Weight per Bag (kg) *</label>
              <div className="relative">
                <Scale size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="number"
                  name="weight_per_bag"
                  value={formData.weight_per_bag}
                  onChange={handleInputChange}
                  placeholder="e.g., 25"
                  min="0.1"
                  step="0.1"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A] text-sm ${
                    errors.weight_per_bag ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                  }`}
                />
              </div>
              <FieldError msg={errors.weight_per_bag} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#0F172A] font-semibold mb-1.5 text-sm">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Quality, farming method, certifications, storage..."
                rows="3"
                className="w-full pl-10 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A] text-sm resize-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[#0F172A] font-semibold mb-2 text-sm">
              Product Image <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            {formData.imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-28 h-28 object-cover rounded-xl border-2 border-[#10b981] shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-colors"
                >
                  <X size={14} />
                </button>
                <p className="text-xs text-green-600 mt-2 font-medium">✓ Image selected</p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#10b981] hover:bg-green-50/30 transition-all group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-[#10b981]" />
                </div>
                <span className="text-sm font-semibold text-[#0F172A]">Click to upload image</span>
                <span className="text-xs text-[#94A3B8] mt-1">JPG, PNG, WebP — Max 5MB</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Product Summary */}
          {(formData.bags && formData.weight_per_bag && formData.price) && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-4 rounded-xl">
              <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2 text-sm">
                <Package size={16} className="text-[#10b981]" /> Product Summary
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-lg p-2.5">
                  <p className="text-xs text-gray-500">Total Weight</p>
                  <p className="font-bold text-gray-800 text-sm">{(parseInt(formData.bags) * parseFloat(formData.weight_per_bag)).toLocaleString()} kg</p>
                </div>
                <div className="bg-white rounded-lg p-2.5">
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="font-bold text-[#10b981] text-sm">₹{(parseInt(formData.bags) * parseFloat(formData.price)).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-2.5">
                  <p className="text-xs text-gray-500">Per kg</p>
                  <p className="font-bold text-gray-800 text-sm">₹{(parseFloat(formData.price) / parseFloat(formData.weight_per_bag)).toFixed(0)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/farmer/products')}
              className="flex-1 px-6 py-3 border-2 border-[#E2E8F0] text-[#0F172A] font-semibold rounded-xl hover:bg-[#F8FAFC] hover:border-gray-300 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg shadow-[0_4px_14px_rgba(16,185,129,0.25)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Adding Product...</>
              ) : (
                <><Package size={18} /> Add Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
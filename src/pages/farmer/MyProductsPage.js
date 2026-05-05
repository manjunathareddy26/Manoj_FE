import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, Package, Leaf } from 'lucide-react';
import { productService } from '../../services/index';
import { toast } from 'react-toastify';
import imgSrc from '../../utils/imgSrc';

const MyProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getFarmerProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-green-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#10b981] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf size={18} className="text-[#10b981]" />
            </div>
          </div>
          <p className="text-[#64748B] font-semibold">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">My Products</h1>
          <p className="text-[#64748B] mt-1">Manage your farm products</p>
        </div>
        <button
          onClick={() => navigate('/farmer/add-product')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all duration-200"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Package size={48} className="mx-auto mb-4 text-[#CBD5E1]" />
          <p className="text-xl text-[#64748B] mb-6">No products yet</p>
          <button
            onClick={() => navigate('/farmer/add-product')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl"
          >
            <Plus size={20} />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F1F5F9] border-b-2 border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0F172A]">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0F172A]">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0F172A]">Available</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0F172A]">Weight/Bag</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0F172A]">Total Value</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-[#0F172A]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={imgSrc(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0F172A]">{product.name}</p>
                          <p className="text-sm text-[#64748B]">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A]">₹{product.price.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A]">{product.bags} bags</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A]">{product.weight_per_bag} kg</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#10b981]">
                        ₹{(product.price * product.bags).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/farmer/edit-product/${product.id}`)}
                          className="p-2 text-[#10b981] hover:bg-[#10b98125] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100">
                <div className="w-full h-44 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 relative">
                  {product.image ? (
                    <img
                      src={imgSrc(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={40} className="text-green-200" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                <h3 className="font-bold text-[#0F172A] text-lg mb-2">{product.name}</h3>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Price per Bag</span>
                    <span className="font-semibold text-[#0F172A]">₹{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Available Bags</span>
                    <span className="font-semibold text-[#0F172A]">{product.bags}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Weight per Bag</span>
                    <span className="font-semibold text-[#0F172A]">{product.weight_per_bag} kg</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[#64748B] font-semibold">Total Value</span>
                    <span className="font-bold text-[#10b981]">₹{(product.price * product.bags).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/farmer/edit-product/${product.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#10b98120] text-[#10b981] font-semibold rounded-lg"
                  >
                    <Edit2 size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-xl transition-colors border border-red-100"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;

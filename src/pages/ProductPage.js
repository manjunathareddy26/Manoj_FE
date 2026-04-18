import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import useCartStore from '../context/cartStore';

const ProductPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [quantity, setQuantity] = React.useState(1);
  const { addItem } = useCartStore();

  // Mock product data
  const product = {
    id,
    product_name: 'Premium Rice',
    price_per_bag: 450,
    weight_per_bag: 20,
    bags_available: 100,
    farmer_name: 'Rajesh Kumar',
    location: 'Tamil Nadu',
    description: 'Fresh, organic rice harvested at peak ripeness. Packed with nutrients and flavor.',
    images: [1, 2, 3, 4],
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(t('success.added_to_cart'));
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-gradient-to-br from-farm-100 to-leaf-100 rounded-lg w-full h-96 flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-farm-200 rounded-lg mx-auto mb-2"></div>
                <p className="text-gray-600">Product Image</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((_, idx) => (
                <div key={idx} className="bg-farm-50 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:bg-farm-100">
                  <span className="text-gray-400">Img {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="heading-lg mb-4 text-farm-500">{product.product_name}</h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-gray-600 text-sm">{t('products.price')}</p>
                <p className="text-3xl font-bold text-farm-500">₹{product.price_per_bag}</p>
                <p className="text-gray-600 text-sm">{t('products.per_bag')}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t('products.weight')}</p>
                <p className="text-2xl font-bold">{product.weight_per_bag} kg</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t('products.available')}</p>
                <p className="text-2xl font-bold text-leaf-300">{product.bags_available}</p>
              </div>
            </div>

            {/* Farmer Info */}
            <div className="card mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-farm-100 rounded-full"></div>
                <div>
                  <p className="font-semibold">{product.farmer_name}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <MapPin size={14} />
                    {product.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card mb-6">
              <h3 className="heading-sm mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="card">
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">{t('cart.quantity')}</label>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart size={24} />
                {t('products.add_to_cart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import useAuthStore from '../context/authStore';
import { authService } from '../services';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      setUser(response.data.user);
      toast.success(t('success.profile_updated'));
      setIsEditing(false);
    } catch (error) {
      toast.error(t('errors.submit_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="heading-lg text-farm-500 mb-8">{t('farmer_dashboard.profile')}</h1>

        <div className="card">
          <div className="flex items-center justify-between mb-8 pb-8 border-b">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-farm-100 rounded-full"></div>
              <div>
                <h2 className="heading-md">{user?.name}</h2>
                <p className="text-gray-600">{user?.role === 'farmer' ? 'Farmer' : 'Consumer'}</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 btn-secondary"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <User size={18} />
                  {t('auth.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  {t('auth.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <MapPin size={18} />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <User className="text-farm-500" size={20} />
                <div>
                  <p className="text-gray-600 text-sm">{t('auth.name')}</p>
                  <p className="font-semibold">{formData.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-farm-500" size={20} />
                <div>
                  <p className="text-gray-600 text-sm">{t('auth.email')}</p>
                  <p className="font-semibold">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-farm-500" size={20} />
                <div>
                  <p className="text-gray-600 text-sm">{t('auth.phone')}</p>
                  <p className="font-semibold">{formData.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="text-farm-500" size={20} />
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-semibold">{formData.location || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

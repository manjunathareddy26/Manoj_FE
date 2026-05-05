import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import useAuthStore from '../context/authStore';
import { authService } from '../services';

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.profile_image || null);
  const [avatarBase64, setAvatarBase64] = useState(null); // new image selected but not yet saved
  const fileInputRef = useRef(null);

  // Sync form when user loads from API after page refresh
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || user.whatsapp || '',
        location: user.address || user.place || '',
      });
      setAvatarPreview(user.profile_image || null);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.whatsapp || '',
    location: user?.address || user?.place || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatarBase64(reader.result); // full data URI
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        ...(avatarBase64 !== null ? { profileImage: avatarBase64 } : {}),
      };
      const response = await authService.updateProfile(payload);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      setAvatarPreview(updatedUser.profile_image || avatarPreview);
      setAvatarBase64(null);
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        location: updatedUser.address || '',
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(user?.profile_image || null);
    setAvatarBase64(null);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || user?.whatsapp || '',
      location: user?.address || user?.place || '',
    });
  };

  const initials = (formData.name || user?.email || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const roleLabel = user?.role === 'farmer' ? 'Farmer' : 'Consumer';
  const roleColor = user?.role === 'farmer'
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-blue-100 text-blue-700';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-[#F8FAFC] to-[#EFF6FF]">
      <Navbar />

      {/* Loading skeleton while user is being fetched after refresh */}
      {!user ? (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-[#10b981] to-[#059669]" />
            <div className="px-8 pb-6">
              <div className="flex items-end justify-between -mt-14 mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
              </div>
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-48 mb-2" />
              <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-24" />
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-xl">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20 mb-2" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-[#10b981] to-[#059669] relative" />

          {/* Avatar + Name */}
          <div className="px-8 pb-6">
            <div className="flex items-end justify-between -mt-14 mb-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{initials}</span>
                  )}
                </div>
                {/* Camera button — always visible */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change photo"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#10b981] hover:bg-[#059669] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white transition-colors"
                >
                  <Camera size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Edit / Save buttons */}
              <div className="flex gap-2 mt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#E2E8F0] text-[#64748B] font-semibold rounded-xl hover:bg-[#F8FAFC] transition-all text-sm"
                    >
                      <X size={15} /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 text-sm"
                    >
                      {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-5 py-2 border-2 border-[#10b981] text-[#10b981] font-bold rounded-xl hover:bg-green-50 transition-all text-sm"
                  >
                    <Edit2 size={15} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Name & role */}
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">{formData.name || 'Your Name'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleColor}`}>
                  {roleLabel}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <ShieldCheck size={13} /> Verified Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-lg font-bold text-[#0F172A] mb-6">Personal Information</h3>

          {isEditing ? (
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A] text-sm"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  Email <span className="text-gray-400 font-normal text-xs">(cannot be changed)</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A] text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#10b981] transition-colors text-[#0F172A] text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {[
                { icon: <User size={18} className="text-[#10b981]" />, label: 'Full Name', value: formData.name },
                { icon: <Mail size={18} className="text-[#10b981]" />, label: 'Email', value: formData.email },
                { icon: <Phone size={18} className="text-[#10b981]" />, label: 'Phone', value: formData.phone || 'Not provided' },
                { icon: <MapPin size={18} className="text-[#10b981]" />, label: 'Location', value: formData.location || 'Not provided' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-xl">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide">{label}</p>
                    <p className="font-semibold text-[#0F172A] text-sm mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      )} {/* end !user ternary */}
    </div>
  );
};

export default ProfilePage;

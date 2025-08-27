import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit3 } from 'lucide-react';
import api from '../../config/api';

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  date_of_birth: string | null;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    date_of_birth: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      fetchProfile();
    } else {
      setMessage('Please log in to view your profile');
    }
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      console.log('Fetching profile from:', '/api/profile/');
      const response = await api.get('/api/profile/');
      console.log('Profile response:', response.data);
      setProfile(response.data.profile);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        setMessage('Please log in to view your profile');
      } else if (error.response?.status === 404) {
        setMessage('Profile endpoint not found. Please check if Django server is running.');
      } else {
        setMessage('Error loading profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Updating profile with data:', profile);
      const response = await api.post('/api/profile/update/', profile);
      console.log('Update response:', response.data);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        setMessage('Please log in to update your profile');
      } else if (error.response?.status === 404) {
        setMessage('Update endpoint not found. Please check if Django server is running.');
      } else {
        setMessage('Error updating profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">My Profile</h1>
                  <p className="text-white/80 text-sm">Manage your account information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {message && (
              <div className={`mb-6 p-4 rounded-xl ${
                message.includes('Error') || message.includes('log in')
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}
            
            {loading && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <p className="text-sm">Loading profile data...</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white ${
                        isEditing 
                          ? 'bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white ${
                        isEditing 
                          ? 'bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white ${
                        isEditing 
                          ? 'bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white ${
                        isEditing 
                          ? 'bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="date_of_birth"
                      value={profile.date_of_birth || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white ${
                        isEditing 
                          ? 'bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-none ${
                      isEditing 
                        ? 'bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                    placeholder="Enter your address"
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
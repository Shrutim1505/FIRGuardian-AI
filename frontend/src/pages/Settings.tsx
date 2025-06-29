import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Bell, Globe, Save, Eye, EyeOff, Smartphone } from 'lucide-react';
import { settingsAPI } from '../services/api';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  badge: string;
  station: string;
  rank: string;
  phone: string;
  department: string;
  district: string;
  state: string;
}

interface Preferences {
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: string;
  aiAssistance: {
    autoAnalysis: boolean;
    confidenceThreshold: number;
    suggestionsEnabled: boolean;
  };
  privacy: {
    dataRetention: number;
    shareAnalytics: boolean;
  };
}

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    badge: user?.badge || '',
    station: user?.station || '',
    rank: user?.rank || '',
    phone: '',
    department: '',
    district: '',
    state: '',
  });

  const [preferences, setPreferences] = useState<Preferences>({
    language: 'english',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: 'light',
    aiAssistance: {
      autoAnalysis: true,
      confidenceThreshold: 75,
      suggestionsEnabled: true,
    },
    privacy: {
      dataRetention: 365,
      shareAnalytics: false,
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [profileData, preferencesData] = await Promise.all([
        settingsAPI.getProfile(),
        settingsAPI.getPreferences(),
      ]);
      
      setProfile({ ...profile, ...profileData });
      setPreferences({ ...preferences, ...preferencesData });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await settingsAPI.updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await settingsAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
      
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);

    try {
      await settingsAPI.updatePreferences(preferences);
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                        required
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Badge Number *
                      </label>
                      <input
                        type="text"
                        value={profile.badge}
                        onChange={(e) => setProfile({ ...profile, badge: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Police Station *
                      </label>
                      <input
                        type="text"
                        value={profile.station}
                        onChange={(e) => setProfile({ ...profile, station: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rank *
                      </label>
                      <select
                        value={profile.rank}
                        onChange={(e) => setProfile({ ...profile, rank: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select Rank</option>
                        <option value="Constable">Constable</option>
                        <option value="Head Constable">Head Constable</option>
                        <option value="Assistant Sub-Inspector">Assistant Sub-Inspector</option>
                        <option value="Sub-Inspector">Sub-Inspector</option>
                        <option value="Inspector">Inspector</option>
                        <option value="Assistant Commissioner">Assistant Commissioner</option>
                        <option value="Deputy Commissioner">Deputy Commissioner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., Criminal Investigation Department"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District
                      </label>
                      <input
                        type="text"
                        value={profile.district}
                        onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select State</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Rajasthan">Rajasthan</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="max-w-md">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={passwordData.showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordData({ ...passwordData, showCurrentPassword: !passwordData.showCurrentPassword })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {passwordData.showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={passwordData.showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordData({ ...passwordData, showNewPassword: !passwordData.showNewPassword })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {passwordData.showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={passwordData.showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordData({ ...passwordData, showConfirmPassword: !passwordData.showConfirmPassword })}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {passwordData.showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-6 flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">Security Tips</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Use a strong password with at least 8 characters</li>
                    <li>• Include uppercase, lowercase, numbers, and special characters</li>
                    <li>• Don't share your password with anyone</li>
                    <li>• Change your password regularly</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Globe className="h-6 w-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
                  </div>
                  <button
                    onClick={handlePreferencesUpdate}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Language */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Language & Region</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interface Language
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="english">English</option>
                          <option value="hindi">Hindi</option>
                          <option value="marathi">Marathi</option>
                          <option value="tamil">Tamil</option>
                          <option value="telugu">Telugu</option>
                          <option value="bengali">Bengali</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select
                          value={preferences.theme}
                          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* AI Assistance */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">AI Assistance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Auto Analysis</label>
                          <p className="text-sm text-gray-500">Automatically analyze incident descriptions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.aiAssistance.autoAnalysis}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              aiAssistance: { ...preferences.aiAssistance, autoAnalysis: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Legal Suggestions</label>
                          <p className="text-sm text-gray-500">Show AI-powered legal section suggestions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.aiAssistance.suggestionsEnabled}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              aiAssistance: { ...preferences.aiAssistance, suggestionsEnabled: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confidence Threshold ({preferences.aiAssistance.confidenceThreshold}%)
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={preferences.aiAssistance.confidenceThreshold}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            aiAssistance: { ...preferences.aiAssistance, confidenceThreshold: parseInt(e.target.value) }
                          })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Only show AI suggestions above this confidence level
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Privacy */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Privacy & Data</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data Retention Period
                        </label>
                        <select
                          value={preferences.privacy.dataRetention}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            privacy: { ...preferences.privacy, dataRetention: parseInt(e.target.value) }
                          })}
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="90">90 days</option>
                          <option value="180">6 months</option>
                          <option value="365">1 year</option>
                          <option value="730">2 years</option>
                          <option value="1095">3 years</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                          How long to keep your FIR drafts and analysis data
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Share Analytics</label>
                          <p className="text-sm text-gray-500">Help improve the system by sharing anonymous usage data</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.privacy.shareAnalytics}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              privacy: { ...preferences.privacy, shareAnalytics: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Bell className="h-6 w-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
                  </div>
                  <button
                    onClick={handlePreferencesUpdate}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.email}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, email: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.push}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, push: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.sms}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, sms: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Notification Types</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• FIR submission confirmations</li>
                      <li>• AI analysis completion alerts</li>
                      <li>• System updates and maintenance notices</li>
                      <li>• Important legal updates and amendments</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
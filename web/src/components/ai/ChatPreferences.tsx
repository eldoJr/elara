import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Palette, Bell, BellOff } from 'lucide-react';

interface ChatPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPreferences: React.FC<ChatPreferencesProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    soundEnabled: true,
    notifications: true,
    theme: 'blue',
    fontSize: 'medium',
    autoSuggestions: true
  });

  const themes = [
    { id: 'blue', name: 'Ocean Blue', colors: 'from-blue-500 to-blue-600' },
    { id: 'purple', name: 'Purple Gradient', colors: 'from-purple-500 to-pink-500' },
    { id: 'green', name: 'Nature Green', colors: 'from-green-500 to-emerald-500' },
    { id: 'orange', name: 'Sunset Orange', colors: 'from-orange-500 to-red-500' }
  ];

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Chat Preferences</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sound Settings */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              {preferences.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Sound & Notifications
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Message sounds</span>
                <button
                  onClick={() => updatePreference('soundEnabled', !preferences.soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences.soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    preferences.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Push notifications</span>
                <button
                  onClick={() => updatePreference('notifications', !preferences.notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences.notifications ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </label>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Chat Theme
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updatePreference('theme', theme.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    preferences.theme === theme.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded bg-gradient-to-r ${theme.colors} mb-2`} />
                  <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Font Size</h3>
            
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => updatePreference('fontSize', size)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                    preferences.fontSize === size
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Suggestions */}
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">Smart Suggestions</span>
                <p className="text-sm text-gray-600">Show contextual suggestions while typing</p>
              </div>
              <button
                onClick={() => updatePreference('autoSuggestions', !preferences.autoSuggestions)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  preferences.autoSuggestions ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  preferences.autoSuggestions ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Save preferences logic here
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreferences;
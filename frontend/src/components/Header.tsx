import React from 'react';
import { Shield, Globe, User, Settings } from 'lucide-react';

interface HeaderProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
];

export const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold">LegalAssist-AI</h1>
              <p className="text-xs text-blue-200">Police FIR Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <select 
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-blue-800 text-white px-3 py-1 rounded-md text-sm border border-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4" />
              <span>Officer ID: 1234</span>
            </div>
            
            <button className="p-2 rounded-md hover:bg-blue-800 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
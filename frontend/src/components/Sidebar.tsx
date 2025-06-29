import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Database, 
  Settings, 
  Shield 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'FIR Drafting', href: '/fir', icon: FileText },
  { name: 'Case History', href: '/history', icon: History },
  { name: 'Legal Database', href: '/database', icon: Database },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="bg-primary-900 text-white w-64 flex flex-col">
      <div className="p-6 border-b border-primary-800">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-gold-400" />
          <div>
            <h1 className="text-xl font-bold">LegalAssist-AI</h1>
            <p className="text-primary-300 text-sm">Police FIR Assistant</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-800 text-gold-400'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-primary-800">
        <div className="text-xs text-primary-400">
          Version 1.0.0 • Secure & Encrypted
        </div>
      </div>
    </div>
  );
};
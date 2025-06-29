import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '../services/api';

interface DashboardStats {
  totalFIRs: number;
  pendingFIRs: number;
  completedFIRs: number;
  accuracyRate: number;
  recentCases: Array<{
    id: string;
    title: string;
    status: string;
    date: string;
    confidence: number;
  }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total FIRs',
      value: stats?.totalFIRs || 0,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending',
      value: stats?.pendingFIRs || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed',
      value: stats?.completedFIRs || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'AI Accuracy',
      value: `${stats?.accuracyRate || 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your FIR drafting activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 card-hover animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Cases */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Cases</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {stats?.recentCases?.map((case_, index) => (
            <div
              key={case_.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{case_.title}</h3>
                  <p className="text-sm text-gray-500">{case_.date}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    case_.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {case_.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {case_.confidence}% confidence
                  </p>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              No recent cases found
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-colors">
            <FileText className="h-6 w-6 mb-2" />
            <h3 className="font-medium">Draft New FIR</h3>
            <p className="text-sm opacity-90">Start with AI assistance</p>
          </button>
          
          <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-colors">
            <AlertTriangle className="h-6 w-6 mb-2" />
            <h3 className="font-medium">Emergency FIR</h3>
            <p className="text-sm opacity-90">Quick high-priority case</p>
          </button>
          
          <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-colors">
            <TrendingUp className="h-6 w-6 mb-2" />
            <h3 className="font-medium">Case Analytics</h3>
            <p className="text-sm opacity-90">View detailed insights</p>
          </button>
        </div>
      </div>
    </div>
  );
};
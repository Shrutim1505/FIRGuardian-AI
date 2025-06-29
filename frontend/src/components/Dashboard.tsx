import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, Brain, Scale, Paperclip, Gavel } from 'lucide-react';
import { IncidentReport } from '../types';

interface DashboardProps {
  reports: IncidentReport[];
  onNewReport: () => void;
  onViewReport: (id: string) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'draft': return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    default: return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ reports, onNewReport, onViewReport }) => {
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending' | 'completed'>('all');

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FIR Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track your incident reports</p>
        </div>
        <button
          onClick={onNewReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New FIR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Total Reports</p>
          <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'completed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Drafts</p>
          <p className="text-2xl font-bold text-gray-600">{reports.filter(r => r.status === 'draft').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">AI Applied</p>
          <p className="text-2xl font-bold text-blue-600">{reports.filter(r => r.aiStatus === 'Applied').length}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[ 'all', 'draft', 'pending', 'completed' ].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">No reports match the selected status</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReports.map(report => (
              <div
                key={report.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onViewReport(report.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">FIR #{report.id}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </span>
                      {report.aiStatus && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Brain className="h-3 w-3 mr-1" />
                          AI: {report.aiStatus || 'N/A'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Type:</strong> {report.incidentType}</p>
                      <p><strong>Location:</strong> {report.location}</p>
                      <p><strong>Complainant:</strong> {report.complainant.name}</p>
                      <p><strong>Date:</strong> {new Date(report.createdAt || '').toLocaleString()}</p>
                      <p><strong>Summary:</strong> {report.summary || 'No summary provided'}</p>
                      <p><strong>Priority:</strong> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority || '')}`}>{report.priority || 'Not specified'}</span></p>
                      {report.legalSections && report.legalSections.length > 0 && (
                        <p><strong>Suggested Legal Sections (IPC/CrPC):</strong> {(report.legalSections || []).join(', ')}</p>
                      )}
                      {report.landmarkJudgments && report.landmarkJudgments.length > 0 && (
                        <p><Gavel className="inline-block h-3 w-3 mr-1" /> {report.landmarkJudgments?.[0] || 'No judgments'}</p>
                      )}
                      {report.attachments !== undefined && report.attachments > 0 && (
                        <p><Paperclip className="inline-block h-3 w-3 mr-1" /> {report.attachments} attachment(s)</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(report.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Calendar, MapPin, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Case {
  id: string;
  firNumber: string;
  complainantName: string;
  incidentDate: string;
  location: string;
  status: 'draft' | 'submitted' | 'under_investigation' | 'closed';
  priority: 'low' | 'medium' | 'high';
  sections: string[];
  createdAt: string;
  updatedAt: string;
  confidence: number;
}

export const CaseHistory: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const casesPerPage = 10;

  // Mock data - in real app, this would come from API
  const mockCases: Case[] = [
    {
      id: '1',
      firNumber: 'FIR/2024/001',
      complainantName: 'Rajesh Kumar',
      incidentDate: '2024-01-15',
      location: 'Sector 15, Noida',
      status: 'submitted',
      priority: 'high',
      sections: ['354', '509'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:45:00Z',
      confidence: 87,
    },
    {
      id: '2',
      firNumber: 'FIR/2024/002',
      complainantName: 'Priya Sharma',
      incidentDate: '2024-01-14',
      location: 'Connaught Place, Delhi',
      status: 'under_investigation',
      priority: 'medium',
      sections: ['420', '406'],
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-16T11:20:00Z',
      confidence: 92,
    },
    {
      id: '3',
      firNumber: 'FIR/2024/003',
      complainantName: 'Mohammed Ali',
      incidentDate: '2024-01-13',
      location: 'Karol Bagh, Delhi',
      status: 'draft',
      priority: 'low',
      sections: ['279', '337'],
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-13T16:45:00Z',
      confidence: 78,
    },
    {
      id: '4',
      firNumber: 'FIR/2024/004',
      complainantName: 'Sunita Devi',
      incidentDate: '2024-01-12',
      location: 'Lajpat Nagar, Delhi',
      status: 'closed',
      priority: 'high',
      sections: ['498A', '406'],
      createdAt: '2024-01-12T12:30:00Z',
      updatedAt: '2024-01-18T15:00:00Z',
      confidence: 95,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCases = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCases(mockCases);
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_investigation': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.complainantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const caseDate = new Date(case_.createdAt);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - caseDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const startIndex = (currentPage - 1) * casesPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + casesPerPage);

  const handleViewCase = (case_: Case) => {
    setSelectedCase(case_);
    setShowDetails(true);
  };

  const handleDownloadCase = (case_: Case) => {
    // In real app, this would download the FIR document
    console.log('Downloading case:', case_.firNumber);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Case History</h1>
          <p className="text-gray-600 mt-2">Track and manage all your FIR cases</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            Total Cases: <span className="font-semibold">{cases.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by FIR number, name, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FIR Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complainant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{case_.firNumber}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(case_.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {case_.sections.map((section) => (
                          <span
                            key={section}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{case_.complainantName}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center text-sm text-gray-800">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {format(new Date(case_.incidentDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {case_.location}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                        {case_.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(case_.priority)}`}>
                        {case_.priority} priority
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800">{case_.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              case_.confidence >= 80 ? 'bg-green-500' :
                              case_.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${case_.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewCase(case_)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadCase(case_)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + casesPerPage, filteredCases.length)}
                </span>{' '}
                of <span className="font-medium">{filteredCases.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Case Details Modal */}
      {showDetails && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Case Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">FIR Number</label>
                    <p className="text-sm text-gray-900">{selectedCase.firNumber}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Complainant</label>
                    <p className="text-sm text-gray-900">{selectedCase.complainantName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Incident Date</label>
                    <p className="text-sm text-gray-900">
                      {format(new Date(selectedCase.incidentDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-900">{selectedCase.location}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCase.status)}`}>
                      {selectedCase.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedCase.priority)}`}>
                      {selectedCase.priority} priority
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applicable Sections</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedCase.sections.map((section) => (
                        <span
                          key={section}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">AI Confidence</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            selectedCase.confidence >= 80 ? 'bg-green-500' :
                            selectedCase.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedCase.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{selectedCase.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadCase(selectedCase)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Download FIR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { IncidentForm } from './components/IncidentForm';
import { IncidentReport } from './types';

type View = 'dashboard' | 'new-report' | 'view-report';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleNewReport = () => {
    setCurrentView('new-report');
  };

  const handleSaveReport = (report: IncidentReport) => {
    setReports(prev => [...prev, report]);
    setCurrentView('dashboard');
  };

  const handleViewReport = (id: string) => {
    setSelectedReportId(id);
    setCurrentView('view-report');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedReportId(null);
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'new-report':
        return (
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <button
                onClick={handleBackToDashboard}
                className="mb-4 text-blue-600 hover:text-blue-700 flex items-center space-x-2"
              >
                <span>← Back to Dashboard</span>
              </button>
            </div>
            <IncidentForm 
              language={currentLanguage}
              onSave={handleSaveReport}
            />
          </div>
        );
      
      case 'view-report':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={handleBackToDashboard}
              className="mb-4 text-blue-600 hover:text-blue-700 flex items-center space-x-2"
            >
              <span>← Back to Dashboard</span>
            </button>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">FIR Report Details</h2>
              <p className="text-gray-600">Report ID: {selectedReportId}</p>
              {/* Add detailed report view here */}
            </div>
          </div>
        );
      
      default:
        return (
          <Dashboard 
            reports={reports}
            onNewReport={handleNewReport}
            onViewReport={handleViewReport}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, User, FileText, Clock } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { IncidentReport } from '../types';
import { AIAnalysis } from './AIAnalysis';
import { AIService } from '../services/aiService';
import { AIAnalysis as AIAnalysisType } from '../types';

interface IncidentFormProps {
  language: string;
  onSave: (report: IncidentReport) => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({ language, onSave }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisType | null>(null);
  const [formData, setFormData] = useState({
    incidentType: '',
    description: '',
    location: '',
    dateTime: '',
    complainant: {
      name: '',
      contact: '',
      address: ''
    },
    witnesses: [{ name: '', contact: '' }]
  });

  const incidentTypes = [
    'Theft/Robbery',
    'Assault/Battery',
    'Domestic Violence',
    'Cybercrime',
    'Traffic Violation',
    'Property Dispute',
    'Missing Person',
    'Fraud/Cheating',
    'Harassment',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('complainant.')) {
      const complainantField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        complainant: {
          ...prev.complainant,
          [complainantField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setFormData(prev => ({
      ...prev,
      description: transcript
    }));
  };

  const handleAnalyze = async () => {
    if (!formData.description.trim() || !formData.incidentType) return;
    
    setIsAnalyzing(true);
    try {
      const aiService = AIService.getInstance();
      const result = await aiService.analyzeIncident(formData.description, formData.incidentType);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const report: IncidentReport = {
      id: Date.now().toString(),
      officerId: '1234',
      stationId: 'PS001',
      ...formData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(report);
  };

  useEffect(() => {
    if (formData.description.trim() && formData.incidentType) {
      const timer = setTimeout(() => {
        handleAnalyze();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [formData.description, formData.incidentType]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            New FIR Report
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {new Date().toLocaleString()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Type *
            </label>
            <select
              value={formData.incidentType}
              onChange={(e) => handleInputChange('incidentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select incident type</option>
              {incidentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description with Voice Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Description *
            </label>
            <div className="flex space-x-4">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Describe the incident in detail..."
                required
              />
              <div className="flex-shrink-0">
                <VoiceInput 
                  onTranscript={handleVoiceTranscript}
                  language={language}
                />
              </div>
            </div>
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Incident location"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => handleInputChange('dateTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Complainant Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Complainant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.complainant.name}
                  onChange={(e) => handleInputChange('complainant.name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={formData.complainant.contact}
                  onChange={(e) => handleInputChange('complainant.contact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.complainant.address}
                onChange={(e) => handleInputChange('complainant.address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Full address"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate FIR
            </button>
          </div>
        </form>
      </div>

      {/* AI Analysis Component */}
      {(analysis || isAnalyzing) && (
        <AIAnalysis 
          analysis={analysis} 
          isLoading={isAnalyzing}
        />
      )}
    </div>
  );
};
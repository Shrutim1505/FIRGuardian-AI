import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Save, Send, RefreshCw, MapPin, Clock, User, Phone } from 'lucide-react';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { AIInsights } from '../components/AIInsights';
import { firAPI } from '../services/api';
import toast from 'react-hot-toast';

interface FIRFormData {
  complainantName: string;
  complainantAddress: string;
  complainantPhone: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  witnessDetails: string;
  evidenceDetails: string;
  officerRemarks: string;
  language: string;
}

export const FIRDrafting: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [generatedFIR, setGeneratedFIR] = useState('');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'ai' | 'preview'>('form');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FIRFormData>({
    defaultValues: {
      language: 'english',
      incidentDate: new Date().toISOString().split('T')[0],
      incidentTime: new Date().toTimeString().slice(0, 5),
    },
  });

  const incidentDescription = watch('incidentDescription');

  // Mock AI analysis data
  const mockAIInsights = {
    suggestions: [
      {
        section: '354',
        act: 'Indian Penal Code',
        description: 'Assault or criminal force to woman with intent to outrage her modesty',
        confidence: 85,
        relevance: 'high' as const,
      },
      {
        section: '509',
        act: 'Indian Penal Code',
        description: 'Word, gesture or act intended to insult the modesty of a woman',
        confidence: 78,
        relevance: 'medium' as const,
      },
      {
        section: '506',
        act: 'Indian Penal Code',
        description: 'Punishment for criminal intimidation',
        confidence: 65,
        relevance: 'medium' as const,
      },
    ],
    caseLaws: [
      {
        title: 'Vishaka v. State of Rajasthan',
        court: 'Supreme Court of India',
        year: '1997',
        relevance: 92,
        summary: 'Landmark judgment establishing guidelines for prevention of sexual harassment at workplace.',
      },
      {
        title: 'State of Punjab v. Gurmit Singh',
        court: 'Supreme Court of India',
        year: '1996',
        relevance: 78,
        summary: 'Definition and scope of outraging modesty under Section 354 IPC.',
      },
    ],
    confidence: 82,
  };

  const handleVoiceTranscription = (text: string) => {
    const currentDescription = incidentDescription || '';
    const updatedDescription = currentDescription + (currentDescription ? '\n\n' : '') + text;
    setValue('incidentDescription', updatedDescription);
    
    // Trigger AI analysis
    analyzeIncident(updatedDescription);
  };

  const handleAudioReady = (audioBlob: Blob) => {
    // In a real app, you would send this to your backend for transcription
    console.log('Audio ready for transcription:', audioBlob);
  };

  const analyzeIncident = async (description: string) => {
    if (!description.trim()) return;

    setAiAnalyzing(true);
    try {
      // Simulate AI analysis - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAiInsights(mockAIInsights);
      
      if (activeTab === 'form') {
        setActiveTab('ai');
      }
    } catch (error) {
      console.error('Error analyzing incident:', error);
      toast.error('Failed to analyze incident. Please try again.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const generateFIR = async (data: FIRFormData) => {
    setLoading(true);
    try {
      // Simulate FIR generation - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedText = `
FIRST INFORMATION REPORT
(Under Section 154 of the Code of Criminal Procedure, 1973)

Police Station: ${data.incidentLocation}
Date: ${data.incidentDate}
Time: ${data.incidentTime}

COMPLAINANT DETAILS:
Name: ${data.complainantName}
Address: ${data.complainantAddress}
Phone: ${data.complainantPhone}

INCIDENT DETAILS:
Date of Incident: ${data.incidentDate}
Time of Incident: ${data.incidentTime}
Place of Incident: ${data.incidentLocation}

DESCRIPTION OF INCIDENT:
${data.incidentDescription}

WITNESS DETAILS:
${data.witnessDetails || 'No witnesses mentioned'}

EVIDENCE DETAILS:
${data.evidenceDetails || 'No evidence details provided'}

APPLICABLE SECTIONS:
Based on AI analysis, the following sections may be applicable:
${aiInsights?.suggestions.map((s: any) => `- Section ${s.section} of ${s.act}`).join('\n') || 'To be determined'}

OFFICER REMARKS:
${data.officerRemarks || 'None'}

This FIR has been generated with AI assistance and should be reviewed by the investigating officer.
      `;
      
      setGeneratedFIR(generatedText);
      setActiveTab('preview');
      toast.success('FIR generated successfully!');
    } catch (error) {
      console.error('Error generating FIR:', error);
      toast.error('Failed to generate FIR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (data: FIRFormData) => {
    try {
      // Save as draft
      toast.success('Draft saved successfully!');
    } catch (error) {
      toast.error('Failed to save draft.');
    }
  };

  const submitFIR = async () => {
    try {
      // Submit final FIR
      toast.success('FIR submitted successfully!');
      reset();
      setGeneratedFIR('');
      setAiInsights(null);
      setActiveTab('form');
    } catch (error) {
      toast.error('Failed to submit FIR.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">FIR Drafting</h1>
          <p className="text-gray-600 mt-2">AI-assisted First Information Report creation</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'form'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Form
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'ai'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            AI Analysis
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {activeTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(generateFIR)} className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Complainant Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('complainantName', { required: 'Name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter complainant's full name"
                    />
                    {errors.complainantName && (
                      <p className="text-red-500 text-sm mt-1">{errors.complainantName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...register('complainantPhone', { required: 'Phone number is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter phone number"
                    />
                    {errors.complainantPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.complainantPhone.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('complainantAddress', { required: 'Address is required' })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter complainant's address"
                  />
                  {errors.complainantAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.complainantAddress.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Incident Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Incident *
                    </label>
                    <input
                      type="date"
                      {...register('incidentDate', { required: 'Date is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.incidentDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.incidentDate.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time of Incident *
                    </label>
                    <input
                      type="time"
                      {...register('incidentTime', { required: 'Time is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.incidentTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.incidentTime.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      {...register('language')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="marathi">Marathi</option>
                      <option value="tamil">Tamil</option>
                      <option value="telugu">Telugu</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location of Incident *
                  </label>
                  <input
                    {...register('incidentLocation', { required: 'Location is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter incident location"
                  />
                  {errors.incidentLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.incidentLocation.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incident Description *
                  </label>
                  <textarea
                    {...register('incidentDescription', { required: 'Description is required' })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the incident in detail..."
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue('incidentDescription', value);
                      if (value.length > 50) {
                        analyzeIncident(value);
                      }
                    }}
                  />
                  {errors.incidentDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.incidentDescription.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Witness Details
                    </label>
                    <textarea
                      {...register('witnessDetails')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter witness information if any..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evidence Details
                    </label>
                    <textarea
                      {...register('evidenceDetails')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe any evidence collected..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Officer Remarks
                    </label>
                    <textarea
                      {...register('officerRemarks')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Add any additional remarks..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleSubmit(saveDraft)}
                  className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Draft
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-5 w-5 mr-2" />
                  )}
                  Generate FIR
                </button>
              </div>
            </form>
          </div>

          {/* Voice Recorder */}
          <div className="lg:col-span-1">
            <VoiceRecorder
              onTranscription={handleVoiceTranscription}
              onAudioReady={handleAudioReady}
              disabled={loading}
            />
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div>
          {aiAnalyzing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-800">Analyzing incident...</p>
                <p className="text-sm text-gray-600">AI is processing the incident description</p>
              </div>
            </div>
          ) : aiInsights ? (
            <AIInsights {...aiInsights} loading={false} />
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No AI analysis available</p>
              <p className="text-sm text-gray-500">Enter incident description to get AI insights</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Generated FIR Preview</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Print
              </button>
              <button
                onClick={submitFIR}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit FIR
              </button>
            </div>
          </div>
          
          {generatedFIR ? (
            <div className="bg-gray-50 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                {generatedFIR}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No FIR generated yet</p>
              <p className="text-sm text-gray-500">Fill out the form and generate FIR to see preview</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
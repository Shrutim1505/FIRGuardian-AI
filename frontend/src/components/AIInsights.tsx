import React from 'react';
import { Brain, Scale, BookOpen, AlertCircle } from 'lucide-react';

interface LegalSuggestion {
  section: string;
  act: string;
  description: string;
  confidence: number;
  relevance: 'high' | 'medium' | 'low';
}

interface CaseLaw {
  title: string;
  court: string;
  year: string;
  relevance: number;
  summary: string;
}

interface AIInsightsProps {
  suggestions: LegalSuggestion[];
  caseLaws: CaseLaw[];
  confidence: number;
  loading: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  suggestions,
  caseLaws,
  confidence,
  loading,
}) => {
  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-primary-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-800">AI Analysis</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Confidence Score */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-800">AI Analysis Confidence</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>
              {confidence}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  confidence >= 80 ? 'bg-green-500' : 
                  confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          {confidence >= 80 
            ? "High confidence - The AI analysis is very reliable for this incident type."
            : confidence >= 60 
            ? "Medium confidence - Review the suggestions carefully before proceeding."
            : "Low confidence - Manual review recommended. Consider additional details."
          }
        </p>
      </div>

      {/* Legal Sections */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Scale className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">Applicable Legal Sections</h3>
        </div>
        
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    Section {suggestion.section} - {suggestion.act}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {suggestion.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRelevanceColor(suggestion.relevance)}`}>
                    {suggestion.relevance}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {suggestion.confidence}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Laws & Precedents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">Relevant Case Laws</h3>
        </div>
        
        <div className="space-y-4">
          {caseLaws.map((caseLaw, index) => (
            <div 
              key={index} 
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{caseLaw.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {caseLaw.court} • {caseLaw.year}
                  </p>
                  <p className="text-sm text-gray-600">{caseLaw.summary}</p>
                </div>
                <div className="flex items-center space-x-1 ml-4">
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${caseLaw.relevance}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{caseLaw.relevance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">AI Recommendations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure all witness statements are recorded accurately</li>
              <li>• Consider collecting additional evidence for stronger case</li>
              <li>• Verify jurisdiction and applicable state amendments</li>
              <li>• Review similar cases in your district for consistency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
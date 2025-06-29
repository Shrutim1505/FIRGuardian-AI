import React from 'react';
import { Brain, Scale, BookOpen, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { AIAnalysis as AIAnalysisType } from '../types';

interface AIAnalysisProps {
  analysis: AIAnalysisType | null;
  isLoading: boolean;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Analysis in Progress...</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Legal Analysis</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
            analysis.confidence >= 90 ? 'bg-green-100 text-green-800' :
            analysis.confidence >= 70 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            <CheckCircle className="h-4 w-4" />
            <span>{analysis.confidence.toFixed(0)}% Confidence</span>
          </div>
        </div>
      </div>

      {/* Category and Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Incident Category</h4>
          <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
            {analysis.incidentCategory.toUpperCase()}
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Extracted Entities</h4>
          <div className="space-y-1 text-sm">
            {analysis.entities.persons.length > 0 && (
              <div><strong>Persons:</strong> {analysis.entities.persons.join(', ')}</div>
            )}
            {analysis.entities.locations.length > 0 && (
              <div><strong>Locations:</strong> {analysis.entities.locations.join(', ')}</div>
            )}
            {analysis.entities.crimes.length > 0 && (
              <div><strong>Crimes:</strong> {analysis.entities.crimes.join(', ')}</div>
            )}
          </div>
        </div>
      </div>

      {/* Legal Sections */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Scale className="h-5 w-5 text-yellow-600" />
          <h4 className="text-lg font-medium text-gray-900">Suggested Legal Sections</h4>
        </div>
        <div className="space-y-3">
          {analysis.suggestedSections.map((section, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-semibold text-gray-900">{section.section}</h5>
                  <p className="text-sm text-gray-600">{section.act}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  section.applicability >= 90 ? 'bg-green-100 text-green-800' :
                  section.applicability >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {section.applicability}% Match
                </span>
              </div>
              <p className="text-sm text-gray-700">{section.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Case Laws */}
      {analysis.relevantCaseLaws.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <h4 className="text-lg font-medium text-gray-900">Relevant Case Laws</h4>
          </div>
          <div className="space-y-3">
            {analysis.relevantCaseLaws.map((caselaw, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-gray-900">{caselaw.title}</h5>
                    <p className="text-sm text-gray-600">{caselaw.citation} ({caselaw.year})</p>
                    <p className="text-xs text-gray-500">{caselaw.court}</p>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    {caselaw.relevance}% Relevant
                  </span>
                </div>
                <p className="text-sm text-gray-700">{caselaw.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-green-600" />
          <h4 className="text-lg font-medium text-gray-900">Investigation Recommendations</h4>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-800">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
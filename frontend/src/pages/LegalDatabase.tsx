import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Scale, FileText, ExternalLink, Filter, Star } from 'lucide-react';
import { legalAPI } from '../services/api';

interface LegalSection {
  id: string;
  section: string;
  act: string;
  title: string;
  description: string;
  category: string;
  amendments: string[];
  relatedSections: string[];
}

interface CaseLaw {
  id: string;
  title: string;
  court: string;
  year: string;
  judges: string[];
  summary: string;
  keyPoints: string[];
  citations: string[];
  category: string;
  importance: 'landmark' | 'significant' | 'reference';
}

interface LandmarkJudgment {
  id: string;
  case: string;
  court: string;
  year: string;
  significance: string;
  impact: string;
  keyPrinciples: string[];
}

export const LegalDatabase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sections' | 'cases' | 'judgments'>('sections');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [caseLaws, setCaseLaws] = useState<CaseLaw[]>([]);
  const [judgments, setJudgments] = useState<LandmarkJudgment[]>([]);

  // Mock data
  const mockSections: LegalSection[] = [
    {
      id: '1',
      section: '354',
      act: 'Indian Penal Code',
      title: 'Assault or criminal force to woman with intent to outrage her modesty',
      description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.',
      category: 'crimes_against_women',
      amendments: ['Criminal Law Amendment Act, 2013'],
      relatedSections: ['354A', '354B', '354C', '354D'],
    },
    {
      id: '2',
      section: '420',
      act: 'Indian Penal Code',
      title: 'Cheating and dishonestly inducing delivery of property',
      description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
      category: 'property_crimes',
      amendments: [],
      relatedSections: ['415', '417', '418', '419'],
    },
    {
      id: '3',
      section: '498A',
      act: 'Indian Penal Code',
      title: 'Husband or relative of husband of a woman subjecting her to cruelty',
      description: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.',
      category: 'crimes_against_women',
      amendments: ['Criminal Law Amendment Act, 1983'],
      relatedSections: ['304B', '406', '34'],
    },
  ];

  const mockCaseLaws: CaseLaw[] = [
    {
      id: '1',
      title: 'Vishaka & Ors vs State Of Rajasthan & Ors',
      court: 'Supreme Court of India',
      year: '1997',
      judges: ['Justice J.S. Verma', 'Justice Sujata V. Manohar', 'Justice B.N. Kirpal'],
      summary: 'This landmark judgment established guidelines for prevention of sexual harassment of women at workplace and the obligations of employers.',
      keyPoints: [
        'Established Vishaka Guidelines for workplace sexual harassment',
        'Recognized sexual harassment as a violation of fundamental rights',
        'Made it mandatory for employers to provide safe working environment',
        'Laid down complaint and inquiry procedures',
      ],
      citations: ['AIR 1997 SC 3011', '1997 (6) SCC 241'],
      category: 'women_rights',
      importance: 'landmark',
    },
    {
      id: '2',
      title: 'State of Punjab vs Gurmit Singh & Ors',
      court: 'Supreme Court of India',
      year: '1996',
      judges: ['Justice K. Ramaswamy', 'Justice S. Saghir Ahmad'],
      summary: 'This case clarified the scope and meaning of outraging modesty under Section 354 IPC and established important precedents.',
      keyPoints: [
        'Defined the scope of "outraging modesty" under Section 354',
        'Established that actual physical contact is not always necessary',
        'Clarified the mens rea requirement for the offense',
        'Emphasized the importance of victim testimony',
      ],
      citations: ['AIR 1996 SC 1393', '1996 (2) SCC 384'],
      category: 'criminal_law',
      importance: 'significant',
    },
  ];

  const mockJudgments: LandmarkJudgment[] = [
    {
      id: '1',
      case: 'Kesavananda Bharati vs State of Kerala',
      court: 'Supreme Court of India',
      year: '1973',
      significance: 'Established the Basic Structure Doctrine of the Constitution',
      impact: 'Fundamental principle that limits Parliament\'s power to amend the Constitution',
      keyPrinciples: [
        'Basic Structure Doctrine',
        'Limitation on Parliamentary power',
        'Constitutional supremacy',
        'Judicial review',
      ],
    },
    {
      id: '2',
      case: 'Maneka Gandhi vs Union of India',
      court: 'Supreme Court of India',
      year: '1978',
      significance: 'Expanded the scope of Article 21 (Right to Life and Personal Liberty)',
      impact: 'Established that right to life includes right to live with dignity',
      keyPrinciples: [
        'Expanded interpretation of Article 21',
        'Right to life with dignity',
        'Procedural due process',
        'Interconnected fundamental rights',
      ],
    },
  ];

  useEffect(() => {
    setSections(mockSections);
    setCaseLaws(mockCaseLaws);
    setJudgments(mockJudgments);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, this would filter based on search term
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch = searchTerm === '' || 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.section.includes(searchTerm) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredCaseLaws = caseLaws.filter(caseLaw => {
    const matchesSearch = searchTerm === '' ||
      caseLaw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseLaw.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || caseLaw.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredJudgments = judgments.filter(judgment => {
    const matchesSearch = searchTerm === '' ||
      judgment.case.toLowerCase().includes(searchTerm.toLowerCase()) ||
      judgment.significance.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'crimes_against_women', label: 'Crimes Against Women' },
    { value: 'property_crimes', label: 'Property Crimes' },
    { value: 'criminal_law', label: 'Criminal Law' },
    { value: 'women_rights', label: 'Women Rights' },
    { value: 'constitutional_law', label: 'Constitutional Law' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Legal Database</h1>
          <p className="text-gray-600 mt-2">Comprehensive legal sections, case laws, and landmark judgments</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search legal sections, cases, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'sections'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Scale className="h-4 w-4 inline mr-2" />
          Legal Sections
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'cases'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Case Laws
        </button>
        <button
          onClick={() => setActiveTab('judgments')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'judgments'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" />
          Landmark Judgments
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'sections' && (
          <>
            {filteredSections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Section {section.section} - {section.act}
                    </h3>
                    <h4 className="text-lg text-gray-700 mb-3">{section.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{section.description}</p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {section.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                {section.relatedSections.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Related Sections:</h5>
                    <div className="flex flex-wrap gap-2">
                      {section.relatedSections.map((relatedSection) => (
                        <span
                          key={relatedSection}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          {relatedSection}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {section.amendments.length > 0 && (
                  <div className="border-t pt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Amendments:</h5>
                    <ul className="text-sm text-gray-600">
                      {section.amendments.map((amendment, index) => (
                        <li key={index}>• {amendment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {activeTab === 'cases' && (
          <>
            {filteredCaseLaws.map((caseLaw) => (
              <div key={caseLaw.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{caseLaw.title}</h3>
                      {caseLaw.importance === 'landmark' && (
                        <Star className="h-5 w-5 text-yellow-500 ml-2" />
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">
                      {caseLaw.court} • {caseLaw.year}
                    </p>
                    <p className="text-gray-700 mb-3">{caseLaw.summary}</p>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      caseLaw.importance === 'landmark' ? 'bg-yellow-100 text-yellow-800' :
                      caseLaw.importance === 'significant' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {caseLaw.importance}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {caseLaw.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Key Points:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {caseLaw.keyPoints.map((point, index) => (
                        <li key={index}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Judges:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {caseLaw.judges.map((judge, index) => (
                        <li key={index}>• {judge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Citations:</h5>
                  <div className="flex flex-wrap gap-2">
                    {caseLaw.citations.map((citation, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {citation}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'judgments' && (
          <>
            {filteredJudgments.map((judgment) => (
              <div key={judgment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{judgment.case}</h3>
                      <Star className="h-5 w-5 text-yellow-500 ml-2" />
                    </div>
                    <p className="text-gray-600 mb-3">
                      {judgment.court} • {judgment.year}
                    </p>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Significance:</h4>
                      <p className="text-gray-600">{judgment.significance}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Impact:</h4>
                      <p className="text-gray-600">{judgment.impact}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Key Principles:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {judgment.keyPrinciples.map((principle, index) => (
                      <div
                        key={index}
                        className="flex items-center px-3 py-2 bg-gray-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">{principle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Empty State */}
      {((activeTab === 'sections' && filteredSections.length === 0) ||
        (activeTab === 'cases' && filteredCaseLaws.length === 0) ||
        (activeTab === 'judgments' && filteredJudgments.length === 0)) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {activeTab === 'sections' && <Scale className="h-12 w-12 mx-auto" />}
            {activeTab === 'cases' && <FileText className="h-12 w-12 mx-auto" />}
            {activeTab === 'judgments' && <BookOpen className="h-12 w-12 mx-auto" />}
          </div>
          <p className="text-lg font-medium text-gray-600">No results found</p>
          <p className="text-sm text-gray-500">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};
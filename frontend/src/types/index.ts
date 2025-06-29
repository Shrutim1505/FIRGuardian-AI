export interface IncidentReport {
  id: string;
  officerId: string;
  stationId: string;
  incidentType: string;
  description: string;
  location: string;
  dateTime: string;
  complainant: {
    name: string;
    contact: string;
    address: string;
  };
  witnesses: Array<{
    name: string;
    contact: string;
  }>;
  status: 'draft' | 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
aiStatus?: 'Applied' | 'Pending' | 'Not Applied';
  summary?: string;
  priority?: 'Low' | 'Medium' | 'High';
  legalSections?: string[]; // e.g., ["IPC 379", "CrPC 200"]
  landmarkJudgments?: string[];
  attachments?: number;
}

export interface LegalSuggestion {
  section: string;
  act: string;
  description: string;
  applicability: number;
  category: 'criminal' | 'civil' | 'traffic' | 'cybercrime' | 'domestic';
}

export interface CaseLaw {
  title: string;
  citation: string;
  relevance: number;
  summary: string;
  year: number;
  court: string;
}

export interface AIAnalysis {
  confidence: number;
  incidentCategory: string;
  suggestedSections: LegalSuggestion[];
  relevantCaseLaws: CaseLaw[];
  recommendations: string[];
  entities: {
    persons: string[];
    locations: string[];
    dates: string[];
    crimes: string[];
  };
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}
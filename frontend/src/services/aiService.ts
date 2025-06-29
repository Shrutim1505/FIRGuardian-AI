import { AIAnalysis, LegalSuggestion, CaseLaw } from '../types';

// Mock AI service - in production, this would connect to your Golang backend
export class AIService {
  private static instance: AIService;
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyzeIncident(description: string, incidentType: string): Promise<AIAnalysis> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI analysis based on keywords
    const analysis = this.generateMockAnalysis(description, incidentType);
    return analysis;
  }

  private generateMockAnalysis(description: string, incidentType: string): AIAnalysis {
    const lowerDesc = description.toLowerCase();
    
    // Extract entities using simple keyword matching
    const entities = {
      persons: this.extractPersons(description),
      locations: this.extractLocations(description),
      dates: this.extractDates(description),
      crimes: this.extractCrimes(description)
    };

    // Determine category and suggestions based on content
    let category: AIAnalysis['incidentCategory'] = 'criminal';
    let suggestedSections: LegalSuggestion[] = [];
    let relevantCaseLaws: CaseLaw[] = [];
    let recommendations: string[] = [];

    if (lowerDesc.includes('theft') || lowerDesc.includes('steal') || lowerDesc.includes('rob')) {
      category = 'criminal';
      suggestedSections = [
        {
          section: 'Section 378',
          act: 'Indian Penal Code, 1860',
          description: 'Theft - Dishonestly taking movable property',
          applicability: 95,
          category: 'criminal'
        },
        {
          section: 'Section 379',
          act: 'Indian Penal Code, 1860',
          description: 'Punishment for theft',
          applicability: 95,
          category: 'criminal'
        }
      ];
      relevantCaseLaws = [
        {
          title: 'State of Maharashtra v. Mayer Hans George',
          citation: 'AIR 1965 SC 722',
          relevance: 88,
          summary: 'Defines the essential elements of theft under Section 378 IPC',
          year: 1965,
          court: 'Supreme Court of India'
        }
      ];
      recommendations = [
        'Collect CCTV footage if available',
        'Record witness statements',
        'Prepare detailed inventory of stolen items',
        'Check for fingerprints at the scene'
      ];
    } else if (lowerDesc.includes('assault') || lowerDesc.includes('attack') || lowerDesc.includes('hurt')) {
      category = 'criminal';
      suggestedSections = [
        {
          section: 'Section 321',
          act: 'Indian Penal Code, 1860',
          description: 'Voluntarily causing hurt',
          applicability: 90,
          category: 'criminal'
        },
        {
          section: 'Section 324',
          act: 'Indian Penal Code, 1860',
          description: 'Voluntarily causing hurt by dangerous weapons',
          applicability: 85,
          category: 'criminal'
        }
      ];
      relevantCaseLaws = [
        {
          title: 'Virsa Singh v. State of Punjab',
          citation: 'AIR 1958 SC 465',
          relevance: 85,
          summary: 'Distinction between simple and grievous hurt',
          year: 1958,
          court: 'Supreme Court of India'
        }
      ];
      recommendations = [
        'Obtain medical examination report',
        'Photograph injuries',
        'Record victim statement',
        'Identify and interview witnesses'
      ];
    } else if (lowerDesc.includes('cyber') || lowerDesc.includes('online') || lowerDesc.includes('internet')) {
      category = 'cybercrime';
      suggestedSections = [
        {
          section: 'Section 66',
          act: 'Information Technology Act, 2000',
          description: 'Computer related offences',
          applicability: 92,
          category: 'cybercrime'
        },
        {
          section: 'Section 66C',
          act: 'Information Technology Act, 2000',
          description: 'Identity theft',
          applicability: 88,
          category: 'cybercrime'
        }
      ];
      relevantCaseLaws = [
        {
          title: 'Shreya Singhal v. Union of India',
          citation: 'AIR 2015 SC 1523',
          relevance: 80,
          summary: 'Landmark case on cyber laws and freedom of speech',
          year: 2015,
          court: 'Supreme Court of India'
        }
      ];
      recommendations = [
        'Preserve digital evidence',
        'Take screenshots of online content',
        'Record IP addresses and timestamps',
        'Contact cybercrime investigation team'
      ];
    } else {
      // Default general criminal sections
      suggestedSections = [
        {
          section: 'Section 107',
          act: 'Code of Criminal Procedure, 1973',
          description: 'Security for keeping the peace',
          applicability: 70,
          category: 'criminal'
        }
      ];
      recommendations = [
        'Conduct thorough investigation',
        'Record all witness statements',
        'Collect physical evidence',
        'Maintain chain of custody'
      ];
    }

    return {
      confidence: Math.random() * 20 + 80, // 80-100%
      incidentCategory: category,
      suggestedSections,
      relevantCaseLaws,
      recommendations,
      entities
    };
  }

  private extractPersons(text: string): string[] {
    // Simple name extraction - in production, use NER
    const namePatterns = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g;
    return text.match(namePatterns) || [];
  }

  private extractLocations(text: string): string[] {
    // Simple location extraction
    const locationWords = ['street', 'road', 'avenue', 'lane', 'market', 'station', 'hospital', 'school'];
    const locations: string[] = [];
    
    locationWords.forEach(word => {
      const regex = new RegExp(`\\b\\w+\\s+${word}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) locations.push(...matches);
    });
    
    return locations;
  }

  private extractDates(text: string): string[] {
    // Simple date extraction
    const datePatterns = [
      /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g,
      /\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/gi
    ];
    
    const dates: string[] = [];
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) dates.push(...matches);
    });
    
    return dates;
  }

  private extractCrimes(text: string): string[] {
    const crimeKeywords = ['theft', 'robbery', 'assault', 'murder', 'kidnapping', 'fraud', 'cheating', 'harassment', 'dowry', 'rape'];
    const crimes: string[] = [];
    
    crimeKeywords.forEach(crime => {
      if (text.toLowerCase().includes(crime)) {
        crimes.push(crime);
      }
    });
    
    return crimes;
  }

  async getSuggestions(query: string): Promise<string[]> {
    // Mock search suggestions
    const suggestions = [
      'Theft of mobile phone',
      'Assault and battery',
      'Domestic violence',
      'Cybercrime - online fraud',
      'Traffic violation',
      'Property dispute',
      'Harassment case',
      'Missing person report'
    ];
    
    return suggestions.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }
}
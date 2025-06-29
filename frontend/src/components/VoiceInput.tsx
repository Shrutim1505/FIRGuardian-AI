import React, { useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  language = 'en-IN',
  className = '' 
}) => {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceInput({ language, continuous: true, interimResults: true });

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="text-red-600 bg-red-50 p-3 rounded-lg">
          <Volume2 className="h-5 w-5 mx-auto mb-2" />
          <p className="text-sm">Voice input not supported in this browser</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <button
        onClick={handleToggleListening}
        className={`relative inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white shadow-lg`}
      >
        {isListening ? (
          <MicOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
        
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-pulse" />
        )}
      </button>
      
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700">
          {isListening ? 'Listening...' : 'Click to start voice input'}
        </p>
        
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
        
        {transcript && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md max-w-md mx-auto">
            <p className="text-sm text-gray-800 italic">"{transcript}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
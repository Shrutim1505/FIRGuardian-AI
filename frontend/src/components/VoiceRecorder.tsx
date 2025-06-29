import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onAudioReady: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscription,
  onAudioReady,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        onAudioReady(blob);
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioURL = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioURL;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioURL);
      };
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;
    
    setIsTranscribing(true);
    try {
      // Here you would typically send the audio to your backend for transcription
      // For now, we'll simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription - in real app, this would come from your backend
      const mockTranscription = "This is a mock transcription of the recorded audio. In a real application, this would be processed by your speech-to-text service.";
      
      onTranscription(mockTranscription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Voice Recording</h3>
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-600 font-medium">
              Recording: {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-4 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center justify-center w-16 h-16 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-full transition-colors"
          >
            <Mic className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          >
            <Square className="h-6 w-6" />
          </button>
        )}

        {audioBlob && !isRecording && (
          <>
            <button
              onClick={isPlaying ? pauseRecording : playRecording}
              className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <button
              onClick={transcribeAudio}
              disabled={isTranscribing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
            >
              {isTranscribing ? 'Transcribing...' : 'Transcribe'}
            </button>
          </>
        )}
      </div>

      {isTranscribing && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-sm text-gray-600">Converting speech to text...</span>
        </div>
      )}

      <audio ref={audioRef} className="hidden" />
      
      <div className="text-xs text-gray-500 text-center mt-2">
        Click the microphone to start recording your incident description
      </div>
    </div>
  );
};
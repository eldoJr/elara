import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import axios from 'axios';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface VoiceAssistantProps {
  onResponse?: (response: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onResponse }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = async (event: any) => {
      const voiceText = event.results[0][0].transcript;
      setTranscript(voiceText);
      setIsListening(false);
      setIsProcessing(true);

      try {
        const response = await axios.post('http://localhost:8000/api/voice/query/', {
          voice_text: voiceText
        });

        if (response.data.status === 'success') {
          onResponse?.(response.data.ai_response);
          speakResponse(response.data.ai_response);
        }
      } catch (error) {
        console.error('Voice query error:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice Shopping Assistant</h3>
        <p className="text-sm text-gray-600">
          {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Click to speak'}
        </p>
      </div>

      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg hover:shadow-xl`}
      >
        {isProcessing ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {transcript && (
        <div className="max-w-md p-3 bg-white rounded-lg shadow-sm border">
          <div className="flex items-start space-x-2">
            <Volume2 className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700">"{transcript}"</p>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center max-w-xs">
        Try saying: "Show me laptops", "What's on sale?", "I need a gift for my mom"
      </div>
    </div>
  );
};

export default VoiceAssistant;
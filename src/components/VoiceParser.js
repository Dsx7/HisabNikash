'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import axios from 'axios';

const VoiceParser = ({ onDataReceived }) => {
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'bn-BD'; // Bangla Voice
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        processVoice(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Please use Google Chrome for Voice features.");
    }
  };

  const processVoice = async (text) => {
    setLoading(true);
    try {
      // Backend call
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/parse-voice`, { text });
      onDataReceived(res.data);
    } catch (err) {
      console.error(err);
      alert("AI bujhte pareni. Abar bolun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={startListening}
        disabled={loading}
        className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 font-semibold shadow-lg ${
          isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />)}
        {isListening ? "Sunchni..." : "Banglay Bolun"}
      </button>
    </div>
  );
};

export default VoiceParser;
'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button'; // Shadcn Button

const VoiceInput = ({ onDataReceived }) => {
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD';
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
      alert("Please use Google Chrome.");
    }
  };

  const processVoice = async (text) => {
    setLoading(true);
    try {
      // FIX: Use URLSearchParams to send data as 'application/x-www-form-urlencoded'
      // This satisfies the backend requirement strictly.
      const params = new URLSearchParams();
      params.append('text', text);

      const res = await axios.post(
      //  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/parse-voice`, 
		'/api/parse-voice',
        params
      );
      
      onDataReceived(res.data);
    } catch (err) {
      console.error(err);
      alert("AI Processing Failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center my-4">
      <Button
        onClick={startListening}
        disabled={loading}
        className={`rounded-full h-16 w-16 shadow-xl transition-all ${
          isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-black hover:bg-gray-800'
        }`}
      >
        {loading ? <Loader2 className="animate-spin" /> : (isListening ? <MicOff /> : <Mic />)}
      </Button>
      {isListening && <p className="fixed bottom-20 bg-black text-white px-4 py-2 rounded-full text-sm">Sunchni...</p>}
    </div>
  );
};

export default VoiceInput;
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Check, Loader2, Waveform } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const VoiceInput = ({ onDataReceived }) => {
  const [isListening, setIsListening] = useState(false);
  const [liveText, setLiveText] = useState(""); // Real-time text
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'bn-BD';
      // THIS IS KEY: interimResults allows real-time display
      recognition.interimResults = true; 
      recognition.continuous = true; // Don't stop after one sentence

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveText(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setLiveText("");
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Browser does not support speech recognition. Please use Chrome.");
    }
  };

  const stopListeningAndProcess = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Only process if there is text
      if (liveText.trim()) {
        processVoice(liveText);
      }
    }
  };

  const cancelListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setLiveText("");
  };

  const processVoice = async (text) => {
    setLoading(true);
    try {
      // Use relative path directly
      const params = new URLSearchParams();
      params.append('text', text);

      const res = await axios.post('/api/parse-voice', params);
      
      onDataReceived(res.data);
    } catch (err) {
      console.error(err);
      alert("AI Processing Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. Main Mic Button (Visible always) */}
      <div className="flex justify-center my-4">
        <Button
          onClick={startListening}
          disabled={loading}
          className={`rounded-full h-16 w-16 shadow-xl transition-all ${
            loading ? 'bg-gray-800' : 'bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Mic size={28} />}
        </Button>
      </div>

      {/* 2. REAL-TIME OVERLAY BOX (Only visible when listening) */}
      {isListening && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header / Animation */}
            <div className="bg-primary/10 p-6 flex flex-col items-center justify-center border-b border-border">
              <div className="relative">
                 <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                 <div className="relative bg-red-500 rounded-full p-4 text-white shadow-lg">
                    <Mic size={32} />
                 </div>
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
                শুনছি... বলুন (Listening...)
              </p>
            </div>

            {/* Live Text Display Area */}
            <div className="p-6 min-h-[150px] flex items-center justify-center text-center">
               {liveText ? (
                 <p className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
                   "{liveText}"
                 </p>
               ) : (
                 <p className="text-muted-foreground text-sm italic">
                   (কথা বলা শুরু করুন...)
                 </p>
               )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 divide-x divide-border border-t border-border bg-muted/30">
              <button 
                onClick={cancelListening}
                className="p-4 flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <X size={20} /> বাতিল (Cancel)
              </button>
              <button 
                onClick={stopListeningAndProcess}
                disabled={!liveText}
                className="p-4 flex items-center justify-center gap-2 text-emerald-600 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={20} /> ঠিক আছে (Done)
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default VoiceInput;
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, Check, Clock, AlertCircle, Edit3 } from 'lucide-react'; 
import VoiceInput from './VoiceInput';
import axios from 'axios';

const AddTransactionForm = ({ userId, onTransactionAdded }) => {
  // Main Form State
  const [form, setForm] = useState({
    type: 'EXPENSE', amount: '', relatedPerson: '', description: '', category: ''
  });

  // UI States
  const [pendingData, setPendingData] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- Handle Voice Response ---
  const handleVoiceData = (response) => {
    setErrorMessage("");
    
    if (!response || !response.success) {
      setErrorMessage("AI বুঝতে পারেনি। আবার চেষ্টা করুন।");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // FIX: Extract specific fields from the nested backend response
    // Backend structure: response.data.parsedData = { amount, category, description, type... }
    const { amount, category, description, type } = response.data.parsedData;

    // Create a flat object that matches our form structure
    const mappedData = {
      // Ensure type matches Select values (EXPENSE, INCOME, etc.)
      type: type ? type.toUpperCase() : 'EXPENSE', 
      amount: amount || '',
      description: description || '',
      category: category || '',
      relatedPerson: '' // Backend doesn't extract name yet, so leave blank for manual edit
    };

    // Success: Show Confirmation Overlay with the mapped data
    setPendingData(mappedData);
    setCountdown(10); 
    setIsPaused(false); // Reset pause state
  };

  // --- Countdown Logic ---
  useEffect(() => {
    let timer;
    if (pendingData && countdown > 0 && !isPaused) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (pendingData && countdown === 0 && !isPaused) {
      confirmSave();
    }
    return () => clearTimeout(timer);
  }, [countdown, pendingData, isPaused]);

  // --- Save Function ---
  const confirmSave = async () => {
    const dataToSave = pendingData || form;
    
    if(!dataToSave.amount) {
        setErrorMessage("Amount লিখুন।");
        return;
    }

    const finalData = {
        ...dataToSave,
        type: dataToSave.type || 'EXPENSE',
        amount: Number(dataToSave.amount),
        userId
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`, finalData);
      setForm({ type: 'EXPENSE', amount: '', relatedPerson: '', description: '', category: '' });
      setPendingData(null); 
      setErrorMessage("");
      onTransactionAdded(); 
    } catch (error) {
      console.error(error);
      setErrorMessage("Save failed.");
    }
  };

  // --- Cancel Function ---
  const handleCancel = () => {
    setPendingData(null);
    setCountdown(10);
    setErrorMessage("");
  };

  // --- Helper to pause timer on edit ---
  const handleEditStart = () => {
    setIsPaused(true);
  };

  // Shared Select styling class for consistency
  const selectClass = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Card className="w-full shadow-sm relative overflow-hidden border-border bg-card text-card-foreground">
      
      {/* --- EDITABLE CONFIRMATION OVERLAY --- */}
      {pendingData && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
          
          <div className="mb-4 flex flex-col items-center">
            {isPaused ? (
              <span className="text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1.5 rounded-full text-sm border border-yellow-200 dark:border-yellow-800">
                <Edit3 size={14} /> Editing Mode (Timer Paused)
              </span>
            ) : (
              <div className="relative inline-flex items-center justify-center">
                <Clock className="w-10 h-10 text-primary animate-pulse" />
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                  {countdown}
                </span>
              </div>
            )}
            {!isPaused && <h3 className="text-lg font-bold mt-2 text-foreground">Auto Save Hocche...</h3>}
          </div>

          {/* Editable Fields */}
          <div className="bg-muted/50 p-4 rounded-lg w-full mb-6 border border-border space-y-3 shadow-inner">
            
            {/* Type Selector */}
            <select 
              className={`${selectClass} font-semibold`}
              value={pendingData.type}
              onChange={(e) => {
                setPendingData({...pendingData, type: e.target.value});
                handleEditStart();
              }}
            >
              <option value="EXPENSE">EXPENSE (খরচ)</option>
              <option value="INCOME">INCOME (আয়)</option>
              <option value="LEND">LEND (পাবো)</option>
              <option value="BORROW">BORROW (দিবো)</option>
            </select>

            {/* Amount Input */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-16 text-left text-muted-foreground">Taka:</span>
                <Input 
                    type="number" 
                    value={pendingData.amount}
                    onChange={(e) => setPendingData({...pendingData, amount: e.target.value})}
                    onFocus={handleEditStart}
                    className="font-bold text-emerald-600 dark:text-emerald-400 text-lg h-10 bg-background"
                />
            </div>

            {/* Person Input */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-16 text-left text-muted-foreground">Name:</span>
                <Input 
                    value={pendingData.relatedPerson || ""}
                    placeholder="Name (Optional)"
                    onChange={(e) => setPendingData({...pendingData, relatedPerson: e.target.value})}
                    onFocus={handleEditStart}
                    className="h-10 bg-background"
                />
            </div>

            {/* Description Input */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-16 text-left text-muted-foreground">Desc:</span>
                <Input 
                    value={pendingData.description || ""}
                    placeholder="Details (Optional)"
                    onChange={(e) => setPendingData({...pendingData, description: e.target.value})}
                    onFocus={handleEditStart}
                    className="h-10 bg-background"
                />
            </div>

          </div>

          <div className="flex gap-4 w-full">
            <Button onClick={handleCancel} variant="outline" className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive">
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button onClick={confirmSave} className="flex-1">
              <Check className="w-4 h-4 mr-2" /> {isPaused ? "Save Now" : "Confirm"}
            </Button>
          </div>
          
          {!isPaused && (
             <button onClick={() => setIsPaused(true)} className="mt-4 text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors">
               Tap any field to Edit & Pause
             </button>
          )}
        </div>
      )}

      {/* --- NORMAL FORM --- */}
      <CardHeader>
        <CardTitle className="text-center text-lg text-foreground">Add New Transaction</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" className="animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <VoiceInput onDataReceived={handleVoiceData} />

        {/* Manual Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Type</label>
            <select
              className={selectClass}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="EXPENSE">Expense (খরচ)</option>
              <option value="INCOME">Income (আয়)</option>
              <option value="LEND">Lend (পাবো)</option>
              <option value="BORROW">Borrow (দিবো)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Amount</label>
            <Input 
                type="number" 
                placeholder="0.00" 
                value={form.amount} 
                onChange={(e) => setForm({ ...form, amount: e.target.value })} 
                className="bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Person / Shop</label>
            <Input 
                placeholder="e.g. Rahim" 
                value={form.relatedPerson} 
                onChange={(e) => setForm({ ...form, relatedPerson: e.target.value })} 
                className="bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <Input 
                placeholder="Description" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                className="bg-background"
            />
          </div>
        </div>

        <Button onClick={() => { setPendingData(form); setCountdown(0); }} className="w-full mt-2">
          Save Record
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
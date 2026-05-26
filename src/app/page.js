'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import AddTransactionForm from '@/components/AddTransactionForm';
import Dashboard from '@/components/Dashboard';
import RecentTransactions from '@/components/RecentTransactions';
import DebtManagement from '@/components/DebtManagement';
import LandingPage from '@/components/LandingPage';
import AdminDashboard from '@/components/AdminDashboard';
import { ModeToggle } from '@/components/ModeToggle';

// UI & Icons
import { Loader2, LogOut, Shield, User as UserIcon, LayoutDashboard, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const { user, dbUser, googleLogin, logout, loading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'debts'

  // --- DATA FETCHING ---

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // --- DATA FETCHING ---
  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/transactions?userId=${user.uid}&month=${selectedMonth}&year=${selectedYear}`);
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axios.delete(`/api/transactions/${transactionId}`);
      fetchTransactions(); 
    } catch (error) {
      console.error("Error deleting transaction", error);
      alert("Failed to delete transaction."); 
    }
  };

  // Fetch data when user logs in or month/year changes
  useEffect(() => {
    if (user) fetchTransactions();
  }, [user, selectedMonth, selectedYear]);

  // --- 1. LOADING STATE ---
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // --- 2. NOT LOGGED IN -> LANDING PAGE ---
  if (!user) {
    return <LandingPage onLogin={googleLogin} />;
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // --- 3. LOGGED IN -> APP LAYOUT ---
  return (
    <main className="min-h-screen bg-background transition-colors duration-300 font-sans text-foreground">
      
      {/* --- NAVBAR --- */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          
          {/* User Profile Info */}
          <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9 border border-primary/20">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.displayName?.[0] || <UserIcon size={16} />}
                </AvatarFallback>
             </Avatar>
             <div className="hidden md:block text-left">
                <h1 className="text-sm font-bold leading-none">{user.displayName}</h1>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide mt-0.5 text-left">
                    {dbUser?.role === 'admin' ? 'Administrator' : 'Personal Account'}
                </p>
             </div>
          </div>

          {/* Month/Year Selector */}
          <div className="flex items-center gap-2">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent border border-border rounded p-1 text-xs font-semibold focus:outline-none"
            >
              {months.map((m, i) => (
                <option key={m} value={i + 1} className="bg-background">{m}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent border border-border rounded p-1 text-xs font-semibold focus:outline-none"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y} className="bg-background">{y}</option>
              ))}
            </select>
            <div className="w-[1px] h-4 bg-border mx-1" />
            <ModeToggle />
            <Button 
                onClick={logout} 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 md:mr-2" /> 
              <span className="hidden md:inline">Exit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
        
        {/* VIEW SWITCHER TABS */}
        <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
                <button 
                    onClick={() => setActiveView('dashboard')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'dashboard' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <LayoutDashboard size={18} /> Dashboard
                </button>
                <button 
                    onClick={() => setActiveView('debts')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'debts' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <HandCoins size={18} /> Manage Debt
                </button>
            </div>
        </div>

        {/* CHECK IF ADMIN */}
        {dbUser?.role === 'admin' ? (
            
            // --- ADMIN VIEW ---
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-6 bg-purple-100 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
                        <p className="text-sm text-muted-foreground">Monitor system analytics and user base.</p>
                    </div>
                </div>
                
                <AdminDashboard />
                
                {/* Admin Personal Section */}
                <div className="border-t border-border pt-10 mt-12">
                     <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <UserIcon className="w-5 h-5" /> Your Personal Finance
                     </h3>
                     
                     {activeView === 'dashboard' ? (
                        <>
                            <Dashboard transactions={transactions} selectedMonth={selectedMonth} selectedYear={selectedYear} />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                                <div className="lg:col-span-1">
                                    <AddTransactionForm userId={user.uid} onTransactionAdded={fetchTransactions} /> 
                                </div>
                                <div className="lg:col-span-2">
                                    <RecentTransactions transactions={transactions} onUpdate={fetchTransactions} onDelete={handleDeleteTransaction} />
                                </div>
                            </div>
                        </>
                     ) : (
                        <DebtManagement transactions={transactions} onUpdate={fetchTransactions} />
                     )}
                </div>
            </div>

        ) : (
            
            // --- NORMAL USER VIEW ---
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {activeView === 'dashboard' ? (
                    <>
                        <Dashboard transactions={transactions} selectedMonth={selectedMonth} selectedYear={selectedYear} />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <AddTransactionForm userId={user.uid} onTransactionAdded={fetchTransactions} />
                            </div>
                            <div className="lg:col-span-2">
                                <RecentTransactions transactions={transactions} onUpdate={fetchTransactions} />
                            </div>
                        </div>
                    </>
                ) : (
                    <DebtManagement transactions={transactions} onUpdate={fetchTransactions} />
                )}
            </div>

        )}

      </div>
    </main>
  );
}
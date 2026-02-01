'use client';

import { useState } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  Banknote, 
  Calendar,
  Wallet,
  AlertCircle,
  ArrowUpDown,
  Filter,
  Check,
  X,
  AlertTriangle,
  Search,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// --- CHILD COMPONENT (ITEM) ---
const TransactionItem = ({ t, onSettleClick }) => {
  const getTheme = (type) => {
    switch (type) {
      case 'INCOME': return { bg: 'bg-emerald-100/60 dark:bg-emerald-900/20', text: 'text-emerald-800 dark:text-emerald-400', iconBg: 'bg-emerald-200 dark:bg-emerald-900', sign: '+', Icon: Banknote };
      case 'EXPENSE': return { bg: 'bg-rose-50/80 dark:bg-rose-900/20', text: 'text-rose-800 dark:text-rose-400', iconBg: 'bg-rose-200 dark:bg-rose-900', sign: '-', Icon: ShoppingBag };
      case 'LEND': return { bg: 'bg-blue-50/80 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', iconBg: 'bg-blue-200 dark:bg-blue-900', sign: '', Icon: Wallet };
      case 'BORROW': return { bg: 'bg-orange-50/80 dark:bg-orange-900/20', text: 'text-orange-900 dark:text-orange-400', iconBg: 'bg-orange-200 dark:bg-orange-900', sign: '', Icon: AlertCircle };
      default: return { bg: 'bg-gray-50', text: 'text-gray-800', iconBg: 'bg-gray-200', sign: '', Icon: Wallet };
    }
  };

  const theme = getTheme(t.type);
  const IconComponent = theme.Icon;
  const isDebt = t.type === 'LEND' || t.type === 'BORROW';

  return (
    <div className={`group flex items-center justify-between p-4 mb-3 rounded-2xl border transition-all duration-300 transform hover:scale-[1.01] ${theme.bg} ${t.isSettled ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${theme.iconBg} relative`}>
          <IconComponent size={22} className={theme.text} />
          {t.isSettled && (
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-slate-900">
               <Check size={10} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h4 className={`font-bold text-base ${theme.text} ${t.isSettled ? 'line-through decoration-2 decoration-gray-400/50' : ''}`}>
            {t.relatedPerson ? t.relatedPerson : (t.category || "General")}
          </h4>
          {t.description && (
             <p className={`text-sm font-medium opacity-85 ${theme.text} mb-0.5`}>
               {t.description}
             </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-1">
             <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 opacity-70">
              {t.type}
            </span>
            <span className={`flex items-center gap-1 text-xs opacity-70 ${theme.text}`}>
              <Calendar size={10} />
              {new Date(t.date).toLocaleDateString()}
            </span>

            {/* --- NEW: Show Settle Date if exists --- */}
            {t.isSettled && t.settledAt && (
               <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-200/50">
                 <Check size={8} />
                 Paid: {new Date(t.settledAt).toLocaleDateString()}
               </span>
            )}
            
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-1">
        <p className={`font-black text-xl ${theme.text} ${t.isSettled ? 'line-through decoration-2' : ''}`}>
          {theme.sign}৳{t.amount.toLocaleString()}
        </p>
        {t.isSettled ? (
             <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200">
               ✅ Settled
             </Badge>
        ) : (
            isDebt && (
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs px-2 border-primary/20 hover:bg-primary hover:text-white transition-colors"
                    onClick={() => onSettleClick(t)}
                >
                   {t.type === 'LEND' ? "Got Money?" : "Paid?"}
                </Button>
            )
        )}
      </div>
    </div>
  );
};

// --- MAIN PARENT COMPONENT ---
const RecentTransactions = ({ transactions, onUpdate }) => { 
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [confirmTx, setConfirmTx] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmSettle = async () => {
    if (!confirmTx) return;
    try {
        setIsProcessing(true);
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/${confirmTx._id}/settle`);
        if (onUpdate) onUpdate();
        setConfirmTx(null);
    } catch (error) {
        console.error("Failed to settle", error);
    } finally {
        setIsProcessing(false);
    }
  };

  // --- FILTER & SORT ---
  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const person = (t.relatedPerson || '').toLowerCase();
        const desc = (t.description || '').toLowerCase();
        const amount = t.amount.toString();
        return person.includes(query) || desc.includes(query) || amount.includes(query);
    }
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortOrder) {
      case 'newest': return new Date(b.date) - new Date(a.date);
      case 'oldest': return new Date(a.date) - new Date(b.date);
      case 'highAmount': return b.amount - a.amount;
      case 'lowAmount': return a.amount - b.amount;
      case 'typeGroup':
        const priority = { 'EXPENSE': 1, 'BORROW': 2, 'LEND': 3, 'INCOME': 4 };
        const diff = (priority[a.type] || 99) - (priority[b.type] || 99);
        return diff === 0 ? new Date(b.date) - new Date(a.date) : diff;
      default: return 0;
    }
  });

  // --- EXPORT TO CSV FUNCTION ---
  const handleExport = () => {
    if (sortedTransactions.length === 0) return;

    // 1. Headers (Added Settled Date)
    const headers = ["Date", "Type", "Amount", "Person", "Category", "Description", "Status", "Settled Date"];

    // 2. Data Rows
    const rows = sortedTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.amount,
        t.relatedPerson || "-",
        t.category || "General",
        `"${t.description || ""}"`, // Escape description
        t.isSettled ? "Settled" : "Active",
        t.settledAt ? new Date(t.settledAt).toLocaleDateString() : "-"
    ]);

    // 3. Combine
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");

    // 4. Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "my_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectStyle = "pl-8 pr-3 py-2 text-xs md:text-sm rounded-lg bg-background border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-muted/50 transition-colors appearance-none shadow-sm w-full md:w-auto";

  return (
    <div className="mt-8 relative">
        
      {/* --- POPUP OVERLAY --- */}
      {confirmTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background border border-border rounded-xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">
                        {confirmTx.type === 'LEND' ? 'Taka Bujhe Peyecehen?' : 'Taka Shodh Korechen?'}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                        Confirm settlement for <span className="font-bold text-foreground">{confirmTx.relatedPerson}</span> (৳{confirmTx.amount})?
                    </p>
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" className="flex-1" onClick={() => setConfirmTx(null)} disabled={isProcessing}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                        <Button className="flex-1" onClick={handleConfirmSettle} disabled={isProcessing}>
                            {isProcessing ? "Updating..." : <><Check className="w-4 h-4 mr-2" /> Confirm</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- HEADER CONTROLS --- */}
      <div className="flex flex-col gap-4 mb-5">
        
        {/* Title & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-foreground pl-1">History</h3>
            
            <div className="flex gap-2 w-full md:w-auto">
                {/* SEARCH BAR */}
                <div className="relative flex-1 md:w-56">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search..." 
                        className="pl-9 h-9 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                {/* EXPORT BUTTON */}
                <Button variant="outline" size="sm" className="h-9 px-3" onClick={handleExport} title="Download Excel/CSV">
                    <Download className="w-4 h-4" />
                </Button>
            </div>
        </div>

        {/* Filter & Sort Row */}
        <div className="flex gap-2 w-full">
            <div className="relative flex-1">
                <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select className={selectStyle} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="ALL">All Types</option>
                    <option value="EXPENSE">Only Expense</option>
                    <option value="INCOME">Only Income</option>
                    <option value="LEND">Only Lend</option>
                    <option value="BORROW">Only Borrow</option>
                </select>
            </div>
            <div className="relative flex-1">
                <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select className={selectStyle} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="typeGroup">Grouped by Type</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highAmount">Amount (High)</option>
                    <option value="lowAmount">Amount (Low)</option>
                </select>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {sortedTransactions.length > 0 ? (
            sortedTransactions.map((t) => (
            <TransactionItem key={t._id} t={t} onSettleClick={setConfirmTx} />
            ))
        ) : (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium">No transactions found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
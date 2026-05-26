'use client';

import { useState, useMemo } from 'react';
import { 
    HandCoins, 
    ArrowLeftRight, 
    CheckCircle2, 
    TrendingUp, 
    TrendingDown,
    Search,
    User,
    ChevronRight,
    ChevronDown,
    AlertTriangle,
    X,
    Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const DebtManagement = ({ transactions, onUpdate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedPerson, setExpandedPerson] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmTx, setConfirmTx] = useState(null);

    // --- 1. Filter and Group Data ---
    const debtData = useMemo(() => {
        const activeDebts = transactions.filter(t => (t.type === 'LEND' || t.type === 'BORROW') && !t.isSettled);
        
        const grouped = activeDebts.reduce((acc, t) => {
            const person = t.relatedPerson || 'Unknown';
            if (!acc[person]) {
                acc[person] = {
                    name: person,
                    totalLend: 0,
                    totalBorrow: 0,
                    transactions: []
                };
            }
            if (t.type === 'LEND') acc[person].totalLend += t.amount;
            else acc[person].totalBorrow += t.amount;
            
            acc[person].transactions.push(t);
            return acc;
        }, {});

        return Object.values(grouped).map(person => ({
            ...person,
            netBalance: person.totalLend - person.totalBorrow
        })).sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance));
    }, [transactions]);

    // --- 2. Filter by Search ---
    const filteredDebts = debtData.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- 3. Summary Stats ---
    const totalReceivable = debtData.reduce((acc, p) => acc + p.totalLend, 0);
    const totalPayable = debtData.reduce((acc, p) => acc + p.totalBorrow, 0);

    const handleConfirmSettle = async () => {
        if (!confirmTx) return;
        try {
            setIsProcessing(true);
            await axios.patch(`/api/transactions/${confirmTx._id}/settle`);
            setConfirmTx(null);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to settle", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* --- CONFIRMATION MODAL --- */}
            {confirmTx && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <HandCoins className="text-primary" /> Manage Debts
                    </h2>
                    <p className="text-muted-foreground text-sm">Track who owes you and who you owe.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search person..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* --- SUMMARY CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Ami Pabo (Receivable)</p>
                            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">৳{totalReceivable.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                            <TrendingUp className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Manush Pabe (Payable)</p>
                            <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-300">৳{totalPayable.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-rose-100 dark:bg-rose-900 rounded-full">
                            <TrendingDown className="text-rose-600 dark:text-rose-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- DEBT LIST BY PERSON --- */}
            <div className="space-y-4">
                {filteredDebts.length > 0 ? (
                    filteredDebts.map((person) => (
                        <Card key={person.name} className="overflow-hidden border-border bg-card hover:border-primary/20 transition-colors">
                            <div 
                                className="p-4 cursor-pointer flex items-center justify-between"
                                onClick={() => setExpandedPerson(expandedPerson === person.name ? null : person.name)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${person.netBalance >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600'}`}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{person.name}</h4>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                            {person.transactions.length} Active Transaction{person.transactions.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase">Net Balance</p>
                                        <p className={`font-bold text-sm sm:text-lg ${person.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {person.netBalance >= 0 ? '+' : '-'}৳{Math.abs(person.netBalance).toLocaleString()}
                                        </p>
                                    </div>
                                    {expandedPerson === person.name ? <ChevronDown className="text-muted-foreground w-5 h-5 sm:w-6 sm:h-6" /> : <ChevronRight className="text-muted-foreground w-5 h-5 sm:w-6 sm:h-6" />}
                                </div>
                            </div>

                            {/* Expanded Transactions */}
                            {expandedPerson === person.name && (
                                <div className="border-t border-border bg-muted/30 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                    {person.transactions.map((t) => (
                                        <div key={t._id} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-md ${t.type === 'LEND' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'}`}>
                                                    {t.type === 'LEND' ? <ArrowLeftRight size={16} /> : <HandCoins size={16} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm font-bold ${t.type === 'LEND' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                            {t.type === 'LEND' ? 'You Lent' : 'You Borrowed'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground font-medium">• {new Date(t.date).toLocaleDateString()}</span>
                                                    </div>
                                                    {t.description && <p className="text-xs text-muted-foreground italic">{t.description}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                                                <span className="font-bold text-sm sm:text-base">৳{t.amount.toLocaleString()}</span>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs gap-1 hover:bg-primary hover:text-white"
                                                    disabled={isProcessing}
                                                    onClick={() => setConfirmTx(t)}
                                                >
                                                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Settle</span><span className="sm:hidden">Pay</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="flex justify-end pt-2">
                                        <Badge variant="outline" className="text-[10px] py-0 px-2 uppercase font-bold text-muted-foreground">
                                            {person.netBalance >= 0 ? `They owe you total: ৳${Math.abs(person.netBalance).toLocaleString()}` : `You owe them total: ৳${Math.abs(person.netBalance).toLocaleString()}`}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                        <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <HandCoins className="text-muted-foreground w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold">No Active Debts</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                            You don't have any unpaid lend or borrow transactions at the moment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebtManagement;
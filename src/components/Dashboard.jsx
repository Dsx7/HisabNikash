'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// --- STAT CARD COMPONENT (No Change) ---
const StatCard = ({ title, value, type, icon: Icon }) => {
  const styles = {
    balance: "bg-slate-900 dark:bg-slate-950 text-white border-none",
    pabo: "bg-emerald-600 dark:bg-emerald-900 text-white border-none",
    dibo: "bg-rose-600 dark:bg-rose-900 text-white border-none",
  };

  return (
    <Card className={`shadow-lg relative overflow-hidden ${styles[type]} rounded-2xl transition-transform hover:scale-[1.02]`}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          {type === 'pabo' && <ArrowDownLeft className="text-emerald-100" />}
          {type === 'dibo' && <ArrowUpRight className="text-rose-100" />}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

// --- CHART COLORS ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BBF', '#FF6666'];

const Dashboard = ({ transactions }) => {
  
  // 1. Calculate Stats
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
  const totalPabo = transactions.filter(t => t.type === 'LEND' && !t.isSettled).reduce((acc, t) => acc + t.amount, 0);
  const totalDibo = transactions.filter(t => t.type === 'BORROW' && !t.isSettled).reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // 2. Prepare Data for Pie Chart (Group Expenses by Category)
  const expenseByCategory = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
        const cat = t.category || 'General';
        acc[cat] = (acc[cat] || 0) + t.amount;
        return acc;
    }, {});

  const pieData = Object.keys(expenseByCategory).map((key) => ({
    name: key,
    value: expenseByCategory[key],
  }));

  return (
    <div className="space-y-6">
      
      {/* --- TOP STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Bortoman Balance" value={`৳ ${balance.toLocaleString()}`} type="balance" icon={Wallet} />
        <StatCard title="Manush Pabe (Payable)" value={`৳ ${totalDibo.toLocaleString()}`} type="dibo" icon={TrendingDown} />
        <StatCard title="Ami Pabo (Receivable)" value={`৳ ${totalPabo.toLocaleString()}`} type="pabo" icon={TrendingUp} />
      </div>

      {/* --- CHART SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pie Chart: Expense Breakdown */}
          <Card className="shadow-sm border-border bg-card">
              <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                      <PieIcon className="w-5 h-5 text-primary" />
                      Khorocher Khat (Expense Breakdown)
                  </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                  {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="text-center text-muted-foreground">
                          <p>No expense data found.</p>
                      </div>
                  )}
              </CardContent>
          </Card>

          {/* Optional: Simple Summary List */}
          <Card className="shadow-sm border-border bg-card">
              <CardHeader>
                  <CardTitle className="text-lg">Masher Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-lg">
                      <span className="font-medium text-emerald-800 dark:text-emerald-400">Total Income</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">+৳{totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-rose-100/50 dark:bg-rose-900/20 rounded-lg">
                      <span className="font-medium text-rose-800 dark:text-rose-400">Total Expense</span>
                      <span className="font-bold text-rose-700 dark:text-rose-300">-৳{totalExpense.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-4 mt-2">
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Savings Rate</span>
                          <span className="font-bold text-primary">
                             {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
                          </span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${totalIncome > 0 ? ((balance / totalIncome) * 100) : 0}%` }}
                          />
                      </div>
                  </div>
              </CardContent>
          </Card>

      </div>

    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Trash2 } from 'lucide-react'; // Assuming you have a Trash2 icon

const RecentTransactions = ({ transactions, onUpdate, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <p className="text-muted-foreground">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id} className="border-b last:border-b-0 py-2 flex justify-between items-center">
            <div>
              <span className="font-medium">{transaction.name}: </span>
              <span className={transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
              </span>
              <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(transaction.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
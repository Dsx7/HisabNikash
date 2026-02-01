import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: ['EXPENSE', 'INCOME', 'LEND', 'BORROW'] 
    },
    amount: { type: Number, required: true },
    relatedPerson: { type: String, default: 'Unknown' },
    description: { type: String },
    category: { type: String, default: 'General' },
    date: { type: Date, default: Date.now },
    isSettled: { type: Boolean, default: false },
	settledAt: { type: Date }
});

// Check if model exists before compiling
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;
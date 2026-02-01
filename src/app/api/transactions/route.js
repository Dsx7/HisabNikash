import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';

// GET: সব ট্রানজেকশন আনা
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: নতুন ট্রানজেকশন অ্যাড করা
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json(); // Express এর req.body এর মতো

    const newTransaction = new Transaction(body);
    await newTransaction.save();

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
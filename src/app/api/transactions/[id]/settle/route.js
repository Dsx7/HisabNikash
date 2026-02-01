import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db'; 
import Transaction from '@/models/Transaction'; 

export async function PATCH(request, { params }) {
  try {
    // 1. Connect to DB
    await connectToDatabase();

    // 2. Get the ID
    const resolvedParams = await params; 
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });
    }

    // 3. Find and Update
    // FIX: We are now explicitly setting 'isSettled' to true
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id, 
      { 
        isSettled: true,        // <--- This was missing/wrong before
        settledAt: new Date()   // Optional: tracks when it happened
      }, 
      { new: true } // Returns the updated document so you see 'true' in response
    );

    if (!updatedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedTransaction 
    });

  } catch (error) {
    console.error("Settle Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
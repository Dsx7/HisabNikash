import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { uid, email, displayName, photoURL } = await request.json();

    let user = await User.findOne({ uid });

    if (!user) {
      // Auto-Admin check (আপনার ইমেইল দিন)
      const role = email === "your-email@gmail.com" ? "admin" : "user";
      user = new User({ uid, email, displayName, photoURL, role });
      await user.save();
    } else {
      user.displayName = displayName;
      user.photoURL = photoURL;
      await user.save();
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
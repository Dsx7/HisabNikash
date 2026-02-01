import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, email, photoURL, uid } = await req.json();

    // ১. চেক করি ইউজার আছে কিনা
    let user = await User.findOne({ email });

    if (!user) {
      // ২. না থাকলে নতুন ইউজার বানাই
      user = await User.create({
        userId: uid, // Firebase UID
        username: name,
        email,
        photoURL,
        provider: "google",
        createdAt: new Date()
      });
    }

    // ৩. ইউজার রিটার্ন করি
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        uid: user.userId,
        photoURL: user.photoURL
      }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "Google Login Failed" }, { status: 500 });
  }
}
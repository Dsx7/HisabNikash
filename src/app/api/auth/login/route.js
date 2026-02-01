import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function verifyTurnstile(token) {
  const secret = process.env.CLOUDFLARE_SECRET_KEY;
  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { 
      body: formData, 
      method: 'POST' 
  });
  const outcome = await result.json();
  return outcome.success;
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password, token } = await req.json();

    // 1. Turnstile Check
    const isHuman = await verifyTurnstile(token);
    if (!isHuman) {
      return NextResponse.json({ error: "Please complete the captcha" }, { status: 400 });
    }

    // 2. User Check
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ error: "Please login with Google" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        uid: user.userId
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
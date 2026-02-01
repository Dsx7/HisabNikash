import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Turnstile Verify Function
async function verifyTurnstile(token) {
  const secret = process.env.CLOUDFLARE_SECRET_KEY;
  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const result = await fetch(url, { body: formData, method: 'POST' });
  const outcome = await result.json();
  return outcome.success;
}

export async function POST(req) {
  try {
    await connectToDatabase();
    // Frontend থেকে 'token' (Turnstile) রিসিভ করছি
    const { username, email, password, token } = await req.json();

    // 1. Turnstile Check
    const isHuman = await verifyTurnstile(token);
    if (!isHuman) {
      return NextResponse.json({ error: "Cloudflare verification failed" }, { status: 400 });
    }

    // 2. Existing User Check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // 3. Hash Password & Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userId: `USER_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      photoURL: "",
      provider: "email"
    });

    return NextResponse.json({ success: true, message: "User created successfully" });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
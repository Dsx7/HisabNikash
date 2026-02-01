'use client';

import React, { useState, useRef } from 'react'; // useRef added
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X, Mail, User, Lock, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import HNLoader from '@/components/HNLoader';
// Turnstile Import
import { Turnstile } from '@marsidev/react-turnstile';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Turnstile State
  const [turnstileToken, setTurnstileToken] = useState(null);
  const turnstileRef = useRef();

  const checks = {
    length: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[^A-Za-z0-9]/.test(formData.password),
  };
  const isStrong = Object.values(checks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isStrong) { setError("Please fulfill password requirements."); return; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
    
    // Check Captcha
    if (!turnstileToken) {
        setError("Please complete the security check.");
        return;
    }

    try {
      setLoading(true);
      await axios.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        token: turnstileToken // Send Token to Backend
      });
      router.push('/login'); 
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      // Reset turnstile on error
      if (turnstileRef.current) turnstileRef.current.reset();
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setGoogleLoading(true);
    // Google does NOT need turnstile
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const res = await axios.post('/api/auth/google', {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
        });
        if (res.data.success) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
            router.push('/');
        }
    } catch (err) {
        console.error(err);
        setError("Google Registration Failed.");
    } finally {
        setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-primary">Create Account</CardTitle>
          <CardDescription>Join HisabNikash today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Fields */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Full Name" className="pl-9" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="email" placeholder="Email Address" className="pl-9" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type={showPass ? "text" : "password"} placeholder="Password" className="pl-9 pr-10" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength */}
            {formData.password && (
               <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1">
                  <p className="font-semibold mb-2">Password Validation:</p>
                  <Requirement label="At least 8 characters" met={checks.length} />
                  <Requirement label="One Uppercase (A-Z)" met={checks.hasUpper} />
                  <Requirement label="One Lowercase (a-z)" met={checks.hasLower} />
                  <Requirement label="One Number (0-9)" met={checks.hasNumber} />
                  <Requirement label="One Special Char (@#$)" met={checks.hasSpecial} />
               </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="password" placeholder="Confirm Password" className="pl-9" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
            </div>

            {/* Cloudflare Turnstile Widget */}
            <div className="flex justify-center my-2">
                <Turnstile 
                    ref={turnstileRef}
                    siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY} 
                    onSuccess={setTurnstileToken} 
                    onError={() => setError("Security check failed")}
                />
            </div>

            {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading || googleLoading || !isStrong || !turnstileToken}>
              {loading ? <HNLoader size="text-xl" /> : "Sign Up"}
            </Button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with</span></div>
            </div>

            <Button variant="outline" type="button" onClick={handleGoogleRegister} className="w-full gap-2" disabled={loading || googleLoading}>
                 {googleLoading ? <HNLoader size="text-xl" /> : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                )}
                Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const Requirement = ({ label, met }) => (
  <div className={`flex items-center gap-2 ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
    {met ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
    <span>{label}</span>
  </div>
);
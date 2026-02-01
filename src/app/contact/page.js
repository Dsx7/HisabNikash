'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ChevronLeft, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SENT

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('SENDING');
    // Simulate API delay
    setTimeout(() => {
      setStatus('SENT');
      setForm({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <main className="container max-w-2xl mx-auto p-4 py-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Contact Support</h1>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 md:p-8">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
                <h2 className="text-lg font-bold">We'd love to hear from you</h2>
                <p className="text-sm text-muted-foreground">Feedback, bugs, or feature requests?</p>
            </div>
          </div>

          {status === 'SENT' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
                <p className="text-muted-foreground mt-2 mb-6">Thank you. We usually reply within 24 hours.</p>
                <Button variant="outline" onClick={() => setStatus('IDLE')}>
                    Send Another Message
                </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Name</label>
                        <Input 
                            placeholder="Your Name" 
                            className="bg-background"
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
                        <Input 
                            type="email" 
                            placeholder="hello@example.com" 
                            className="bg-background"
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            required 
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Message</label>
                    <textarea 
                        className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        placeholder="Tell us about the issue or idea..."
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        required
                    />
                </div>

                <Button type="submit" className="w-full mt-4" disabled={status === 'SENDING'}>
                    {status === 'SENDING' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                    ) : (
                        <>
                            Send Message <Send className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>
          )}

        </CardContent>
      </Card>
    </main>
  );
}
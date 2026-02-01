'use client';

import Link from 'next/link';
import { Shield, ChevronLeft, Lock, Eye, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <main className="container max-w-2xl mx-auto p-4 py-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-2 pb-6 border-b border-border/50">
            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">We Protect Your Data</h2>
            <p className="text-sm text-muted-foreground">Last updated: January 31, 2026</p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <Database className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-lg">1. Data Collection</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                  We collect only the data necessary to function: transaction amounts, categories, and descriptions. Voice data is processed temporarily to convert speech to text and is not stored permanently as audio files.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Lock className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-lg">2. Data Security</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                  Your transactions are stored in a secure database. We use industry-standard encryption to protect your financial logs from unauthorized access.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Eye className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-lg">3. Third Parties</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                  We do not sell, trade, or rent your personal identification information to others. Your financial habits remain private to you.
                </p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </main>
  );
}
'use client';

import Link from 'next/link';
import { FileText, ChevronLeft, AlertTriangle, CheckCircle, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <main className="container max-w-2xl mx-auto p-4 py-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Terms of Service</h1>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 space-y-6">

            {/* Disclaimer Box */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-400 text-sm">Disclaimer</h3>
                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
                        This application is for personal tracking only. We are not responsible for any financial discrepancies or decisions made based on this data.
                    </p>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <section className="space-y-2">
                    <h3 className="font-bold flex items-center gap-2">
                        <CheckCircle size={18} className="text-primary" /> Acceptable Use
                    </h3>
                    <p className="text-sm text-muted-foreground pl-7">
                        By using HisabNikash, you agree not to misuse the service. You are responsible for all activity that occurs under your account.
                    </p>
                </section>

                <div className="h-px bg-border/50" />

                <section className="space-y-2">
                    <h3 className="font-bold flex items-center gap-2">
                        <Mic size={18} className="text-primary" /> Voice Features
                    </h3>
                    <p className="text-sm text-muted-foreground pl-7">
                        Voice recognition technology is provided "as is". Accuracy depends on clarity, background noise, and dialect. Always verify transaction amounts manually before saving.
                    </p>
                </section>

                <div className="h-px bg-border/50" />

                <section className="space-y-2">
                    <h3 className="font-bold flex items-center gap-2">
                        <FileText size={18} className="text-primary" /> Modifications
                    </h3>
                    <p className="text-sm text-muted-foreground pl-7">
                        We reserve the right to modify these terms at any time. Continued use of the app constitutes agreement to the new terms.
                    </p>
                </section>
            </div>

        </CardContent>
      </Card>
    </main>
  );
}
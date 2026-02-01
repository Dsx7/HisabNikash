'use client';

import { useState, useEffect } from 'react';
import HNLoader from '@/components/HNLoader'; // Custom Loader
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  ShieldCheck, 
  Zap, 
  PieChart, 
  ArrowRight, 
  CheckCircle2, 
  Globe
} from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';

export default function LandingPage() {
  // --- SPLASH SCREEN LOGIC ---
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    // পেজ লোড হওয়ার পর ১.৫ সেকেন্ড লোডার দেখাবে
    const timer = setTimeout(() => {
      setIsMounting(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // যদি মাউন্টিং হয়, তাহলে শুধু HNLoader দেখাবে
  if (isMounting) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-background">
        <HNLoader size="text-8xl md:text-9xl" />
      </div>
    );
  }

  // --- MAIN CONTENT ---
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden selection:bg-indigo-500/30 animate-in fade-in zoom-in duration-500">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-primary-foreground font-bold text-xl">H</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden md:block">
              Hisab<span className="text-primary">Nikash</span>
            </span>
          </div>
          
          <div className="flex gap-4 items-center">
            <ModeToggle />
            <Link href="/login">
              <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-20 left-10 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[80px] -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <Badge variant="secondary" className="mb-6 py-1.5 px-4 text-sm border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-medium rounded-full">
              ✨ AI Powered Finance Tracker
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            টাকা পয়সার হিসাব রাখুন <br/> 
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              শুধুমাত্র ভয়েস কমান্ডে
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            টাইপ করার ঝামেলা শেষ। বাংলায় বলুন <strong>"১০০ টাকা রিকশা ভাড়া"</strong>, আর আমাদের AI অটোমেটিক সব হিসাব সেভ করে নিবে।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full w-full shadow-xl shadow-primary/25 hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto hover:bg-muted/50 border-primary/20">
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-700" />
                ))}
             </div>
             <p>Trusted by <span className="font-bold text-foreground">500+ Users</span> in Bangladesh</p>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
          <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">মাত্র ৩টি ধাপে ব্যবহার করুন</h2>
                  <p className="text-muted-foreground">কোনো জটিল সেটআপ নেই, লগিন করুন আর শুরু করুন।</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { icon: Mic, title: "1. Speak", desc: "মাইক বাটনে চাপ দিয়ে বাংলায় বলুন আপনার খরচের কথা।" },
                      { icon: Zap, title: "2. AI Processing", desc: "আমাদের স্মার্ট AI আপনার কথা বুঝে নাম, টাকা এবং ক্যাটাগরি আলাদা করবে।" },
                      { icon: PieChart, title: "3. Track & Grow", desc: "ড্যাশবোর্ডে দেখুন আপনার টাকা কোথায় খরচ হচ্ছে এবং সঞ্চয় বাড়ান।" }
                  ].map((step, idx) => (
                      <div key={idx} className="relative p-8 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all text-center group">
                          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                              <step.icon size={32} />
                          </div>
                          <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                          <p className="text-muted-foreground">{step.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
         <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">কেন HisabNikash সেরা?</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800/50">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-left">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30">
                            <Mic />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Bangla Voice Recognition</h3>
                        <p className="text-muted-foreground">
                            বিশ্বসেরা Gemini এবং ChatGPT হাইব্রিড ইঞ্জিন ব্যবহার করে আমরা দিচ্ছি ৯৯% নির্ভুল বাংলা ভয়েস টাইপিং সুবিধা। আঞ্চলিক টান থাকলেও সমস্যা নেই!
                        </p>
                    </div>
                    <div className="flex-1 w-full bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-rose-500">Listening...</span>
                        </div>
                        <p className="text-lg font-medium text-indigo-700 dark:text-indigo-300">"বাজার করলাম ৫০০ টাকার"</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card hover:bg-muted/50 transition-colors border-border/60">
                <CardContent className="p-8">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-4">
                        <ShieldCheck />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Lend & Borrow</h3>
                    <p className="text-muted-foreground">কে কত টাকা পাবে বা কাকে কত টাকা দিতে হবে, সব মনে রাখার দায়িত্ব আমাদের।</p>
                </CardContent>
            </Card>

            <Card className="bg-card hover:bg-muted/50 transition-colors border-border/60">
                <CardContent className="p-8">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mb-4">
                          <PieChart />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Visual Analytics</h3>
                    <p className="text-muted-foreground">পাই চার্ট এবং গ্রাফের মাধ্যমে দেখুন মাসের শেষে আপনার টাকা কোথায় হাওয়া হয়ে যাচ্ছে।</p>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-card hover:bg-muted/50 transition-colors border-border/60">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                    <div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                            <Globe />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Anywhere Access</h3>
                        <p className="text-muted-foreground">মোবাইল, ল্যাপটপ বা ট্যাবলেট - সব জায়গা থেকে আপনার হিসাবে অ্যাক্সেস করুন। ডাটা ক্লাউডে সুরক্ষিত থাকে।</p>
                    </div>
                </CardContent>
            </Card>
         </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-muted/20 border-t border-border/50">
         <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">ব্যবহারকারীরা কী বলছেন?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: "Rahim Ahmed", role: "Small Business Owner", comment: "আগে খাতা-কলমে হিসাব রাখতাম, এখন মুখে বললেই সব সেভ হয়ে যায়। অসাধারণ অ্যাপ!" },
                    { name: "Fatima Begum", role: "Student", comment: "মেসের খরচের হিসাব রাখা এখন খুব সহজ। কে কত টাকা পাবে সব এখানে থাকে।" },
                    { name: "Tanvir Hasan", role: "Freelancer", comment: "ডার্ক মোড আর চার্ট ফিচারটা আমার খুব প্রিয়। এক্সেল শিট ডাউনলোড করা যায়, এটাই সেরা।" }
                ].map((user, idx) => (
                    <Card key={idx} className="bg-background border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-left">
                            <div className="flex gap-1 mb-4">
                                {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400">★</span>)}
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed">"{user.comment}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {user.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{user.name}</h4>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
         </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
          <div className="space-y-4">
              {[
                  { q: "এটা কি সম্পূর্ণ ফ্রি?", a: "হ্যাঁ! ব্যক্তিগত ব্যবহারের জন্য HisabNikash সম্পূর্ণ ফ্রি।" },
                  { q: "আমার ডাটা কি সুরক্ষিত?", a: "অবশ্যই। আমরা ইন্ডাস্ট্রি স্ট্যান্ডার্ড এনক্রিপশন ব্যবহার করি এবং আপনার ডাটা কারো সাথে শেয়ার করি না।" },
                  { q: "ইন্টারনেট ছাড়া কি চলবে?", a: "বর্তমানে ডাটা সেভ করার জন্য ইন্টারনেটের প্রয়োজন।" }
              ].map((faq, idx) => (
                  <Card key={idx} className="border-border/50">
                      <CardContent className="p-6">
                          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-primary" /> {faq.q}
                          </h4>
                          <p className="text-muted-foreground ml-7">{faq.a}</p>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-20 bg-primary text-primary-foreground text-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">আজই হিসাব রাখা শুরু করুন</h2>
            <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto text-primary-foreground/80">
                দেরি না করে জয়েন করুন বাংলাদেশের সবচেয়ে স্মার্ট পার্সোনাল ফাইন্যান্স প্ল্যাটফর্মে।
            </p>
            <Link href="/register">
                <Button 
                    size="lg" 
                    variant="secondary" 
                    className="h-16 px-10 text-xl rounded-full text-primary font-bold hover:scale-105 transition-transform shadow-2xl"
                >
                    Create Account
                </Button>
            </Link>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 bg-background border-t border-border/50 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2026 HisabNikash. Built with ❤️ in Bangladesh.</p>
            <div className="flex gap-6">
                <Link href="/privacy" className="hover:underline hover:text-primary">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:underline hover:text-primary">Terms</Link>
                <span>•</span>
                <Link href="/contact" className="hover:underline hover:text-primary">Contact</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
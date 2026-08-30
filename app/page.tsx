import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ShieldCheck, Zap, Globe, ArrowRight, Sparkles } from "lucide-react";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-amber-50/40 text-slate-800 selection:bg-orange-500 selection:text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-linear-to-tr from-amber-300/40 via-orange-300/40 to-red-300/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-orange-400/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-125 h-125 bg-rose-400/25 blur-[140px] rounded-full pointer-events-none" />

      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-amber-50/20">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl  font-bold tracking-tight text-slate-900">
              Pingly
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/verifyingOptions">
              <Button className="font-medium rounded-full px-6 bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 text-white shadow-lg shadow-orange-500/20 transition-all">
               Join us 
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 px-6 pt-16 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-300/40 text-orange-700 text-xs font-semibold uppercase tracking-widest mb-8">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Next-gen instant messaging</span>
            </div>

            <h1 className=" text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-slate-900 mb-6">
              Chat warmer.
              <br />
              Connect faster with{" "}
              <span className="italic bg-linear-to-r from-amber-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
                Pingly.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-lg font-normal leading-relaxed mb-10">
              Real-time conversations, elevated — warm design, instant OTP sign-in, and modern encryption baked into every message.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 text-white shadow-2xl shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] group">
                  Start chatting free
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-semibold border-orange-200/80 bg-white/60 hover:bg-white text-slate-700 backdrop-blur-md transition-all shadow-sm">
                  Explore features
                </Button>
              </a>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-sm space-y-3">
              <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-sm bg-white/80 backdrop-blur-md border border-orange-100 px-5 py-3 shadow-lg shadow-orange-500/5">
                <p className="text-sm text-slate-700">did you get the OTP?</p>
              </div>
              <div className="mr-auto max-w-[75%] rounded-2xl rounded-bl-sm bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white px-5 py-3 shadow-lg shadow-orange-500/25">
                <p className="text-sm">yep, logged in already 🔥</p>
              </div>
              <div className="ml-auto max-w-[60%] rounded-2xl rounded-br-sm bg-white/80 backdrop-blur-md border border-orange-100 px-5 py-3 shadow-lg shadow-orange-500/5">
                <p className="text-sm text-slate-700">that fast?</p>
              </div>
              <div className="flex items-center gap-1.5 pl-2">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" />
              </div>
            </div>
          </div>

        </div>
      </section>

      <section id="features" className="relative z-10 py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="mb-12 text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">Why Pingly</span>
          <h2 className=" text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Built for speed, tuned for warmth</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-orange-100 bg-white/70 backdrop-blur-xl text-slate-800 rounded-3xl p-2 hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500/10 to-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 mb-2">
                <Zap className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl  font-bold text-slate-900">Instant OTP login</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sign in with your number and a friction-free SMS code — no passwords to remember.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-white/70 backdrop-blur-xl text-slate-800 rounded-3xl p-2 hover:border-red-400/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-orange-500/10 to-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl  font-bold text-slate-900">Encrypted & private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every conversation stays yours. Secure sessions built for complete peace of mind.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-100 bg-white/70 backdrop-blur-xl text-slate-800 rounded-3xl p-2 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500/10 to-red-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mb-2">
                <Globe className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl  font-bold text-slate-900">Cross-device sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">
                Jump between mobile and desktop with zero delay — your chats follow you everywhere.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      <Footer/>
    </div>
  );
}
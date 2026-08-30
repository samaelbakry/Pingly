"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { loginWithEmail } from "@/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await loginWithEmail(email, password);
      console.log(res);
      toast.success("Logged in successfully!");
      router.push("/chatDashboard");
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center text-center space-y-1.5 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-linear-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Sign in to pick up where your draft left off
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          className="w-full h-12 mt-2 font-semibold bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 text-white shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99] rounded-xl cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            "Logging in..."
          ) : (
            <>
              Log in
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs sm:text-sm font-medium text-slate-500">
        Need an account?{" "}
        <Link
          href="/register"
          className="font-bold text-orange-600 hover:text-red-600 underline underline-offset-4 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
"use client";

import { registerWithEmail } from "@/services/auth";
import { ArrowRight, CreditCardCheck, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { toast } from "sonner";

export default function RegsiterPage() {
  const [name , setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordsDoNotMatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (passwordsDoNotMatch) {
      return;
    }

    setLoading(true);

    try {
      const res = await registerWithEmail(name , email, password);
      console.log(res);
      toast.success("Account created successfully!");
      router.push("/chatDashboard");
    } catch (error) {
      console.log(error);
      toast.error("Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center text-center space-y-2 w-full">
        <h1 className="text-3xl font-black tracking-tight bg-linear-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-sm font-medium text-slate-500 mb-5">
          Make room for your next conversation
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
            Full name
          </label>
          <div className="relative">
            <CreditCardCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-orange-200 bg-white/80 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              name="name"
              onChange={(event) => setName(event.target.value)}
              type="text"
              value={name}
              placeholder="John deo..."
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-orange-200 bg-white/80 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
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
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-orange-200 bg-white/80 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              aria-describedby={
                passwordsDoNotMatch ? "password-match-error" : undefined
              }
              aria-invalid={passwordsDoNotMatch}
              className={`w-full h-12 pl-10 pr-4 rounded-xl border bg-white/80 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                passwordsDoNotMatch
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
              }`}
              name="confirmPassword"
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              value={confirmPassword}
              placeholder="••••••••"
              required
            />
          </div>
          {passwordsDoNotMatch && (
            <span
              className="mt-1 block text-xs font-semibold text-red-500"
              id="password-match-error"
            >
              Passwords do not match.
            </span>
          )}
        </div>

        <button
          className="w-full h-12 mt-2 font-semibold bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 text-white shadow-lg shadow-orange-500/25 transition-all active:scale-[0.99] rounded-xl cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={passwordsDoNotMatch || loading}
          type="submit"
        >
          {loading ? (
            "Creating Account..."
          ) : (
            <>
              Sign up
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-medium text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-orange-600 hover:text-red-600 underline underline-offset-4 transition-colors"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
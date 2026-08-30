"use client";

import { useState } from "react";
import { sendOTP, verifyOtp } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router= useRouter();

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      await sendOTP(phone);
      setOtpSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const user = await verifyOtp(otp);
      console.log("Logged user:", user);
      router.replace("/chatDashboard")
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!otpSent ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-slate-700"
              >
                Phone number
              </label>

              <span className="text-[11px] font-medium text-slate-400">
                Required
              </span>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                +
              </span>

              <Input
                id="phone"
                type="tel"
                placeholder="20 1XX XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-13 rounded-2xl border-slate-200 bg-slate-50/70 pl-9 pr-4 text-sm shadow-none transition-all placeholder:text-slate-400 focus-visible:border-orange-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-orange-500/10"
              />
            </div>

            <p className="px-1 text-[11px] leading-5 text-slate-400">
              We&apos;ll send you a one-time verification code.
            </p>
          </div>

          <Button
            onClick={handleSendOTP}
            disabled={loading}
            className="h-13 w-full rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-rose-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/25 active:translate-y-0 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Sending code...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <span className="text-lg">→</span>
              </span>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-linear-to-r from-orange-500 to-rose-500" />
            <div className="h-1.5 flex-1 rounded-full bg-linear-to-r from-orange-500 to-rose-500" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800">
              Verify your number
            </p>

            <p className="text-xs leading-5 text-slate-400">
              Enter the 6-digit code we sent to your phone.
            </p>
          </div>

          <div className="flex justify-center py-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="gap-2 sm:gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-10 rounded-xl border-slate-200 bg-slate-50/70 text-lg font-semibold text-slate-800 shadow-none transition-all focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/10 sm:h-14 sm:w-12"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length < 6}
            className="h-13 w-full rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-rose-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Verifying...
              </span>
            ) : (
              "Verify & Continue"
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                className="font-semibold text-orange-500 transition-colors hover:text-orange-600"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      )}

      <div id="recaptcha-container" className="mt-3 flex justify-center" />
    </div>
  );
}


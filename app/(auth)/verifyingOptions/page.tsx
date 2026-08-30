import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Mail } from "lucide-react";

export default function VerifyingOptions() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25">
        <MessageSquare className="h-6 w-6 fill-current" />
      </div>

      <h1 className="bg-linear-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-2xl sm:text-3xl font-black tracking-tight text-transparent">
        Welcome to Pingly
      </h1>
      <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 mb-6">
        How would you like to get started?
      </p>

      <div className="w-full space-y-3">
        <Button
          className="h-12 w-full rounded-xl bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:opacity-95 active:scale-[0.99]"
        >
          <Link href="/phoneVerifying" className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            Continue with Phone
          </Link>
        </Button>

        <Button
          variant="outline"
          className="h-12 w-full rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-xs hover:bg-orange-50/50 hover:border-orange-200 active:scale-[0.99]"
        >
          <Link href="/register" className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4 text-orange-500" />
            Create with Email
          </Link>
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs font-medium text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-orange-600 transition-colors hover:text-red-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-400">
        By continuing, you agree to Pingly&apos;s Terms & Privacy Policy.
      </p>
    </div>
  );
}
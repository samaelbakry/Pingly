import AuthForm from "@/components/auth/AuthForm";
import { MessageCircle } from "lucide-react";

export default function PhoneVerifying() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center space-y-1.5 mb-6">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 mb-3">
          <MessageCircle className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-linear-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
          Verifying your phone
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Sign in to connect with your world
        </p>
      </div>

      <AuthForm />

      <p className="mt-6 text-xs text-center text-slate-400">
        By signing in, you agree to Pingly&apos;s Terms & Privacy Policy
      </p>
    </div>
  );
}
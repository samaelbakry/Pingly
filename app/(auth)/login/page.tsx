import AuthForm from "@/components/auth/AuthForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-amber-50/40 p-4 overflow-hidden font-sans text-slate-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-tr from-amber-300/40 via-orange-300/30 to-red-300/40 blur-[140px] rounded-full pointer-events-none" />

      <Card className="relative w-full max-w-md border-white/80 bg-white/75 backdrop-blur-2xl shadow-2xl shadow-orange-500/10 rounded-3xl p-3 text-slate-800">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/25 mb-2">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>

          <CardTitle className="text-3xl font-black tracking-tight bg-linear-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-transparent">
            Pingly
          </CardTitle>
          <CardDescription className="text-sm font-medium text-slate-500">
            Sign in to connect with your world
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AuthForm />
        </CardContent>

        <CardFooter className="justify-center pt-2">
          <p className="text-xs text-center text-slate-400">
            By signing in, you agree to Pingly&apos;s Terms & Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

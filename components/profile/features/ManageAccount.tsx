import { Camera, Mail, Phone, UserRound } from "lucide-react";

export default function ManageAccount() {
  return (
    <section className="relative flex chat-scroll h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            Account
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Your Profile
          </h1>

          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            Manage your personal information and profile picture.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200/70 bg-white/60 p-5 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-6">
          <div className="mb-8 flex flex-col items-center">
            <div className="group relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-100 shadow-xl shadow-orange-500/10 dark:border-zinc-900 dark:bg-orange-950/40">
                <UserRound className="h-12 w-12 text-orange-500" />
              </div>

              <button
                type="button"
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-lg transition-transform hover:scale-105 dark:border-zinc-950"
                aria-label="Change profile picture"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              className="mt-3 text-xs font-bold text-orange-500 transition-colors hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
            >
              Change profile picture
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <UserRound className="h-3.5 w-3.5 text-orange-500" />
                Full name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="h-12 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <Mail className="h-3.5 w-3.5 text-orange-500" />
                Email
              </label>

              <input
                type="email"
                disabled
                placeholder="your@email.com"
                className="h-12 w-full cursor-not-allowed rounded-2xl border border-zinc-200 bg-zinc-100/70 px-4 text-sm text-zinc-500 outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <Phone className="h-3.5 w-3.5 text-orange-500" />
                Phone number
              </label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                className="h-12 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                className="rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:opacity-95 active:scale-[0.98]"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

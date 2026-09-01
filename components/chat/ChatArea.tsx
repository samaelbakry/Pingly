import Logo from "../ui/Logo";

export default function ChatArea() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full rounded-3xl border border-white/80 bg-white/85 p-8 text-center shadow-xl shadow-orange-500/5 backdrop-blur-2xl">
      <div className="flex flex-col items-center max-w-xs">
       <Logo/>
        <h3 className="bg-linear-to-r from-orange-600 via-red-500 to-rose-600 bg-clip-text text-xl font-black tracking-tight text-transparent">
          Select a conversation
        </h3>

        <p className="mt-1.5 text-xs font-medium text-slate-400 leading-relaxed">
          Choose a contact from the sidebar list to view messages and start chatting
        </p>
      </div>
    </div>
  );
}
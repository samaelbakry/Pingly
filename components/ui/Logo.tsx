import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Logo({withText = false}:{withText?:boolean}) {
  return (

      <Link href={"/"} className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20">
          <MessageCircle size={16} />
        </div>
       {withText && <span className="text-lg font-bold text-slate-800">Pingly</span>}
      </Link>
  );
}

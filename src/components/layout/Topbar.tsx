
import { Bell, UserCircle } from 'lucide-react'

export function Topbar() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 mx-2"></div>

                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-700">Síndico Atual</p>
                        <p className="text-xs text-slate-500">Condomínio Solar</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                        <UserCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    )
}

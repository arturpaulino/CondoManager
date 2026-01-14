'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Wrench, Wallet, Truck, Settings, LogOut, HandCoins } from 'lucide-react'

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/financeiro', label: 'Financeiro', icon: Wallet },
    { href: '/cobrancas', label: 'Cobranças', icon: HandCoins },
    { href: '/moradores', label: 'Moradores', icon: Users },
    { href: '/fornecedores', label: 'Fornecedores', icon: Truck },
    { href: '/manutencoes', label: 'Manutenções', icon: Wrench },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-slate-900 text-slate-50 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    CondoManager
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 shadow-sm'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </aside>
    )
}


import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Fixa */}
            <Sidebar />

            {/* Área Principal */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Topbar />

                <main className="flex-1 p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

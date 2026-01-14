
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MoradorForm } from '@/components/moradores/MoradorForm'

export default function NovoMoradorPage() {
    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/moradores">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Novo Morador</h1>
                        <p className="text-slate-500">Cadastre um novo proprietário ou inquilino.</p>
                    </div>
                </div>

                <MoradorForm />
            </div>
        </DashboardLayout>
    )
}

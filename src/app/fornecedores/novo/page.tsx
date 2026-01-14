
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FornecedorForm } from '@/components/fornecedores/FornecedorForm'

export default function NovoFornecedorPage() {
    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/fornecedores">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Novo Fornecedor</h1>
                        <p className="text-slate-500">Cadastre um prestador de serviço.</p>
                    </div>
                </div>

                <FornecedorForm />
            </div>
        </DashboardLayout>
    )
}


import { createClient } from '@/lib/supabaseServer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { PagamentoForm } from '@/components/financeiro/PagamentoForm'

export default async function NovoPagamentoPage() {
    const supabase = await createClient()

    const { data: fornecedores } = await supabase
        .from('fornecedores')
        .select('id, nome')
        .eq('status', 'ativo')
        .order('nome')

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/financeiro">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Novo Lançamento</h1>
                        <p className="text-slate-500">Registre uma conta a pagar.</p>
                    </div>
                </div>

                <PagamentoForm fornecedores={fornecedores || []} />
            </div>
        </DashboardLayout>
    )
}

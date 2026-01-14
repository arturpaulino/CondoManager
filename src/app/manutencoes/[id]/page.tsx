
import { createClient } from '@/lib/supabaseServer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ManutencaoForm } from '@/components/manutencoes/ManutencaoForm'
import { notFound } from 'next/navigation'

export default async function EditarManutencaoPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient()

    // Fetch Maintenance
    const { data: manutencao } = await supabase
        .from('manutencoes')
        .select('*')
        .eq('id', params.id)
        .single()

    // Fetch Suppliers
    const { data: fornecedores } = await supabase
        .from('fornecedores')
        .select('id, nome')
        .eq('status', 'ativo')
        .order('nome')

    if (!manutencao) {
        notFound()
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/manutencoes">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Editar Manutenção</h1>
                        <p className="text-slate-500">Atualize os dados do agendamento.</p>
                    </div>
                </div>

                <ManutencaoForm initialData={manutencao} fornecedores={fornecedores || []} />
            </div>
        </DashboardLayout>
    )
}

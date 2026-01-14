
import { createClient } from '@/lib/supabaseServer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { CobrancaForm } from '@/components/cobrancas/CobrancaForm'
import { notFound } from 'next/navigation'

export default async function EditarCobrancaPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const supabase = await createClient()

    // Fetch Cobranca
    const { data: cobranca } = await supabase
        .from('cobrancas')
        .select('*')
        .eq('id', params.id)
        .single()

    // Fetch residents
    const { data: moradores } = await supabase
        .from('moradores')
        .select('id, nome, unidade')
        .eq('status', 'ativo')
        .order('nome')

    if (!cobranca) {
        notFound()
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/cobrancas">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Editar Cobrança</h1>
                        <p className="text-slate-500">Atualize os dados da cobrança.</p>
                    </div>
                </div>

                <CobrancaForm initialData={cobranca} moradores={moradores || []} />
            </div>
        </DashboardLayout>
    )
}

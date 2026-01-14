
import { createClient } from '@/lib/supabaseServer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { CobrancaForm } from '@/components/cobrancas/CobrancaForm'

export default async function NovaCobrancaPage() {
    const supabase = await createClient()

    // Fetch active residents for dropdown
    const { data: moradores } = await supabase
        .from('moradores')
        .select('id, nome, unidade')
        .eq('status', 'ativo')
        .order('nome')

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
                        <h1 className="text-2xl font-bold text-slate-900">Nova Cobrança</h1>
                        <p className="text-slate-500">Registre uma nova cobrança para um morador.</p>
                    </div>
                </div>

                <CobrancaForm moradores={moradores || []} />
            </div>
        </DashboardLayout>
    )
}

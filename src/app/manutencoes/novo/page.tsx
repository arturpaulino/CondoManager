
import { createClient } from '@/lib/supabaseServer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ManutencaoForm } from '@/components/manutencoes/ManutencaoForm'

export default async function NovaManutencaoPage() {
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
                    <Link href="/manutencoes">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Agendar Manutenção</h1>
                        <p className="text-slate-500">Registre uma nova manutenção ou serviço.</p>
                    </div>
                </div>

                <ManutencaoForm fornecedores={fornecedores || []} />
            </div>
        </DashboardLayout>
    )
}


import { createClient } from '@/lib/supabaseServer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { MoradorForm } from '@/components/moradores/MoradorForm'
import { notFound } from 'next/navigation'

export default async function EditarMoradorPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient()

    // Fetch Resident
    const { data: morador } = await supabase
        .from('moradores')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!morador) {
        notFound()
    }

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
                        <h1 className="text-2xl font-bold text-slate-900">Editar Morador</h1>
                        <p className="text-slate-500">Atualize os dados do morador.</p>
                    </div>
                </div>

                <MoradorForm initialData={morador} />
            </div>
        </DashboardLayout>
    )
}

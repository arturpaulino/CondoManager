
import { createClient } from '@/lib/supabaseServer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FornecedorForm } from '@/components/fornecedores/FornecedorForm'
import { notFound } from 'next/navigation'

export default async function EditarFornecedorPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient()

    const { data: fornecedor, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !fornecedor) {
        notFound()
    }

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
                        <h1 className="text-2xl font-bold text-slate-900">Editar Fornecedor</h1>
                        <p className="text-slate-500">Atualize os dados do prestador.</p>
                    </div>
                </div>

                <FornecedorForm initialData={fornecedor} />
            </div>
        </DashboardLayout>
    )
}

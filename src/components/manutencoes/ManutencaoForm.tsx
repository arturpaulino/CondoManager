'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

interface ManutencaoFormProps {
    initialData?: any
    fornecedores: any[]
}

export function ManutencaoForm({ initialData, fornecedores }: ManutencaoFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        descricao: initialData?.descricao || '',
        fornecedor_id: initialData?.fornecedor_id || '',
        data_agendada: initialData?.data_agendada || '',
        status: initialData?.status || 'pendente',
        observacoes: initialData?.observacoes || '',
        custo_estimado: initialData?.custo_estimado || '',
    })

    // Check if editing
    const isEditing = !!initialData?.id

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Basic validation
            if (!formData.descricao) throw new Error('Descrição é obrigatória.')
            if (!formData.data_agendada) throw new Error('Data Agendada é obrigatória.')

            const submitData = { ...formData }

            // Convert empty string to null for number/dates if necessary, though 'custo_estimado' is numeric
            if (submitData.custo_estimado === '') {
                // @ts-ignore
                submitData.custo_estimado = null
            }

            let result;

            if (isEditing) {
                result = await supabase
                    .from('manutencoes')
                    .update(submitData)
                    .eq('id', initialData.id)
            } else {
                result = await supabase
                    .from('manutencoes')
                    .insert([submitData])
            }

            const { error } = result

            if (error) throw error

            router.push('/manutencoes')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Input id="descricao" name="descricao" placeholder="Ex: Limpeza da Caixa d'água" required value={formData.descricao} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fornecedor_id">Fornecedor Responsável</Label>
                        <select
                            id="fornecedor_id"
                            name="fornecedor_id"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                            value={formData.fornecedor_id}
                            onChange={handleChange}
                        >
                            <option value="">Selecione um fornecedor (opcional)...</option>
                            {fornecedores.map((f) => (
                                <option key={f.id} value={f.id}>{f.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="data_agendada">Data Agendada *</Label>
                        <Input id="data_agendada" name="data_agendada" type="date" required value={formData.data_agendada} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="pendente">Pendente</option>
                            <option value="agendado">Agendado</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="custo_estimado">Custo Estimado (R$)</Label>
                        <Input id="custo_estimado" name="custo_estimado" type="number" step="0.01" placeholder="0.00" value={formData.custo_estimado} onChange={handleChange} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                        id="observacoes"
                        name="observacoes"
                        className="flex h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                        placeholder="Detalhes adicionais..."
                        value={formData.observacoes}
                        onChange={handleChange}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link href="/manutencoes">
                        <Button type="button" variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? 'Salvar Alterações' : 'Agendar Manutenção'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

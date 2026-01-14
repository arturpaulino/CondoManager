'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

interface CobrancaFormProps {
    initialData?: any
    moradores: any[]
}

export function CobrancaForm({ initialData, moradores }: CobrancaFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        morador_id: initialData?.morador_id || '',
        descricao: initialData?.descricao || '',
        valor: initialData?.valor || '',
        data_vencimento: initialData?.data_vencimento || '',
        data_pagamento: initialData?.data_pagamento || '',
        status: initialData?.status || 'pendente',
        observacoes: initialData?.observacoes || '',
    })

    const isEditing = !!initialData?.id

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (!formData.morador_id) throw new Error('Selecione um morador.')
            if (!formData.descricao) throw new Error('Descrição é obrigatória.')
            if (!formData.valor) throw new Error('Valor é obrigatório.')
            if (!formData.data_vencimento) throw new Error('Data de vencimento é obrigatória.')

            const submitData = { ...formData }
            if (submitData.data_pagamento === '') {
                // @ts-ignore
                submitData.data_pagamento = null
            }

            let result;

            if (isEditing) {
                result = await supabase
                    .from('cobrancas')
                    .update(submitData)
                    .eq('id', initialData.id)
            } else {
                result = await supabase
                    .from('cobrancas')
                    .insert([submitData])
            }

            const { error } = result

            if (error) throw error

            router.push('/cobrancas')
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
                    <Label htmlFor="morador_id">Morador *</Label>
                    <select
                        id="morador_id"
                        name="morador_id"
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                        value={formData.morador_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {moradores.map((m) => (
                            <option key={m.id} value={m.id}>{m.nome} - {m.unidade}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Input id="descricao" name="descricao" placeholder="Ex: Condomínio Janeiro/2026" required value={formData.descricao} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="valor">Valor (R$) *</Label>
                        <Input id="valor" name="valor" type="number" step="0.01" placeholder="0.00" required value={formData.valor} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="data_vencimento">Data Vencimento *</Label>
                        <Input id="data_vencimento" name="data_vencimento" type="date" required value={formData.data_vencimento} onChange={handleChange} />
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
                            <option value="pago">Pago</option>
                            <option value="atrasado">Atrasado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="data_pagamento">Data Pagamento</Label>
                        <Input id="data_pagamento" name="data_pagamento" type="date" value={formData.data_pagamento} onChange={handleChange} />
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
                    <Link href="/cobrancas">
                        <Button type="button" variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? 'Salvar Alterações' : 'Gerar Cobrança'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

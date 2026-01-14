'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

interface PagamentoFormProps {
    initialData?: any
    fornecedores: any[]
}

export function PagamentoForm({ initialData, fornecedores }: PagamentoFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        descricao: initialData?.descricao || '',
        fornecedor_id: initialData?.fornecedor_id || '',
        valor: initialData?.valor || '',
        data_vencimento: initialData?.data_vencimento || '',
        data_pagamento: initialData?.data_pagamento || '',
        status: initialData?.status || 'pendente',
        forma_pagamento: initialData?.forma_pagamento || '',
        observacoes: initialData?.observacoes || '',
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
            if (!formData.data_vencimento) throw new Error('Data de Vencimento é obrigatória.')
            if (!formData.valor) throw new Error('Valor é obrigatório.')
            if (Number(formData.valor) <= 0) throw new Error('Valor deve ser maior que zero.')

            // Clean up empty payment date if status is not paid (DB constraint)
            const submitData = { ...formData }
            if (submitData.status !== 'pago') {
                submitData.data_pagamento = null
            }

            let result;

            if (isEditing) {
                result = await supabase
                    .from('pagamentos')
                    .update(submitData)
                    .eq('id', initialData.id)
            } else {
                result = await supabase
                    .from('pagamentos')
                    .insert([submitData])
            }

            const { error } = result

            if (error) throw error

            router.push('/financeiro')
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
                    <Input id="descricao" name="descricao" placeholder="Ex: Manutenção Elétrica" required value={formData.descricao} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fornecedor_id">Fornecedor</Label>
                        <select
                            id="fornecedor_id"
                            name="fornecedor_id"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                            value={formData.fornecedor_id}
                            onChange={handleChange}
                        >
                            <option value="">Selecione um fornecedor...</option>
                            {fornecedores.map((f) => (
                                <option key={f.id} value={f.id}>{f.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="valor">Valor (R$) *</Label>
                        <Input id="valor" name="valor" type="number" step="0.01" placeholder="0.00" required value={formData.valor} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="data_vencimento">Vencimento *</Label>
                        <Input id="data_vencimento" name="data_vencimento" type="date" required value={formData.data_vencimento} onChange={handleChange} />
                    </div>
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
                        </select>
                    </div>
                </div>

                {formData.status === 'pago' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label htmlFor="data_pagamento">Data do Pagamento *</Label>
                            <Input id="data_pagamento" name="data_pagamento" type="date" required value={formData.data_pagamento} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                            <select
                                id="forma_pagamento"
                                name="forma_pagamento"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                value={formData.forma_pagamento}
                                onChange={handleChange}
                            >
                                <option value="">Selecione...</option>
                                <option value="boleto">Boleto</option>
                                <option value="pix">PIX</option>
                                <option value="transferencia">Transferência</option>
                                <option value="cartao">Cartão</option>
                                <option value="dinheiro">Dinheiro</option>
                            </select>
                        </div>
                    </div>
                )}

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
                    <Link href="/financeiro">
                        <Button type="button" variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? 'Salvar Alterações' : 'Lançar Pagamento'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

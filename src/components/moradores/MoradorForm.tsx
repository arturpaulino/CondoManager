'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

interface MoradorFormProps {
    initialData?: any
}

export function MoradorForm({ initialData }: MoradorFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        nome: initialData?.nome || '',
        cpf: initialData?.cpf || '',
        email: initialData?.email || '',
        telefone: initialData?.telefone || '',
        unidade: initialData?.unidade || '',
        status: initialData?.status || 'ativo',
    })

    // Check if editing
    const isEditing = !!initialData?.id

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Basic validation
            if (!formData.nome) throw new Error('Nome é obrigatório.')
            if (!formData.unidade) throw new Error('Unidade/Apartamento é obrigatório.')

            let result;

            if (isEditing) {
                result = await supabase
                    .from('moradores')
                    .update(formData)
                    .eq('id', initialData.id)
            } else {
                result = await supabase
                    .from('moradores')
                    .insert([formData])
            }

            const { error } = result

            if (error) throw error

            router.push('/moradores')
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
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input id="nome" name="nome" placeholder="Ex: João Silva" required value={formData.nome} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unidade">Unidade / Apartamento *</Label>
                        <Input id="unidade" name="unidade" placeholder="Ex: 101 Bloco A" required value={formData.unidade} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="nome@email.com" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                        <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} />
                    </div>
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
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link href="/moradores">
                        <Button type="button" variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? 'Salvar Alterações' : 'Cadastrar Morador'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

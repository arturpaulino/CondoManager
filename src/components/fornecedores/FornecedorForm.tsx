'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

interface FornecedorFormProps {
    initialData?: {
        id?: string
        nome: string
        tipo_servico: string | null
        telefone: string | null
        email: string | null
        endereco: string | null
        documento: string | null
    }
}

export function FornecedorForm({ initialData }: FornecedorFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        nome: initialData?.nome || '',
        tipo_servico: initialData?.tipo_servico || '',
        telefone: initialData?.telefone || '',
        email: initialData?.email || '',
        endereco: initialData?.endereco || '',
        documento: initialData?.documento || '',
    })

    // Determine if we are editing based on existence of initialData.id
    const isEditing = !!initialData?.id

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!formData.telefone && !formData.email) {
            setError('Informe pelo menos um Telefone ou Email.')
            setLoading(false)
            return
        }

        try {
            let result;

            if (isEditing) {
                // Update existing
                result = await supabase
                    .from('fornecedores')
                    .update(formData)
                    .eq('id', initialData!.id)
            } else {
                // Create new
                result = await supabase
                    .from('fornecedores')
                    .insert([formData])
            }

            const { error } = result

            if (error) {
                throw error
            }

            router.push('/fornecedores')
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
                    <Input id="nome" name="nome" placeholder="Ex: Eletrica Silva" required value={formData.nome} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="documento">CPF / CNPJ</Label>
                        <Input id="documento" name="documento" placeholder="00.000.000/0000-00" value={formData.documento} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tipo_servico">Tipo de Serviço</Label>
                        <Input id="tipo_servico" name="tipo_servico" placeholder="Ex: Elétrica" value={formData.tipo_servico} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="contato@empresa.com" value={formData.email} onChange={handleChange} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input id="endereco" name="endereco" placeholder="Endereço completo" value={formData.endereco} onChange={handleChange} />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link href="/fornecedores">
                        <Button type="button" variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

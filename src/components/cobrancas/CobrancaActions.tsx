'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Loader2, Copy, Check } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CobrancaActionsProps {
    id: string
    moradorNome: string
    cpf?: string
    valor: number
    dataVencimento: string
    dataPagamento?: string | null
}

export function CobrancaActions({ id, moradorNome, cpf, valor, dataVencimento, dataPagamento }: CobrancaActionsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleDelete = async () => {
        const confirmed = window.confirm(`Tem certeza que deseja excluir esta cobrança?`)
        if (!confirmed) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('cobrancas')
                .delete()
                .eq('id', id)

            if (error) {
                throw error
            }

            router.refresh()
        } catch (err: any) {
            alert('Erro ao excluir: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCopyMessage = () => {
        const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
        const formatDate = (dateStr: string) => {
            if (!dateStr) return '-'
            const [year, month, day] = dateStr.split('-').map(Number)
            const date = new Date(year, month - 1, day)
            return format(date, 'dd/MM/yyyy', { locale: ptBR })
        }

        const message = `Assunto: Aviso de Pendência - Condomínio

Prezado(a) *${moradorNome}* ${cpf ? `(CPF: ${cpf})` : ''},

Gostaríamos de lembrar sobre a pendência financeira com vencimento em *${formatDate(dataVencimento)}*, no valor de *${formatMoney(valor)}*.

${dataPagamento ? `Caso o pagamento já tenha sido realizado em ${formatDate(dataPagamento)}, por favor, desconsidere esta notificação.` : 'Caso o pagamento já tenha sido realizado, por favor, desconsidere esta notificação.'}

Atenciosamente,
Administração.`

        navigator.clipboard.writeText(message)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyMessage}
                className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                title="Copiar Mensagem de Cobrança"
            >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>

            <Link href={`/cobrancas/${id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </Link>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
        </div>
    )
}

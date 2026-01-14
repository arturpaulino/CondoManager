
import { createClient } from '@/lib/supabaseServer'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { CobrancaActions } from '@/components/cobrancas/CobrancaActions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function CobrancasPage() {
    const supabase = await createClient()

    // Fetch cobrancas with resident info
    const { data: cobrancas, error } = await supabase
        .from('cobrancas')
        .select('*, moradores(nome, cpf, unidade)')
        .order('data_vencimento', { ascending: false })

    if (error) {
        console.error('Erro ao buscar cobranças:', error)
    }

    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-'
        const [year, month, day] = dateStr.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        return format(date, 'dd/MM/yyyy', { locale: ptBR })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pago': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Pago</Badge>
            case 'pendente': return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pendente</Badge>
            case 'atrasado': return <Badge variant="destructive">Atrasado</Badge>
            case 'cancelado': return <Badge variant="secondary">Cancelado</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cobranças</h1>
                        <p className="text-slate-500">Gestão de receitas e mensalidades.</p>
                    </div>
                    <Link href="/cobrancas/novo">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nova Cobrança
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Morador</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cobrancas?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        Nenhuma cobrança registrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                cobrancas?.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{c.moradores?.nome || 'Desconhecido'}</span>
                                                <span className="text-xs text-slate-400">{c.moradores?.unidade}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{c.descricao}</TableCell>
                                        <TableCell>{formatMoney(c.valor)}</TableCell>
                                        <TableCell>{formatDate(c.data_vencimento)}</TableCell>
                                        <TableCell>{getStatusBadge(c.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <CobrancaActions
                                                id={c.id}
                                                moradorNome={c.moradores?.nome}
                                                cpf={c.moradores?.cpf}
                                                valor={c.valor}
                                                dataVencimento={c.data_vencimento}
                                                dataPagamento={c.data_pagamento}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </DashboardLayout>
    )
}


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
import { PagamentoActions } from '@/components/financeiro/PagamentoActions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function FinanceiroPage() {
    const supabase = await createClient()

    // Fetch payments with supplier info
    const { data: pagamentos, error } = await supabase
        .from('pagamentos')
        .select('*, fornecedores!pagamentos_fornecedor_id_fkey(nome)')
        .order('data_vencimento', { ascending: true })

    if (error) {
        console.error('Erro ao buscar pagamentos:', error)
    }

    // Format currency
    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    // Format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-'
        return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pago': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Pago</Badge>
            case 'atrasado': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Atrasado</Badge>
            default: return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">Pendente</Badge>
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financeiro</h1>
                        <p className="text-slate-500">Contas a pagar e recebidos.</p>
                    </div>
                    <Link href="/financeiro/novo">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Novo Lançamento
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Fornecedor</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Pagamento</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pagamentos?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                        Nenhum lançamento encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagamentos?.map((pag) => (
                                    <TableRow key={pag.id}>
                                        <TableCell className="font-medium">{formatDate(pag.data_vencimento)}</TableCell>
                                        <TableCell>{pag.descricao}</TableCell>
                                        <TableCell>{pag.fornecedores?.nome || '-'}</TableCell>
                                        <TableCell className="font-bold text-slate-700">{formatMoney(pag.valor)}</TableCell>
                                        <TableCell>{getStatusBadge(pag.status)}</TableCell>
                                        <TableCell>{formatDate(pag.data_pagamento)}</TableCell>
                                        <TableCell className="text-right">
                                            <PagamentoActions id={pag.id} descricao={pag.descricao} />
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

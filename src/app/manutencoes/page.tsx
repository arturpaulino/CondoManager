
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
import { ManutencaoActions } from '@/components/manutencoes/ManutencaoActions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function ManutencoesPage() {
    const supabase = await createClient()

    // Fetch maintenances with supplier info
    const { data: manutencoes, error } = await supabase
        .from('manutencoes')
        .select('*, fornecedores!manutencoes_fornecedor_id_fkey(nome)')
        .order('data_agendada', { ascending: true })

    if (error) {
        console.error('Erro ao buscar manutenções:', error)
    }

    // Format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-'
        // Adjust time zone issue simply by parsing as string YYYY-MM-DD
        const [year, month, day] = dateStr.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        return format(date, 'dd/MM/yyyy', { locale: ptBR })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'concluido': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Concluído</Badge>
            case 'agendado': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Agendado</Badge>
            case 'em_andamento': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">Em Andamento</Badge>
            case 'cancelado': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200">Cancelado</Badge>
            default: return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">Pendente</Badge>
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manutenções</h1>
                        <p className="text-slate-500">Controle de manutenções preventivas e corretivas.</p>
                    </div>
                    <Link href="/manutencoes/novo">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nova Manutenção
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data Agendada</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Fornecedor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {manutencoes?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        Nenhuma manutenção encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                manutencoes?.map((man) => (
                                    <TableRow key={man.id}>
                                        <TableCell className="font-medium">{formatDate(man.data_agendada)}</TableCell>
                                        <TableCell>{man.descricao}</TableCell>
                                        <TableCell>{man.fornecedores?.nome || '-'}</TableCell>
                                        <TableCell>{getStatusBadge(man.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <ManutencaoActions id={man.id} descricao={man.descricao} />
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

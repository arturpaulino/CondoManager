
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
import { MoradorActions } from '@/components/moradores/MoradorActions'

export default async function MoradoresPage() {
    const supabase = await createClient()

    // Fetch residents
    const { data: moradores, error } = await supabase
        .from('moradores')
        .select('*')
        .order('nome', { ascending: true })

    if (error) {
        console.error('Erro ao buscar moradores:', error)
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Moradores</h1>
                        <p className="text-slate-500">Gestão de proprietários e inquilinos.</p>
                    </div>
                    <Link href="/moradores/novo">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Novo Morador
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Unidade</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>CPF</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {moradores?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        Nenhum morador encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                moradores?.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium">{m.nome}</TableCell>
                                        <TableCell>{m.unidade}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span>{m.telefone || '-'}</span>
                                                <span className="text-xs text-slate-400">{m.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{m.cpf || '-'}</TableCell>
                                        <TableCell>
                                            {m.status === 'ativo' ?
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Ativo</Badge> :
                                                <Badge variant="secondary">Inativo</Badge>
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <MoradorActions id={m.id} nome={m.nome} />
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

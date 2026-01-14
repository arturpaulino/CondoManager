
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
import { FornecedorActions } from '@/components/fornecedores/FornecedorActions'

export default async function FornecedoresPage() {
    const supabase = await createClient()

    const { data: fornecedores, error } = await supabase
        .from('fornecedores')
        .select('*')
        .order('nome', { ascending: true })

    if (error) {
        console.error('Erro ao buscar fornecedores:', error)
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fornecedores</h1>
                        <p className="text-slate-500">Gerencie seus prestadores de serviço.</p>
                    </div>
                    <Link href="/fornecedores/novo">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Novo Fornecedor
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Serviço</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fornecedores?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        Nenhum fornecedor encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fornecedores?.map((fornecedor) => (
                                    <TableRow key={fornecedor.id}>
                                        <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                                        <TableCell>{fornecedor.tipo_servico || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span>{fornecedor.telefone}</span>
                                                <span className="text-slate-500 text-xs">{fornecedor.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{fornecedor.documento || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={fornecedor.status === 'ativo' ? 'default' : 'secondary'} className={fornecedor.status === 'ativo' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : ''}>
                                                {fornecedor.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <FornecedorActions id={fornecedor.id} nome={fornecedor.nome} />
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

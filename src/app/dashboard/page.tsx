
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Activity, Wallet, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabaseServer'
import { format, getDaysInMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { FinancialChart } from '@/components/dashboard/FinancialChart'

const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
    </div>
)

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Active Suppliers Count
    const { count: suppliersCount } = await supabase
        .from('fornecedores')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo')

    // 2. Fetch Pending Maintenance Count
    const { count: maintenanceCount } = await supabase
        .from('manutencoes')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pendente', 'agendado', 'em_andamento'])

    // 3. Fetch Next Maintenances (Limit 5)
    // NOTE: Explicitly using the foreign key name to avoid ambiguous relationship errors
    const { data: nextMaintenances } = await supabase
        .from('manutencoes')
        .select('*, fornecedores!manutencoes_fornecedor_id_fkey(nome)')
        .in('status', ['pendente', 'agendado', 'em_andamento'])
        .order('data_agendada', { ascending: true })
        .limit(5)

    // 4. Financial Stats (This Month)
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    const { data: payments } = await supabase
        .from('pagamentos')
        .select('valor, status, data_vencimento')
        .gte('data_vencimento', firstDay)
        .lte('data_vencimento', lastDay)

    const totalAPagar = payments
        ?.filter(p => p.status !== 'cancelado')
        .reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

    const totalPago = payments
        ?.filter(p => p.status === 'pago')
        .reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

    // PREPARE CHART DATA
    const daysInMonth = getDaysInMonth(now)
    const chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        // Sum payments for this day (checking the day part of YYYY-MM-DD string)
        const dayTotal = payments
            ?.filter(p => {
                if (!p.data_vencimento) return false
                const [pYear, pMonth, pDay] = p.data_vencimento.split('-').map(Number)
                return pDay === day && p.status !== 'cancelado'
            })
            .reduce((acc, curr) => acc + Number(curr.valor), 0) || 0;

        return { name: day.toString(), day: day, total: dayTotal }
    })


    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-'
        const [year, month, day] = dateStr.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        return format(date, 'dd/MM', { locale: ptBR })
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 mt-1">Visão geral do condomínio</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Contas do Mês"
                        value={formatMoney(totalAPagar)}
                        subtitle={`Pago: ${formatMoney(totalPago)}`}
                        icon={Wallet}
                        color="bg-slate-700"
                    />
                    <StatCard
                        title="Manutenções Ativas"
                        value={maintenanceCount || 0}
                        icon={Activity}
                        color="bg-orange-500"
                    />
                    <StatCard
                        title="Fornecedores"
                        value={suppliersCount || 0}
                        icon={Users}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Saldo em Caixa"
                        value="R$ --"
                        subtitle="Em breve"
                        icon={DollarSign}
                        color="bg-emerald-500"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Despesas Diárias</h3>
                            <p className="text-sm text-slate-500">Movimentação financeira de {format(now, 'MMMM', { locale: ptBR })}</p>
                        </div>
                        <div className="h-64 w-full">
                            <FinancialChart data={chartData} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Próximas Manutenções</h3>
                            <Link href="/manutencoes" className="text-sm text-blue-600 hover:underline">Ver todas</Link>
                        </div>

                        <div className="space-y-4">
                            {nextMaintenances?.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-10">Nenhuma manutenção agendada.</p>
                            ) : (
                                nextMaintenances?.map((m) => (
                                    <div key={m.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex flex-col items-center justify-center text-orange-700 font-bold text-xs shadow-sm">
                                            <CalendarDays className="h-4 w-4 mb-1 opacity-70" />
                                            {formatDate(m.data_agendada)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800 line-clamp-1">{m.descricao}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {m.fornecedores?.nome || 'Sem fornecedor'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

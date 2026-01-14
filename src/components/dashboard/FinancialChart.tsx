'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function FinancialChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                Sem dados financeiros neste mês.
            </div>
        )
    }

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="day"
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: '#F1F5F9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                        dataKey="total"
                        fill="#0F172A"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

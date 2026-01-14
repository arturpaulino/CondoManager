'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestDbPage() {
    const [logs, setLogs] = useState<string[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const [data, setData] = useState<any>(null)

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`])

    async function runTest() {
        setIsRunning(true)
        setLogs([])
        setData(null)

        try {
            addLog('Iniciando teste de conexão...')

            // Simula um "check" de inicialização
            await new Promise(r => setTimeout(r, 500))
            addLog('Cliente Supabase inicializado.')
            addLog(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)

            addLog('Tentando conectar ao banco de dados...')
            const start = performance.now()

            const { data, error, count } = await supabase
                .from('fornecedores')
                .select('*', { count: 'exact', head: false })
                .limit(5)

            const end = performance.now()
            const ping = (end - start).toFixed(0)

            if (error) {
                throw error
            }

            addLog(`Conectado! Ping: ${ping}ms`)
            addLog(`Tabela 'fornecedores' acessível. Registros encontrados: ${data?.length}`)

            setData(data)
            addLog('Teste finalizado com SUCESSO. ✅')

        } catch (err: any) {
            console.error(err)
            addLog(`❌ ERRO: ${err.message || JSON.stringify(err)}`)
            addLog('Verifique suas variáveis de ambiente (.env.local) e se o RLS permite leitura.')
        } finally {
            setIsRunning(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-mono p-8">
            <div className="max-w-3xl mx-auto space-y-6">

                <header className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h1 className="text-xl font-bold text-emerald-400">System Diagnostic</h1>
                    <span className="text-xs text-gray-500">Supabase Connection Referece</span>
                </header>

                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold">Teste de Integridade do Banco</h2>
                            <p className="text-sm text-gray-400">Verifica a latência e permissões de leitura.</p>
                        </div>
                        <button
                            onClick={runTest}
                            disabled={isRunning}
                            className={`px-4 py-2 rounded font-medium transition-colors ${isRunning
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                        >
                            {isRunning ? 'Executando...' : 'Iniciar Diagnóstico'}
                        </button>
                    </div>

                    {/* Console de Logs */}
                    <div className="bg-black rounded-md p-4 h-64 overflow-auto border border-gray-800 font-mono text-sm shadow-inner">
                        {logs.length === 0 ? (
                            <span className="text-gray-600 italic">Aguardando início do teste...</span>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className="mb-1 border-l border-emerald-900 pl-2">
                                    <span className="text-emerald-500 mr-2">➜</span>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Visualização de Dados */}
                {data && (
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                        <h3 className="text-emerald-400 font-semibold mb-4">Amostra de Dados (Raw JSON)</h3>
                        <pre className="bg-black p-4 rounded text-xs text-gray-300 overflow-auto max-h-60">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}

            </div>
        </div>
    )
}

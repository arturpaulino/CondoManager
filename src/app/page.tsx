
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-6">
        CondoManager
      </h1>
      <p className="text-slate-400 max-w-lg text-lg mb-8">
        Sistema inteligente para gestão de fornecedores, manutenções e financeiro.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
        >
          Acessar Sistema <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/test-db"
          className="text-slate-300 hover:text-white px-6 py-3 border border-slate-700 rounded-lg transition-all"
        >
          Teste de Conexão
        </Link>
      </div>
    </div>
  )
}

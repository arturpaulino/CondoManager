'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Lock, Mail, User, Loader2, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('') // Optional: Store name in metadata
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            })

            if (error) {
                throw error
            }

            // Supabase default is "Confirm Email" disabled? Check project settings.
            // If it's enabled, we need to show a message. If not, we can redirect or show success.
            // Assuming auto-confirm for dev or showing success message.
            setSuccess(true)

        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Conta Criada!</h2>
                    <p className="text-slate-600 mb-6">
                        Sua conta foi criada com sucesso. Verifique seu e-mail para confirmar o cadastro (se necessário) ou faça login agora.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                        Ir para Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
                <div className="mb-6">
                    <Link href="/login" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Voltar para Login
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Criar Conta</h1>
                    <p className="text-slate-500">Junte-se ao CondoManager</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                                placeholder="João da Silva"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Criando...
                            </>
                        ) : (
                            'Criar Conta'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Já tem uma conta? <Link href="/login" className="text-emerald-600 hover:underline">Faça Login</Link>
                </div>
            </div>
        </div>
    )
}

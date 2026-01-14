'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Loader2, MessageSquare } from 'lucide-react'

export function MoradorActions({ id, nome }: { id: string, nome: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        const confirmed = window.confirm(`Tem certeza que deseja excluir o morador "${nome}"?`)
        if (!confirmed) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('moradores')
                .delete()
                .eq('id', id)

            if (error) {
                throw error
            }

            router.refresh()
        } catch (err: any) {
            alert('Erro ao excluir: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
            {/* Placeholder for future WhatsApp/Email integration */}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" title="Gerar Cobrança (Em breve)">
                <MessageSquare className="h-4 w-4" />
            </Button>

            <Link href={`/moradores/${id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </Link>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
        </div>
    )
}

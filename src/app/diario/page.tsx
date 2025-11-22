'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DiarioPage() {
  const [sentimentos, setSentimentos] = useState('')
  const [gatilhos, setGatilhos] = useState('')
  const [sintomas, setSintomas] = useState('')
  const [recaida, setRecaida] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('diario')
        .insert([
          {
            sentimentos,
            gatilhos,
            sintomas,
            recaida
          }
        ])

      if (error) throw error

      router.push('/')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registro Diário</h1>
          <p className="text-gray-600">Como você se sentiu hoje?</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sentimentos
            </label>
            <textarea
              value={sentimentos}
              onChange={(e) => setSentimentos(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Descreva como você se sentiu hoje..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gatilhos
            </label>
            <textarea
              value={gatilhos}
              onChange={(e) => setGatilhos(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Quais foram os gatilhos que você enfrentou?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sintomas
            </label>
            <textarea
              value={sintomas}
              onChange={(e) => setSintomas(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Quais sintomas você percebeu?"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recaida"
              checked={recaida}
              onChange={(e) => setRecaida(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="recaida" className="ml-2 block text-sm text-gray-900">
              Houve recaída hoje?
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Registro'}
          </button>
        </form>
      </div>
    </div>
  )
}
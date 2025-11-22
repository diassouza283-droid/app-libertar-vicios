import Link from 'next/link'
import { Calendar, BookOpen, TrendingUp, List } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reboot: Desenvolvimento Pessoal</h1>
          <p className="text-gray-600">Acompanhamento diário para sua jornada de recuperação</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/diario" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Registro Diário</h3>
            <p className="text-sm text-gray-600">Anote seus sentimentos e gatilhos</p>
          </Link>

          <Link href="/progresso" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Progresso</h3>
            <p className="text-sm text-gray-600">Veja sua evolução</p>
          </Link>

          <Link href="/sintomas" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <List className="w-8 h-8 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Sintomas</h3>
            <p className="text-sm text-gray-600">Anotações de comportamentos</p>
          </Link>

          <Link href="/resumo" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Resumo Semanal</h3>
            <p className="text-sm text-gray-600">Análise semanal</p>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Seu Progresso Atual</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">0</div>
            <p className="text-gray-600">dias sem recaída</p>
          </div>
        </div>
      </div>
    </div>
  )
}

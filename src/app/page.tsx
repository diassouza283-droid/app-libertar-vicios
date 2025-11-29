'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, TrendingUp, Brain, Target, Flame, Award, Activity, Heart, Plus, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'

// Tipos
interface DailyEntry {
  id: string
  date: string
  mood: number
  urges: number
  triggers: string[]
  notes: string
  activities: string[]
}

interface UserStats {
  startDate: string
  currentStreak: number
  longestStreak: number
  totalDays: number
  entries: DailyEntry[]
}

export default function Home() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [showQuickEntry, setShowQuickEntry] = useState(false)
  const [todayMood, setTodayMood] = useState<number | null>(null)
  const [todayUrges, setTodayUrges] = useState<number>(0)
  const [quickNotes, setQuickNotes] = useState('')

  // Carregar dados do localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('reboot-stats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    } else {
      // Inicializar dados
      const initialStats: UserStats = {
        startDate: new Date().toISOString(),
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        entries: []
      }
      setStats(initialStats)
      localStorage.setItem('reboot-stats', JSON.stringify(initialStats))
    }
  }, []) // Array vazio - executa apenas uma vez na montagem

  // Verificar se já tem entrada hoje
  const getTodayEntry = () => {
    if (!stats) return null
    const today = new Date().toISOString().split('T')[0]
    return stats.entries.find(entry => entry.date === today)
  }

  // Salvar entrada rápida
  const saveQuickEntry = () => {
    if (!stats || todayMood === null) return

    const today = new Date().toISOString().split('T')[0]
    const existingEntry = getTodayEntry()

    const newEntry: DailyEntry = {
      id: existingEntry?.id || Date.now().toString(),
      date: today,
      mood: todayMood,
      urges: todayUrges,
      triggers: [],
      notes: quickNotes,
      activities: []
    }

    let updatedEntries = [...stats.entries]
    if (existingEntry) {
      updatedEntries = updatedEntries.map(e => e.id === existingEntry.id ? newEntry : e)
    } else {
      updatedEntries.push(newEntry)
    }

    // Calcular streak
    const sortedEntries = updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let currentStreak = 0
    let checkDate = new Date()
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
      const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === currentStreak) {
        currentStreak++
      } else {
        break
      }
    }

    const updatedStats: UserStats = {
      ...stats,
      entries: updatedEntries,
      currentStreak,
      longestStreak: Math.max(stats.longestStreak, currentStreak),
      totalDays: updatedEntries.length
    }

    setStats(updatedStats)
    localStorage.setItem('reboot-stats', JSON.stringify(updatedStats))
    setShowQuickEntry(false)
    setTodayMood(null)
    setTodayUrges(0)
    setQuickNotes('')
  }

  // Calcular progresso semanal
  const getWeeklyProgress = () => {
    if (!stats) return Array(7).fill(false)
    
    const today = new Date()
    const weekProgress = Array(7).fill(false)
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      const hasEntry = stats.entries.some(entry => entry.date === dateStr)
      weekProgress[6 - i] = hasEntry
    }
    
    return weekProgress
  }

  // Calcular média de humor
  const getAverageMood = () => {
    if (!stats || stats.entries.length === 0) return null
    
    const recentEntries = stats.entries.slice(-7)
    const avgMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length
    
    return Math.round(avgMood)
  }

  // Obter emoji de humor
  const getMoodEmoji = (mood: number | null) => {
    if (mood === null) return '😐'
    if (mood >= 4) return '😊'
    if (mood >= 3) return '😐'
    if (mood >= 2) return '😔'
    if (mood >= 1) return '😢'
    return '😰'
  }

  // Mensagens motivacionais baseadas no progresso
  const getMotivationalMessage = () => {
    if (!stats) return "Comece sua jornada hoje!"
    
    if (stats.currentStreak === 0) {
      return "Hoje é o primeiro dia do resto da sua vida. Você consegue!"
    } else if (stats.currentStreak < 7) {
      return `${stats.currentStreak} dias! Continue firme, cada dia é uma vitória.`
    } else if (stats.currentStreak < 30) {
      return `${stats.currentStreak} dias! Você está construindo hábitos incríveis.`
    } else if (stats.currentStreak < 90) {
      return `${stats.currentStreak} dias! Sua transformação é inspiradora!`
    } else {
      return `${stats.currentStreak} dias! Você é um exemplo de determinação!`
    }
  }

  const todayEntry = getTodayEntry()
  const weeklyProgress = getWeeklyProgress()
  const averageMood = getAverageMood()
  const weeklyCount = weeklyProgress.filter(Boolean).length

  if (!stats) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Reboot</h1>
                <p className="text-xs text-gray-600">Desenvolvimento Pessoal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{stats.currentStreak}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {todayEntry ? 'Ótimo trabalho hoje!' : 'Bem-vindo de volta!'}
              </h2>
              <p className="text-lg text-white/90 mb-4">{getMotivationalMessage()}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <div className="text-3xl font-bold">{stats.currentStreak}</div>
                  <div className="text-sm text-white/80">dias limpo</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <div className="text-3xl font-bold">{stats.totalDays}</div>
                  <div className="text-sm text-white/80">total de registros</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <div className="text-3xl font-bold">{stats.longestStreak}</div>
                  <div className="text-sm text-white/80">recorde pessoal</div>
                </div>
              </div>
            </div>
            <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center relative">
              <Target className="w-24 h-24 text-white" />
              {stats.currentStreak > 0 && (
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Entry Button */}
        {!todayEntry && (
          <div className="mb-8">
            <button
              onClick={() => setShowQuickEntry(!showQuickEntry)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg"
            >
              <Plus className="w-6 h-6" />
              Registrar Hoje
            </button>
          </div>
        )}

        {/* Quick Entry Form */}
        {showQuickEntry && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border-2 border-orange-200">
            <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Como foi seu dia?
            </h3>
            
            <div className="space-y-6">
              {/* Mood Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Como você está se sentindo? *
                </label>
                <div className="flex gap-3 justify-between">
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setTodayMood(mood)}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        todayMood === mood
                          ? 'border-orange-500 bg-orange-50 scale-110'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-3xl mb-1">{getMoodEmoji(mood)}</div>
                      <div className="text-xs text-gray-600">
                        {mood === 5 ? 'Ótimo' : mood === 4 ? 'Bom' : mood === 3 ? 'Ok' : mood === 2 ? 'Ruim' : 'Difícil'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Urges Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nível de impulsos hoje: {todayUrges}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={todayUrges}
                  onChange={(e) => setTodayUrges(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Nenhum</span>
                  <span>Moderado</span>
                  <span>Intenso</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas do dia (opcional)
                </label>
                <textarea
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  placeholder="Como foi seu dia? O que você aprendeu?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={saveQuickEntry}
                  disabled={todayMood === null}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl py-3 font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar Registro
                </button>
                <button
                  onClick={() => setShowQuickEntry(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Today's Status */}
        {todayEntry && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-900 mb-1">Registro de hoje completo!</h3>
              <p className="text-sm text-green-700">
                Humor: {getMoodEmoji(todayEntry.mood)} | Impulsos: {todayEntry.urges}/10
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Sequência Atual</h3>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-4xl font-bold text-orange-500 mb-2">{stats.currentStreak} dias</div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-amber-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((stats.currentStreak / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {stats.currentStreak === 0 ? 'Comece hoje!' : 
               stats.currentStreak < 7 ? 'Continue assim!' :
               stats.currentStreak < 30 ? 'Você está indo muito bem!' :
               'Incrível! Continue firme!'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Atividade Semanal</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-green-500 mb-2">{weeklyCount}/7</div>
            <div className="flex gap-1 mb-2">
              {weeklyProgress.map((hasEntry, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-8 rounded transition-all ${
                    hasEntry ? 'bg-green-500' : 'bg-gray-100'
                  }`}
                  title={hasEntry ? 'Registrado' : 'Sem registro'}
                ></div>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              {weeklyCount === 7 ? 'Semana perfeita! 🎉' : 
               weeklyCount >= 5 ? 'Quase lá!' :
               weeklyCount >= 3 ? 'Continue registrando!' :
               'Registre mais dias esta semana'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bem-estar Médio</h3>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <div className="text-4xl font-bold text-pink-500 mb-2">
              {averageMood !== null ? getMoodEmoji(averageMood) : '--'}
            </div>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((mood) => (
                <div
                  key={mood}
                  className={`text-2xl transition-opacity ${
                    averageMood === mood ? 'opacity-100' : 'opacity-20'
                  }`}
                >
                  {getMoodEmoji(mood)}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              {averageMood === null ? 'Comece a registrar' :
               averageMood >= 4 ? 'Você está bem!' :
               averageMood >= 3 ? 'Continue cuidando de você' :
               'Seja gentil consigo mesmo'}
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/diario" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Registro Diário</h3>
              <p className="text-sm text-gray-600">Anote seus sentimentos e gatilhos do dia</p>
            </div>
          </Link>

          <Link href="/progresso" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Progresso</h3>
              <p className="text-sm text-gray-600">Acompanhe sua evolução ao longo do tempo</p>
            </div>
          </Link>

          <Link href="/sintomas" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Sintomas</h3>
              <p className="text-sm text-gray-600">Monitore comportamentos e padrões</p>
            </div>
          </Link>

          <Link href="/resumo" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-200 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Resumo Semanal</h3>
              <p className="text-sm text-gray-600">Análise completa da sua semana</p>
            </div>
          </Link>
        </div>

        {/* Achievements Section */}
        {stats.currentStreak >= 7 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-1">Conquista Desbloqueada! 🎉</h3>
                <p className="text-white/90">
                  {stats.currentStreak >= 90 ? 'Mestre da Transformação - 90 dias!' :
                   stats.currentStreak >= 30 ? 'Guerreiro Resiliente - 30 dias!' :
                   stats.currentStreak >= 7 ? 'Primeira Semana Completa!' : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Daily Motivation */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-orange-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Motivação do Dia</h3>
              <p className="text-gray-700 leading-relaxed">
                "Cada dia é uma nova oportunidade para crescer e se tornar a melhor versão de si mesmo. 
                Você não está sozinho nessa jornada. Continue firme, um passo de cada vez."
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                  #força
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                  #transformação
                </span>
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                  #progresso
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  #você-consegue
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Support */}
        {todayEntry && todayEntry.urges >= 7 && (
          <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2 text-lg">Momento Difícil?</h3>
                <p className="text-red-700 mb-4">
                  Percebemos que você está enfrentando impulsos intensos. Lembre-se: isso é temporário e você é mais forte do que pensa.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all">
                    Técnicas de Respiração
                  </button>
                  <button className="px-4 py-2 bg-white text-red-700 border-2 border-red-300 rounded-lg font-medium hover:bg-red-50 transition-all">
                    Distrações Saudáveis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 md:hidden">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <Link href="/" className="flex flex-col items-center gap-1 text-orange-500">
            <Flame className="w-6 h-6" />
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link href="/diario" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Diário</span>
          </Link>
          <Link href="/progresso" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Progresso</span>
          </Link>
          <Link href="/resumo" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <Award className="w-6 h-6" />
            <span className="text-xs font-medium">Resumo</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Flame, Sparkles } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se usuário já está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/')
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Criar perfil do usuário se não existir
        createUserProfile(session.user.id, session.user.email!)
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const createUserProfile = async (userId: string, email: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        email: email,
        start_date: new Date().toISOString(),
        current_streak: 0,
        longest_streak: 0,
        total_days: 0,
      }, {
        onConflict: 'id'
      })

    if (error) {
      console.error('Erro ao criar perfil:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Flame className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reboot</h1>
          <p className="text-gray-600 text-lg">Desenvolvimento Pessoal</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-100">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500" />
              Comece sua jornada
            </h2>
            <p className="text-gray-600">
              Entre ou crie sua conta para começar sua transformação
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#f97316',
                    brandAccent: '#ea580c',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'white',
                    defaultButtonBackgroundHover: '#f9fafb',
                    defaultButtonBorder: '#e5e7eb',
                    defaultButtonText: '#374151',
                    dividerBackground: '#e5e7eb',
                    inputBackground: 'white',
                    inputBorder: '#e5e7eb',
                    inputBorderHover: '#f97316',
                    inputBorderFocus: '#f97316',
                    inputText: '#1f2937',
                    inputLabelText: '#374151',
                    inputPlaceholder: '#9ca3af',
                  },
                  space: {
                    buttonPadding: '12px 16px',
                    inputPadding: '12px 16px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '2px',
                    inputBorderWidth: '2px',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button font-semibold',
                input: 'auth-input',
                label: 'auth-label font-medium',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Sua senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Crie uma senha forte',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Cadastrar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                  confirmation_text: 'Verifique seu email para confirmar',
                },
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando...',
                  link_text: 'Esqueceu sua senha?',
                  confirmation_text: 'Verifique seu email para redefinir a senha',
                },
                update_password: {
                  password_label: 'Nova senha',
                  password_input_placeholder: 'Sua nova senha',
                  button_label: 'Atualizar senha',
                  loading_button_label: 'Atualizando...',
                  confirmation_text: 'Sua senha foi atualizada',
                },
                verify_otp: {
                  email_input_label: 'Email',
                  email_input_placeholder: 'seu@email.com',
                  phone_input_label: 'Telefone',
                  phone_input_placeholder: 'Seu número de telefone',
                  token_input_label: 'Código',
                  token_input_placeholder: 'Seu código OTP',
                  button_label: 'Verificar',
                  loading_button_label: 'Verificando...',
                },
              },
            }}
            providers={[]}
            redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Ao criar uma conta, você concorda com nossos{' '}
            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
              Política de Privacidade
            </a>
          </p>
        </div>

        {/* Motivational Message */}
        <div className="mt-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-center font-medium">
            "A jornada de mil milhas começa com um único passo. Você está prestes a dar o seu."
          </p>
        </div>
      </div>
    </div>
  )
}

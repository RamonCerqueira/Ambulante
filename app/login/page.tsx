/**
 * Página de Login
 * Formulário para usuários existentes fazerem login
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, setLoading, setError } = useAuthStore();

  // Estados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState('');

  /**
   * Manipular envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Fazer requisição de login
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      // Salvar no store
      setUser(user);
      setToken(token);

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao fazer login';
      setErrorMessage(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light to-white flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiLock className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-dark mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-600">Faça login para continuar</p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de Email */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  required
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Senha</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  required
                />
              </div>
            </div>

            {/* Link de recuperação de senha */}
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:text-primary-dark transition">
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
              {!isLoading && <FiArrowRight />}
            </button>
          </form>

          {/* Divisor */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Link para registro */}
          <p className="text-center text-gray-600">
            Não tem conta?{' '}
            <Link href="/register" className="text-primary font-semibold hover:text-primary-dark transition">
              Cadastre-se aqui
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 Street Vendor Connect. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
}


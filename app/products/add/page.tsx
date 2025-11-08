/**
 * Página de Adicionar Produto
 * Permite que vendedores adicionem novos produtos
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiDollarSign, FiFileText, FiTag, FiBox, FiSave } from 'react-icons/fi';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

export default function AddProductPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }

    // Verificar se é vendedor
    if (user?.role !== 'VENDOR') {
      router.push('/dashboard');
    }
  }, [token, user, router]);

  /**
   * Manipular mudanças no formulário
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Manipular envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar campos obrigatórios
      if (!formData.name || !formData.price) {
        setError('Nome e preço são obrigatórios');
        setIsLoading(false);
        return;
      }

      // Fazer requisição de criação
      await apiClient.post('/api/products', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        image: formData.image,
      });

      setSuccess('Produto adicionado com sucesso!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao adicionar produto';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-light rounded-lg transition"
          >
            <FiArrowLeft className="text-2xl text-dark" />
          </button>
          <h1 className="text-2xl font-bold text-dark">Adicionar Produto</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          className="bg-white rounded-xl shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Mensagens de Erro/Sucesso */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {success}
            </motion.div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de Nome */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Nome do Produto *
              </label>
              <div className="relative">
                <FiPackage className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Pastel de Carne"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  required
                />
              </div>
            </div>

            {/* Campo de Descrição */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Descrição</label>
              <div className="relative">
                <FiFileText className="absolute left-3 top-3 text-gray-400 text-lg" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva seu produto em detalhes"
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* Preço e Categoria */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Campo de Preço */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Preço (R$) *</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-3 text-gray-400 text-lg" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                    required
                  />
                </div>
              </div>

              {/* Campo de Categoria */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Categoria</label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-3 text-gray-400 text-lg" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition appearance-none"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="alimentos">Alimentos</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="doces">Doces</option>
                    <option value="lanches">Lanches</option>
                    <option value="refeicoes">Refeições</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estoque */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Estoque</label>
              <div className="relative">
                <FiBox className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Quantidade em estoque"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* URL da Imagem */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">URL da Imagem</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              <p className="text-xs text-gray-500 mt-1">Deixe em branco para usar imagem padrão</p>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Adicionando...' : 'Adicionar Produto'}
                {!isLoading && <FiSave />}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}


/**
 * Página inicial - Landing Page
 * Apresenta a plataforma com seções interativas
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiShoppingCart, FiTrendingUp, FiUsers, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para mostrar header fixo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <FiMapPin className="text-white text-xl" />
            </div>
            <span className="font-bold text-xl text-dark">Street Vendor</span>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-dark hover:text-primary transition">
              Funcionalidades
            </a>
            <a href="#how-it-works" className="text-dark hover:text-primary transition">
              Como Funciona
            </a>
            <a href="#stats" className="text-dark hover:text-primary transition">
              Estatísticas
            </a>
          </nav>

          {/* Botões */}
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-primary font-semibold hover:text-primary-dark transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-light to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Conteúdo */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl font-bold text-dark mb-6 leading-tight">
                Conecte-se com <span className="text-primary">Clientes Próximos</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Plataforma revolucionária que conecta comerciantes ambulantes com clientes em tempo real através de geolocalização.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
                >
                  Começar Agora <FiArrowRight />
                </Link>
                <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition">
                  Saiba Mais
                </button>
              </div>
            </motion.div>

            {/* Ilustração */}
            <motion.div
              variants={itemVariants}
              className="relative h-96 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl flex items-center justify-center"
            >
              <div className="text-white text-center">
                <FiMapPin className="text-6xl mx-auto mb-4" />
                <p className="text-xl font-semibold">Geolocalização em Tempo Real</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-dark mb-4">Funcionalidades Principais</h2>
            <p className="text-xl text-gray-600">Tudo que você precisa para gerenciar seu negócio ambulante</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-light rounded-xl hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <FiMapPin className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Geolocalização</h3>
              <p className="text-gray-600">Encontre clientes em um raio de 5km ao seu redor</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-light rounded-xl hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <FiShoppingCart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Gerenciamento de Pedidos</h3>
              <p className="text-gray-600">Controle todos os seus pedidos em um único lugar</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-light rounded-xl hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Comunicação Direta</h3>
              <p className="text-gray-600">Chat integrado para conversar com clientes</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={itemVariants}
              className="p-6 bg-light rounded-xl hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <FiTrendingUp className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Análise de Vendas</h3>
              <p className="text-gray-600">Acompanhe suas vendas e desempenho em tempo real</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-dark mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600">4 passos simples para começar</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { num: 1, title: 'Cadastre-se', desc: 'Crie sua conta como cliente ou vendedor' },
              { num: 2, title: 'Localize', desc: 'Encontre vendedores próximos a você' },
              { num: 3, title: 'Peça', desc: 'Faça seu pedido e acompanhe em tempo real' },
              { num: 4, title: 'Receba', desc: 'Receba seu pedido na localização desejada' },
            ].map((step) => (
              <motion.div key={step.num} variants={itemVariants} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-3 gap-8 text-white text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { num: '50K+', label: 'Ambulantes' },
              { num: '500K+', label: 'Clientes Ativos' },
              { num: '1M+', label: 'Pedidos Realizados' },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <h3 className="text-5xl font-bold mb-2">{stat.num}</h3>
                <p className="text-xl">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-dark mb-6">Pronto para Começar?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Junte-se a milhares de vendedores e clientes que já usam o Street Vendor Connect
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Cadastre-se Gratuitamente
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Street Vendor Connect</h4>
              <p className="text-gray-400">Conectando comerciantes ambulantes com clientes</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Redes Sociais</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Street Vendor Connect. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


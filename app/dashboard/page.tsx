/**
 * Página de Dashboard
 * Painel principal para clientes e vendedores
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiEdit,
  FiMapPin,
  FiMessageCircle,
  FiArrowRight,
} from 'react-icons/fi';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  vendor?: {
    businessName: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (user?.role === 'VENDOR') {
          // Carregar produtos do vendedor
          const productsRes = await apiClient.get('/api/products');
          setProducts(productsRes.data);
        }

        // Carregar pedidos
        const ordersRes = await apiClient.get('/api/orders');
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
            <p className="text-sm text-gray-600">Bem-vindo, {user.name}!</p>
          </div>

          <button
            onClick={handleLogout}
            className="p-3 hover:bg-light rounded-lg transition text-gray-600 hover:text-red-600"
            title="Sair"
          >
            <FiLogOut className="text-2xl" />
          </button>
        </div>
      </header>

      {/* Abas */}
      <nav className="bg-white border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4 flex gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-2 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-primary border-primary'
                : 'text-gray-600 border-transparent hover:text-dark'
            }`}
          >
            <FiHome className="inline mr-2" /> Visão Geral
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-2 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-primary border-primary'
                : 'text-gray-600 border-transparent hover:text-dark'
            }`}
          >
            <FiShoppingCart className="inline mr-2" /> Pedidos
          </button>

          {user.role === 'VENDOR' && (
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'products'
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-transparent hover:text-dark'
              }`}
            >
              <FiPackage className="inline mr-2" /> Produtos
            </button>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-2 font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-primary border-primary'
                : 'text-gray-600 border-transparent hover:text-dark'
            }`}
          >
            <FiSettings className="inline mr-2" /> Configurações
          </button>
        </div>
      </nav>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Carregando...</p>
          </div>
        ) : (
          <>
            {/* Visão Geral */}
            {activeTab === 'overview' && (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Card de Perfil */}
                <motion.div
                  className="bg-white rounded-xl shadow-md p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">{user.name}</h3>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 text-sm"
                  >
                    <FiEdit size={16} /> Editar Perfil
                  </button>
                </motion.div>

                {/* Card de Localização */}
                <motion.div
                  className="bg-white rounded-xl shadow-md p-6"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                    <FiMapPin className="text-primary" /> Localização
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {user.address || 'Endereço não configurado'}
                  </p>
                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="w-full py-2 bg-light text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition text-sm"
                  >
                    Atualizar
                  </button>
                </motion.div>

                {/* Card de Pedidos */}
                <motion.div
                  className="bg-white rounded-xl shadow-md p-6"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                    <FiShoppingCart className="text-primary" /> Pedidos
                  </h3>
                  <p className="text-3xl font-bold text-primary mb-4">{orders.length}</p>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full py-2 bg-light text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition text-sm"
                  >
                    Ver Pedidos
                  </button>
                </motion.div>

                {/* Card de Ação */}
                <motion.div
                  className="bg-white rounded-xl shadow-md p-6"
                  whileHover={{ y: -5 }}
                >
                  {user.role === 'VENDOR' ? (
                    <>
                      <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                        <FiPackage className="text-primary" /> Produtos
                      </h3>
                      <p className="text-3xl font-bold text-primary mb-4">{products.length}</p>
                      <button
                        onClick={() => router.push('/products/add')}
                        className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 text-sm"
                      >
                        <FiPlus size={16} /> Novo Produto
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                        <FiMapPin className="text-primary" /> Explorar
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">Encontre vendedores próximos</p>
                      <button
                        onClick={() => router.push('/find-vendors')}
                        className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 text-sm"
                      >
                        <FiMapPin size={16} /> Buscar Vendedores
                      </button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Pedidos */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-dark mb-6">Meus Pedidos</h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <FiShoppingCart className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Nenhum pedido ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                        onClick={() => router.push(`/chat/${order.id}`)}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-dark">Pedido #{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-gray-600">
                              {order.vendor?.businessName || 'Vendedor'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">R$ {order.total.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">{order.status}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Produtos (apenas para vendedores) */}
            {activeTab === 'products' && user.role === 'VENDOR' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-dark">Meus Produtos</h2>
                  <button
                    onClick={() => router.push('/products/add')}
                    className="py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
                  >
                    <FiPlus /> Novo Produto
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <FiPackage className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Nenhum produto cadastrado</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                        whileHover={{ y: -5 }}
                      >
                        <h3 className="font-bold text-dark mb-2">{product.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-2">
                          R$ {product.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          Estoque: {product.stock} un.
                        </p>
                        <button
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                          className="w-full py-2 bg-light text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition text-sm"
                        >
                          Editar
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Configurações */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-dark mb-6">Configurações</h2>
                <div className="space-y-4">
                  <motion.button
                    onClick={() => router.push('/profile/edit')}
                    className="w-full bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition flex justify-between items-center"
                    whileHover={{ x: 5 }}
                  >
                    <div>
                      <h3 className="font-bold text-dark">Editar Perfil</h3>
                      <p className="text-sm text-gray-600">Atualize suas informações pessoais</p>
                    </div>
                    <FiEdit className="text-primary text-xl" />
                  </motion.button>

                  <motion.button
                    onClick={() => router.push('/profile/edit')}
                    className="w-full bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition flex justify-between items-center"
                    whileHover={{ x: 5 }}
                  >
                    <div>
                      <h3 className="font-bold text-dark">Localização</h3>
                      <p className="text-sm text-gray-600">Atualize sua localização</p>
                    </div>
                    <FiMapPin className="text-primary text-xl" />
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    className="w-full bg-red-50 rounded-xl shadow-md p-6 text-left hover:shadow-lg transition flex justify-between items-center"
                    whileHover={{ x: 5 }}
                  >
                    <div>
                      <h3 className="font-bold text-red-600">Sair</h3>
                      <p className="text-sm text-red-500">Desconectar da sua conta</p>
                    </div>
                    <FiLogOut className="text-red-600 text-xl" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}


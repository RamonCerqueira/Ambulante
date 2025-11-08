/**
 * Página de Detalhes do Vendedor
 * Exibe informações completas do vendedor e seus produtos
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiStar,
  FiMapPin,
  FiPhone,
  FiShoppingCart,
  FiMessageCircle,
} from 'react-icons/fi';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
}

interface Vendor {
  id: string;
  businessName: string;
  description?: string;
  rating: number;
  latitude: number;
  longitude: number;
  distance: number;
  user: {
    name: string;
    avatar?: string;
    phone?: string;
  };
  products: Product[];
  _count: {
    reviews: number;
  };
}

export default function VendorPage() {
  const router = useRouter();
  const params = useParams();
  const { user, token } = useAuthStore();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  // Carregar dados do vendedor
  useEffect(() => {
    const loadVendor = async () => {
      try {
        // Aqui você faria uma chamada à API para obter os dados do vendedor
        // Por enquanto, vamos usar dados mockados
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar vendedor:', error);
        setIsLoading(false);
      }
    };

    loadVendor();
  }, [params.id]);

  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const handleCheckout = async () => {
    const items = Object.entries(cart).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    try {
      await apiClient.post('/api/orders', {
        vendorId: params.id,
        items,
        deliveryAddress: user?.address || '',
        deliveryLatitude: user?.latitude,
        deliveryLongitude: user?.longitude,
      });

      router.push('/dashboard?tab=orders');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
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
          <h1 className="text-2xl font-bold text-dark">Detalhes do Vendedor</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Carregando informações...</p>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          {/* Informações do Vendedor */}
          <motion.div
            className="bg-white rounded-xl shadow-md p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Avatar e Info Básica */}
              <div className="md:col-span-1">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <FiMapPin className="text-white text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-dark text-center mb-2">
                  Vendedor Name
                </h2>
                <div className="flex justify-center items-center gap-1 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="fill-current" size={16} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(12 avaliações)</span>
                </div>
              </div>

              {/* Descrição e Contato */}
              <div className="md:col-span-2">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Descrição do vendedor aqui. Venda de produtos variados com qualidade garantida.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-primary text-xl" />
                    <span className="text-gray-700">3.5km de distância</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-primary text-xl" />
                    <span className="text-gray-700">(71) 99999-9999</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2">
                    <FiShoppingCart /> Fazer Pedido
                  </button>
                  <button className="flex-1 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition flex items-center justify-center gap-2">
                    <FiMessageCircle /> Chat
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Produtos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-dark mb-6">Produtos Disponíveis</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Exemplo de Produtos */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                  whileHover={{ y: -5 }}
                >
                  <div className="h-40 bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <FiShoppingCart className="text-white text-4xl" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-dark mb-2">Produto {i}</h4>
                    <p className="text-sm text-gray-600 mb-3">Descrição do produto aqui</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(25.99 * i)}
                      </span>
                      <span className="text-xs text-gray-600">Em estoque</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(`product-${i}`)}
                        className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-sm"
                      >
                        + Carrinho
                      </button>
                      {cart[`product-${i}`] && (
                        <button
                          onClick={() => handleRemoveFromCart(`product-${i}`)}
                          className="px-3 py-2 bg-light text-dark rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                        >
                          {cart[`product-${i}`]}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Carrinho Flutuante */}
          {Object.keys(cart).length > 0 && (
            <motion.div
              className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-6 max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-lg font-bold text-dark mb-4">Seu Carrinho</h4>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {Object.entries(cart).map(([productId, quantity]) => (
                  <div key={productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">Produto × {quantity}</span>
                    <span className="font-semibold text-dark">
                      {formatCurrency(25.99 * quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">
                    {formatCurrency(
                      Object.entries(cart).reduce(
                        (sum, [, qty]) => sum + 25.99 * qty,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Finalizar Pedido
              </button>
            </motion.div>
          )}
        </main>
      )}
    </div>
  );
}


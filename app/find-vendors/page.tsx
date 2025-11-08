/**
 * Página de Encontrar Vendedores
 * Exibe vendedores próximos em mapa interativo e cards
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMapPin, FiList, FiMap, FiStar, FiArrowRight, FiX, FiNavigation, FiAlertCircle } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { useGeolocation } from '@/lib/useGeolocation';

// Importar mapa dinamicamente para evitar erros de SSR
const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

interface Vendor {
  id: string;
  businessName: string;
  description: string;
  rating: number;
  latitude: number;
  longitude: number;
  distance: number;
  user: {
    name: string;
    avatar?: string;
    phone?: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    image?: string;
  }>;
  _count: {
    reviews: number;
  };
}

export default function FindVendorsPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('cards');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(5);
  const { location, error: geoError, getLocation, startWatching, stopWatching, isWatching } = useGeolocation();

  // Verificar autenticação
  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  // Obter localização do usuário
  useEffect(() => {
    const initLocation = async () => {
      try {
        const loc = await getLocation();
        setUserLocation({
          lat: loc.latitude,
          lng: loc.longitude,
        });
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        // Usar localização padrão (Salvador)
        setUserLocation({
          lat: -12.9714,
          lng: -38.5104,
        });
      }
    };

    initLocation();
  }, [getLocation]);

  // Carregar vendedores próximos
  useEffect(() => {
    const loadVendors = async () => {
      if (!userLocation) return;

      setIsLoading(true);
      try {
        const response = await apiClient.get('/api/users/vendors/nearby', {
          params: {
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            radiusKm: radius,
          },
        });
        setVendors(response.data.vendors);
      } catch (error) {
        console.error('Erro ao carregar vendedores:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, [userLocation, radius]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-light rounded-lg transition"
            >
              <FiX className="text-2xl text-dark" />
            </button>
            <h1 className="text-2xl font-bold text-dark">Encontrar Vendedores</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-3 rounded-lg transition ${
                viewMode === 'cards'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
              title="Visualização em cards"
            >
              <FiList className="text-xl" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-3 rounded-lg transition ${
                viewMode === 'map'
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
              title="Visualização em mapa"
            >
              <FiMap className="text-xl" />
            </button>
            <button
              onClick={() => isWatching ? stopWatching() : startWatching()}
              className={`p-3 rounded-lg transition ${
                isWatching
                  ? 'bg-green-500 text-white'
                  : 'bg-light text-dark hover:bg-gray-300'
              }`}
              title={isWatching ? 'Parar rastreamento' : 'Rastrear localização'}
            >
              <FiNavigation className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Controles */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4 space-y-3">
          {/* Mensagem de Erro de Geolocalização */}
          {geoError && (
            <motion.div
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FiAlertCircle className="text-lg" />
              <span className="text-sm">{geoError}</span>
            </motion.div>
          )}

          {/* Localização Atual */}
          {userLocation && (
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <FiMapPin className="text-primary" />
              <span>
                Localização: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
              {isWatching && <span className="text-green-600 font-semibold">● Rastreando</span>}
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm font-semibold text-dark">Raio:</span>
              <input
                type="range"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-32 h-2 bg-border rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-semibold text-primary min-w-12">{radius}km</span>
            </label>
            <div className="ml-auto text-sm text-gray-600">
              {vendors.length} vendedor{vendors.length !== 1 ? 'es' : ''} encontrado{vendors.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Carregando vendedores próximos...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <FiMapPin className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Nenhum vendedor encontrado neste raio</p>
            <button
              onClick={() => setRadius(radius + 5)}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Aumentar raio de busca
            </button>
          </div>
        ) : viewMode === 'map' ? (
          // Visualização em Mapa
          <motion.div
            className="h-96 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {userLocation && (
              <MapComponent
                userLocation={userLocation}
                vendors={vendors}
                selectedVendor={selectedVendor}
                onSelectVendor={setSelectedVendor}
              />
            )}
          </motion.div>
        ) : (
          // Visualização em Cards
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {vendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer group"
                onClick={() => setSelectedVendor(vendor)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                {/* Imagem do Vendedor */}
                <div className="h-40 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
                  {vendor.user.avatar ? (
                    <img
                      src={vendor.user.avatar}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiMapPin className="text-white text-4xl" />
                    </div>
                  )}

                  {/* Badge de Distância */}
                  <div className="absolute top-3 right-3 bg-white text-primary px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                    {vendor.distance.toFixed(1)}km
                  </div>
                </div>

                {/* Informações */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-dark mb-1">{vendor.businessName}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < Math.round(vendor.rating) ? 'fill-current' : ''}
                          size={16}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({vendor._count.reviews})</span>
                  </div>

                  {/* Produtos */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Produtos:</p>
                    <div className="space-y-1">
                      {vendor.products.slice(0, 2).map((product) => (
                        <div key={product.id} className="flex justify-between items-center text-xs">
                          <span className="text-dark truncate">{product.name}</span>
                          <span className="text-primary font-semibold">{formatCurrency(product.price)}</span>
                        </div>
                      ))}
                      {vendor.products.length > 2 && (
                        <p className="text-xs text-gray-500">+{vendor.products.length - 2} mais</p>
                      )}
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/vendor/${vendor.id}`);
                    }}
                    className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
                  >
                    Ver Loja <FiArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Modal de Detalhes do Vendedor */}
      {selectedVendor && viewMode === 'map' && (
        <motion.div
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white rounded-xl shadow-2xl p-6 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-dark">{selectedVendor.businessName}</h3>
            <button
              onClick={() => setSelectedVendor(null)}
              className="p-1 hover:bg-light rounded-lg transition"
            >
              <FiX className="text-xl text-dark" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-3">{selectedVendor.description}</p>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={i < Math.round(selectedVendor.rating) ? 'fill-current' : ''}
                  size={16}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({selectedVendor._count.reviews})</span>
          </div>

          <div className="mb-4 pb-4 border-b border-border">
            <p className="text-xs font-semibold text-gray-600 mb-2">Distância: {selectedVendor.distance.toFixed(1)}km</p>
            <p className="text-xs font-semibold text-gray-600">Contato: {selectedVendor.user.phone || 'N/A'}</p>
          </div>

          <button
            onClick={() => {
              router.push(`/vendor/${selectedVendor.id}`);
              setSelectedVendor(null);
            }}
            className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Acessar Loja
          </button>
        </motion.div>
      )}
    </div>
  );
}


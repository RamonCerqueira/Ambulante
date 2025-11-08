/**
 * Cliente HTTP para fazer requisições à API
 * Configurado com Axios e suporte a autenticação JWT
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from './store';

/**
 * Criar instância do Axios
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para adicionar token JWT em requisições
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obter token do store
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratar erros de resposta
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Se receber 401 (não autorizado), fazer logout
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Redirecionar para login se estiver no cliente
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;


/**
 * Página de Chat
 * Comunicação em tempo real entre vendedor e cliente
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSend, FiSmile, FiPaperclip } from 'react-icons/fi';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: string;
  isOwn?: boolean;
}

interface ChatData {
  orderId: string;
  messages: Message[];
  otherUserName: string;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { user, token } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [otherUserName, setOtherUserName] = useState('');

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  // Carregar mensagens
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // Aqui você faria uma chamada à API para obter as mensagens
        // Por enquanto, vamos usar dados mockados
        setMessages([
          {
            id: '1',
            content: 'Olá! Você tem o produto em estoque?',
            senderId: 'customer-1',
            senderName: 'Cliente',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isOwn: false,
          },
          {
            id: '2',
            content: 'Sim, tenho sim! Quantos você quer?',
            senderId: user?.id || 'vendor-1',
            senderName: user?.name || 'Vendedor',
            createdAt: new Date(Date.now() - 3300000).toISOString(),
            isOwn: true,
          },
          {
            id: '3',
            content: 'Gostaria de 3 unidades por favor',
            senderId: 'customer-1',
            senderName: 'Cliente',
            createdAt: new Date(Date.now() - 3000000).toISOString(),
            isOwn: false,
          },
          {
            id: '4',
            content: 'Perfeito! Vou preparar para você. Qual é seu endereço?',
            senderId: user?.id || 'vendor-1',
            senderName: user?.name || 'Vendedor',
            createdAt: new Date(Date.now() - 2700000).toISOString(),
            isOwn: true,
          },
        ]);
        setOtherUserName('Cliente');
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [params.orderId, user?.id]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Enviar mensagem
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    setIsSending(true);

    try {
      // Aqui você faria uma chamada à API para enviar a mensagem
      // Por enquanto, vamos adicionar localmente
      const newMessage: Message = {
        id: Date.now().toString(),
        content: messageInput,
        senderId: user?.id || '',
        senderName: user?.name || 'Você',
        createdAt: new Date().toISOString(),
        isOwn: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-light rounded-lg transition"
          >
            <FiArrowLeft className="text-2xl text-dark" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-dark">{otherUserName}</h1>
            <p className="text-xs text-gray-600">Pedido #{params.orderId}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Área de Mensagens */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Carregando mensagens...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <FiSmile className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma mensagem ainda. Comece a conversa!</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.isOwn
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white text-dark rounded-bl-none shadow-md'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isOwn ? 'text-primary-light' : 'text-gray-500'}`}>
                  {formatDate(message.createdAt)}
                </p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input de Mensagem */}
      <footer className="bg-white border-t border-border p-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <button
            type="button"
            className="p-3 hover:bg-light rounded-lg transition text-gray-600 hover:text-primary"
            title="Anexar arquivo"
          >
            <FiPaperclip className="text-xl" />
          </button>

          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />

          <button
            type="button"
            className="p-3 hover:bg-light rounded-lg transition text-gray-600 hover:text-primary"
            title="Emoji"
          >
            <FiSmile className="text-xl" />
          </button>

          <button
            type="submit"
            disabled={isSending || !messageInput.trim()}
            className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Enviar"
          >
            <FiSend className="text-xl" />
          </button>
        </form>
      </footer>
    </div>
  );
}


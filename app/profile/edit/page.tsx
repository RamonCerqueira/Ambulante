/**
 * Página de Editar Perfil
 * Permite que usuários editem suas informações pessoais
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
} from "react-icons/fi";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/lib/store";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, token, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    latitude: user?.latitude || 0,
    longitude: user?.longitude || 0,
  });

  useEffect(() => {
    if (!token || !user) {
      router.push("/login");
    }
  }, [token, user, router]);

  /**
   * Obter localização do usuário + endereço automaticamente
   */
  // const handleGetLocation = async () => {
  //   if (!navigator.geolocation) {
  //     setError("Geolocalização não é suportada neste navegador.");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError("");
  //   setSuccess("");

  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;

  //       try {
  //         // Busca o endereço baseado na latitude/longitude
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  //         );

  //         if (!response.ok) {
  //           throw new Error("Falha ao obter endereço a partir da localização.");
  //         }

  //         const data = await response.json();

  //         // Monta um endereço legível
  //         const formattedAddress = [
  //           data.address.road, // Nome da rua
  //           data.address.suburb, // Bairro
  //           data.address.city || data.address.town || data.address.village, // Cidade
  //           data.address.state, // Estado
  //           data.address.country, // País
  //         ]
  //           .filter(Boolean)
  //           .join(", ");
  //         // const formattedAddress =
  //         //   data.display_name ||
  //         //   `${data.address.road || ''}, ${data.address.suburb || ''}, ${
  //         //     data.address.city || data.address.town || data.address.village || ''
  //         //   }`;

  //         // Atualiza o estado
  //         setFormData((prev) => ({
  //           ...prev,
  //           latitude,
  //           longitude,
  //           address: formattedAddress.trim(),
  //         }));

  //         setSuccess("Localização e endereço obtidos com sucesso!");
  //         setTimeout(() => setSuccess(""), 4000);
  //       } catch (err: any) {
  //         console.error("Erro ao obter endereço:", err);
  //         setError("Não foi possível obter o endereço automaticamente.");
  //         setTimeout(() => setError(""), 4000);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     },
  //     (error) => {
  //       setIsLoading(false);
  //       setError("Erro ao obter localização: " + error.message);
  //       setTimeout(() => setError(""), 4000);
  //     }
  //   );
  // };
  /**
   * Obter localização e endereço automaticamente (usando LocationIQ)
   */
  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setError("Seu navegador não suporta geolocalização.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Chama API do LocationIQ
          const token = process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN;
          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          // Extrai o endereço com fallback se não tiver nome da rua
          const address =
            data?.address?.road ||
            data?.display_name ||
            "Endereço não encontrado";

          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            address,
          }));

          setSuccess("Localização atual obtida com sucesso!");
        } catch (err) {
          setError("Erro ao obter endereço via LocationIQ.");
          console.error(err);
        } finally {
          setIsLoading(false);
          setTimeout(() => setSuccess(""), 3000);
        }
      },
      (error) => {
        setError("Erro ao acessar GPS: " + error.message);
        setIsLoading(false);
        setTimeout(() => setError(""), 3000);
      }
    );
  };

  /**
   * Manipular mudanças no formulário
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      // Fazer requisição de atualização
      const response = await apiClient.patch("/api/users/me", formData);

      // Atualizar store
      setUser(response.data);

      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao atualizar perfil";
      setError(message);
    } finally {
      setIsSaving(false);
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
          <h1 className="text-2xl font-bold text-dark">Editar Perfil</h1>
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
                Nome Completo
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* Campo de Email (desabilitado) */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="email"
                  value={formData.email}
                  placeholder="seu@email.com"
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-light text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email não pode ser alterado
              </p>
            </div>

            {/* Campo de Telefone */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Telefone
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(71) 99999-9999"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* Campo de Endereço */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Endereço
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400 text-lg" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua, número, bairro, cidade"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* Localização */}
            <div className="bg-light p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-dark">Localização</h3>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  Obter Localização
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="0.0001"
                    placeholder="Ex: -12.9714"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="0.0001"
                    placeholder="Ex: -38.5104"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
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
                disabled={isSaving}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
                {!isSaving && <FiSave />}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

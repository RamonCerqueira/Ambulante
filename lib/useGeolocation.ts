/**
 * Hook customizado para geolocalização
 * Funciona em web, iOS e Android
 */

import { useState, useEffect, useCallback } from 'react';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

export interface GeolocationState {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
  isWatching: boolean;
}

/**
 * Hook para geolocalização
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: false,
    isWatching: false,
  });

  const [watchId, setWatchId] = useState<number | null>(null);

  /**
   * Obter localização uma vez
   */
  const getLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocalização não suportada neste dispositivo');
      }

      return new Promise<Location>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude || undefined,
              altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
              heading: position.coords.heading || undefined,
              speed: position.coords.speed || undefined,
              timestamp: position.timestamp,
            };

            setState((prev) => ({
              ...prev,
              location,
              isLoading: false,
            }));

            resolve(location);
          },
          (error) => {
            let errorMessage = 'Erro ao obter localização';

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Permissão de localização negada. Ative nas configurações do seu dispositivo.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Informação de localização não disponível';
                break;
              case error.TIMEOUT:
                errorMessage = 'Tempo limite excedido ao obter localização';
                break;
            }

            setState((prev) => ({
              ...prev,
              error: errorMessage,
              isLoading: false,
            }));

            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  /**
   * Monitorar localização em tempo real
   */
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocalização não suportada neste dispositivo',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isWatching: true, error: null }));

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
          timestamp: position.timestamp,
        };

        setState((prev) => ({
          ...prev,
          location,
        }));
      },
      (error) => {
        let errorMessage = 'Erro ao monitorar localização';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informação de localização não disponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite excedido';
            break;
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    setWatchId(id);
  }, []);

  /**
   * Parar de monitorar localização
   */
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setState((prev) => ({ ...prev, isWatching: false }));
    }
  }, [watchId]);

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Limpar localização
   */
  const clearLocation = useCallback(() => {
    setState((prev) => ({ ...prev, location: null }));
  }, []);

  /**
   * Limpar tudo
   */
  const reset = useCallback(() => {
    stopWatching();
    setState({
      location: null,
      error: null,
      isLoading: false,
      isWatching: false,
    });
  }, [stopWatching]);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    ...state,
    getLocation,
    startWatching,
    stopWatching,
    clearError,
    clearLocation,
    reset,
  };
}


/**
 * Mapa Interativo dos Vendedores
 * Compatível com Next.js + TypeScript + Leaflet
 */

'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vendor } from '@/types/vendor';

// ==================== Tipagem ====================


interface MapProps {
  userLocation: { lat: number; lng: number };
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  onSelectVendor: (vendor: Vendor | null) => void;
}

// ==================== Ícones personalizados ====================
const userIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iIzAwNEU4OSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const vendorIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMEM5IDAgMCA5IDAgMjBjMCAyMCAyMCAyMCAyMCAyMHMyMCAwIDIwLTIwYzAtMTEtOSAyMC0yMCAyMHoiIGZpbGw9IiNGRjZCMzUiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjE1IiByPSI2IiBmaWxsPSIjZmZmIi8+PC9zdmc+',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

const selectedVendorIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyNCIgZmlsbD0iI0ZGNkIzNSIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMTgiIHI9IjgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

// ==================== Componente Principal ====================
export default function Map({
  userLocation,
  vendors,
  selectedVendor,
  onSelectVendor,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  // Inicializar o mapa
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // marcador do usuário
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Sua localização</b>');

      mapRef.current = map;
    }
  }, [userLocation]);

  // Atualizar marcadores dinamicamente
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Limpa marcadores anteriores
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Adiciona novos marcadores
    vendors.forEach((vendor) => {
      const isSelected = selectedVendor?.id === vendor.id;

      const marker = L.marker([vendor.latitude, vendor.longitude], {
        icon: isSelected ? selectedVendorIcon : vendorIcon,
      }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="font-family: Inter, sans-serif;">
          <strong>${vendor.businessName}</strong><br/>
          <small>${vendor.distance.toFixed(1)} km de distância</small><br/>
          <button style="margin-top:8px;padding:6px 12px;background:#FF6B35;color:#fff;border:none;border-radius:6px;cursor:pointer;">
            Ver Detalhes
          </button>
        </div>
      `;

      const button = popupContent.querySelector('button');
      if (button) {
        button.addEventListener('click', () => onSelectVendor(vendor));
      }

      marker.bindPopup(popupContent);
      markersRef.current[vendor.id] = marker;

      if (isSelected) {
        marker.openPopup();
      }
    });

    // Ajusta o zoom para mostrar tudo
    if (vendors.length > 0) {
  const bounds = L.latLngBounds([
    [userLocation.lat, userLocation.lng] as [number, number],
    ...vendors.map((v) => [v.latitude, v.longitude] as [number, number]),
  ]);
  map.fitBounds(bounds, { padding: [50, 50] });
}
    // if (vendors.length > 0) {
    //   const bounds = L.latLngBounds([
    //     [userLocation.lat, userLocation.lng],
    //     ...vendors.map((v) => [v.latitude, v.longitude]),
    //   ]);
    //   map.fitBounds(bounds, { padding: [50, 50] });
    // }
  }, [vendors, selectedVendor, userLocation, onSelectVendor]);

  return (
    <div className="relative w-full h-full">
      <div id="map" className="absolute inset-0 rounded-xl overflow-hidden shadow-lg" />
    </div>
  );
}



// /**
//  * Componente de Mapa Interativo
//  * Exibe mapa com localização do usuário e vendedores próximos
//  */

// 'use client';

// import { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// interface Vendor {
//   id: string;
//   businessName: string;
//   latitude: number;
//   longitude: number;
//   distance: number;
//   user: {
//     name: string;
//   };
// }

// interface MapComponentProps {
//   userLocation: { lat: number; lng: number };
//   vendors: Vendor[];
//   selectedVendor: Vendor | null;
//   onSelectVendor: (vendor: Vendor) => void;
// }

// export default function MapComponent({
//   userLocation,
//   vendors,
//   selectedVendor,
//   onSelectVendor,
// }: MapComponentProps) {
//   const mapRef = useRef<L.Map | null>(null);
//   const markersRef = useRef<{ [key: string]: L.Marker }>({});

//   useEffect(() => {
//     // Inicializar mapa
//     if (!mapRef.current) {
//       mapRef.current = L.map('map').setView(
//         [userLocation.lat, userLocation.lng],
//         13
//       );

//       // Adicionar tile layer
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//         maxZoom: 19,
//       }).addTo(mapRef.current);

//       // Adicionar marcador do usuário
//       L.marker([userLocation.lat, userLocation.lng], {
//         icon: L.icon({
//           iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iIzAwNEU4OSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
//           iconSize: [32, 32],
//           iconAnchor: [16, 16],
//         }),
//       })
//         .addTo(mapRef.current)
//         .bindPopup('Sua localização');
//     }

//     // Limpar marcadores anteriores
//     Object.values(markersRef.current).forEach((marker) => marker.remove());
//     markersRef.current = {};

//     // Adicionar marcadores dos vendedores
//     vendors.forEach((vendor) => {
//       const isSelected = selectedVendor?.id === vendor.id;
//       const marker = L.marker([vendor.latitude, vendor.longitude], {
//         icon: L.icon({
//           iconUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMEM5IDAgMCA5IDAgMjBjMCAyMCAyMCAyMCAyMCAyMHMyMCAwIDIwLTIwYzAtMTEtOSAyMC0yMCAyMHoiIGZpbGw9IiNGRjZCMzUiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjE1IiByPSI2IiBmaWxsPSIjZmZmIi8+PC9zdmc+`,
//           iconSize: isSelected ? [48, 48] : [40, 40],
//           iconAnchor: isSelected ? [24, 48] : [20, 40],
//           popupAnchor: [0, -40],
//         }),
//       })
//         .addTo(mapRef.current!)
//         .bindPopup(
//           `<div style="font-family: Inter, sans-serif;">
//             <strong>${vendor.businessName}</strong><br/>
//             <small>${vendor.distance.toFixed(1)}km de distância</small><br/>
//             <button onclick="window.vendorSelected('${vendor.id}')" style="margin-top: 8px; padding: 4px 12px; background: #FF6B35; color: white; border: none; border-radius: 4px; cursor: pointer;">
//               Ver Detalhes
//             </button>
//           </div>`
//         );

//       markersRef.current[vendor.id] = marker;

//       // Se o vendedor está selecionado, abrir popup
//       if (isSelected) {
//         marker.openPopup();
//       }
//     });

//     // Expor função global para o popup
//     (window as any).vendorSelected = (vendorId: string) => {
//       const vendor = vendors.find((v) => v.id === vendorId);
//       if (vendor) {
//         onSelectVendor(vendor);
//       }
//     };

//     // Ajustar zoom para incluir todos os marcadores
//     if (vendors.length > 0) {
//       const group = new L.FeatureGroup([
//         L.marker([userLocation.lat, userLocation.lng]),
//         ...vendors.map((v) => L.marker([v.latitude, v.longitude])),
//       ]);
//       mapRef.current?.fitBounds(group.getBounds().pad(0.1));
//     }
//   }, [vendors, selectedVendor, userLocation, onSelectVendor]);

//   return <div id="map" style={{ width: '100%', height: '100%' }} />;
// }


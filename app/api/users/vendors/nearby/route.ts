/**
 * API Route: GET /api/users/vendors/nearby
 * Buscar vendedores próximos usando geolocalização
 * Query params: latitude, longitude, radiusKm (opcional, padrão 5)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateDistance } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // Obter parâmetros da query
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get('latitude') || '0');
    const longitude = parseFloat(searchParams.get('longitude') || '0');
    const radiusKm = parseFloat(searchParams.get('radiusKm') || '5');

    // Validar parâmetros
    if (latitude === 0 || longitude === 0) {
      return NextResponse.json(
        { error: 'Latitude e longitude são obrigatórias' },
        { status: 400 }
      );
    }

    if (radiusKm < 1 || radiusKm > 50) {
      return NextResponse.json(
        { error: 'Raio deve estar entre 1km e 50km' },
        { status: 400 }
      );
    }

    // Converter raio para metros
    const radiusMeters = radiusKm * 1000;

    // Buscar todos os vendedores ativos
    const vendors = await prisma.vendor.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
        products: {
          take: 5,
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Filtrar vendedores por distância
    const nearbyVendors = vendors
      .map((vendor) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          vendor.latitude,
          vendor.longitude
        );
        return { ...vendor, distance };
      })
      .filter((vendor) => vendor.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(
      {
        count: nearbyVendors.length,
        vendors: nearbyVendors.map((vendor) => ({
          ...vendor,
          distance: Math.round(vendor.distance / 1000 * 10) / 10, // Converter para km com 1 casa decimal
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar vendedores próximos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar vendedores próximos' },
      { status: 500 }
    );
  }
}


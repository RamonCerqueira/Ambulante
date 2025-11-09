/**
 * API Routes para Produtos
 * GET /api/products - Listar todos os produtos
 * POST /api/products - Criar novo produto (autenticado)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { extractToken, verifyToken } from '@/lib/auth';

/**
 * GET /api/products
 * Listar todos os produtos ativos
 */
export async function GET(request: NextRequest) {
  try {
    // Obter parâmetros de paginação
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    // Validar parâmetros
    if (take > 100) {
      return NextResponse.json(
        { error: 'Máximo de 100 produtos por página' },
        { status: 400 }
      );
    }

    // Buscar produtos
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        skip,
        take,
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json(
      {
        products,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar produtos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Criar novo produto (apenas vendedores autenticados)
 */
export async function POST(request: NextRequest) {
  try {
    // Extrair token do header
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Verificar se é vendedor
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (user?.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'Apenas vendedores podem criar produtos' },
        { status: 403 }
      );
    }

    // Buscar vendor do usuário
    const vendor = await prisma.vendor.findUnique({
      where: { userId: decoded.userId },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendedor não encontrado' },
        { status: 404 }
      );
    }

    // Obter dados do corpo da requisição
    const { name, description, price, image, category, stock } = await request.json();

    // Validar campos obrigatórios
    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Nome e preço são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar produto
    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        name,
        description,
        price,
        image,
        category,
        stock: stock || 0,
      },
    });

    return NextResponse.json(
      {
        message: 'Produto criado com sucesso',
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}


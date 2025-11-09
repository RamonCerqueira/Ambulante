/**
 * API Routes para Pedidos
 * GET /api/orders - Listar pedidos do usuário autenticado
 * POST /api/orders - Criar novo pedido
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";

/**
 * GET /api/orders
 * Listar pedidos do usuário autenticado
 */
export async function GET(request: NextRequest) {
  try {
    // Extrair token do header
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Obter parâmetros de query
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "customer"; // customer ou vendor

    // Buscar pedidos
    let orders;
    if (type === "vendor") {
      // Buscar pedidos como vendedor
      orders = await prisma.order.findMany({
        where: { vendorId: decoded.userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Buscar pedidos como cliente
      orders = await prisma.order.findMany({
        where: { customerId: decoded.userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          vendor: {
            select: {
              id: true,
              name: true, // do User
              phone: true, // do User
              vendor: {
                select: {
                  businessName: true, // do Vendor
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(
      {
        count: orders.length,
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    return NextResponse.json(
      { error: "Erro ao listar pedidos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Criar novo pedido
 */
export async function POST(request: NextRequest) {
  try {
    // Extrair token do header
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Obter dados do corpo da requisição
    const {
      vendorId,
      items,
      deliveryAddress,
      deliveryLatitude,
      deliveryLongitude,
    } = await request.json();

    // Validar campos obrigatórios
    if (!vendorId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Vendedor e itens são obrigatórios" },
        { status: 400 }
      );
    }

    // Calcular preço total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Produto ${item.productId} não encontrado` },
          { status: 404 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        customerId: decoded.userId,
        vendorId,
        totalPrice,
        deliveryAddress,
        deliveryLatitude,
        deliveryLongitude,
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // Aqui acessamos o User que é o vendedor e, dentro dele, o Vendor
        vendor: {
          select: {
            id: true,
            name: true, // do User
            vendor: {
              select: {
                businessName: true, // do Vendor
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Pedido criado com sucesso",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

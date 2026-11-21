import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

function safeParseJson(str: any) {
  if (!str) return {};
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch {
    return { raw: String(str) };
  }
}

export async function GET(req: Request) {
  try {
    const auth = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let where: any = {};
    if (auth.role !== 'ADMIN') {
      where.userId = auth.userId;
    } else {
      if (status && status !== 'ALL') {
        where.productionStatus = status;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = orders.map((o) => ({
      ...o,
      items: o.items.map((it) => ({
        ...it,
        customizationDetails: safeParseJson(it.customizationDetails),
      })),
    }));

    return NextResponse.json({ orders: parsed });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getCurrentUser();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      state,
      items,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      customerNotes,
      clearCartAfter,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items?.length) {
      return NextResponse.json(
        { error: 'Customer details, shipping address, and at least one item are required' },
        { status: 400 }
      );
    }

    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: auth ? auth.userId : null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        city: city || 'Bengaluru',
        postalCode: postalCode || '560001',
        state: state || 'Karnataka',
        subtotal: parseFloat(subtotal || totalAmount),
        shippingFee: parseFloat(shippingFee || 0),
        totalAmount: parseFloat(totalAmount),
        paymentMethod: paymentMethod || 'DIRECT_UPI',
        paymentStatus: 'PENDING',
        productionStatus: 'ORDER_RECEIVED',
        customerNotes: customerNotes || null,
        items: {
          create: items.map((it: any) => {
            const rawCustom = it.customizationData || it.customizationDetails || {};
            const stringifiedCustom = typeof rawCustom === 'string'
              ? rawCustom
              : JSON.stringify(rawCustom);

            return {
              productId: it.productId || null,
              productName: it.productName || it.product?.name || 'Custom 3D Item',
              productImage: it.productImage || (it.product?.images ? JSON.parse(it.product.images)[0] : null),
              unitPrice: parseFloat(it.unitPrice || 0),
              customizationPrice: parseFloat(it.customizationPrice || 0),
              quantity: parseInt(it.quantity || 1),
              totalPrice: parseFloat(it.totalPrice || 0),
              customizationDetails: stringifiedCustom,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear cart if requested and user is authenticated
    if (clearCartAfter && auth) {
      await prisma.cartItem.deleteMany({
        where: { userId: auth.userId },
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: order.items.map((it) => ({
          ...it,
          customizationDetails: safeParseJson(it.customizationDetails),
        })),
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

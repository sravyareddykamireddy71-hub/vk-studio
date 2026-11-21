import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const auth = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const guestSessionId = searchParams.get('guestSessionId');

    let where: any = {};
    if (auth) {
      where = { userId: auth.userId };
    } else if (guestSessionId) {
      where = { guestSessionId };
    } else {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.cartItem.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            images: true,
            leadTimeDays: true,
            isAvailable: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsedItems = items.map((item) => ({
      ...item,
      customizationData: JSON.parse(item.customizationData || '{}'),
    }));

    return NextResponse.json({ items: parsedItems });
  } catch (error) {
    console.error('Fetch cart error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getCurrentUser();
    const body = await req.json();

    // Check if this is a sync operation (guest logging in with items)
    if (body.action === 'sync') {
      if (!auth) {
        return NextResponse.json({ error: 'Unauthorized to sync' }, { status: 401 });
      }

      const { guestItems } = body;
      if (Array.isArray(guestItems)) {
        for (const gItem of guestItems) {
          await prisma.cartItem.create({
            data: {
              userId: auth.userId,
              productId: gItem.productId,
              quantity: gItem.quantity || 1,
              customizationData: typeof gItem.customizationData === 'string'
                ? gItem.customizationData
                : JSON.stringify(gItem.customizationData || {}),
              unitPrice: parseFloat(gItem.unitPrice || 0),
              customizationPrice: parseFloat(gItem.customizationPrice || 0),
              totalPrice: parseFloat(gItem.totalPrice || 0),
            },
          });
        }
      }

      // Return refreshed cart
      const updatedItems = await prisma.cartItem.findMany({
        where: { userId: auth.userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
              images: true,
              leadTimeDays: true,
              isAvailable: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        items: updatedItems.map((item) => ({
          ...item,
          customizationData: JSON.parse(item.customizationData || '{}'),
        })),
      });
    }

    // Normal Add to Cart
    const {
      productId,
      quantity,
      customizationData,
      unitPrice,
      customizationPrice,
      totalPrice,
      guestSessionId,
    } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: auth ? auth.userId : null,
        guestSessionId: auth ? null : (guestSessionId || null),
        productId,
        quantity: parseInt(quantity || 1),
        customizationData: typeof customizationData === 'string'
          ? customizationData
          : JSON.stringify(customizationData || {}),
        unitPrice: parseFloat(unitPrice || 0),
        customizationPrice: parseFloat(customizationPrice || 0),
        totalPrice: parseFloat(totalPrice || 0),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            images: true,
            leadTimeDays: true,
            isAvailable: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        ...cartItem,
        customizationData: JSON.parse(cartItem.customizationData || '{}'),
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await getCurrentUser();
    const body = await req.json();
    const { id, quantity } = body;

    if (!id || quantity === undefined) {
      return NextResponse.json({ error: 'Item ID and quantity required' }, { status: 400 });
    }

    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (auth && item.userId && item.userId !== auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const newQty = parseInt(quantity);
    if (newQty <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      return NextResponse.json({ success: true, removed: true });
    }

    const singleItemTotal = item.unitPrice + item.customizationPrice;
    const newTotal = singleItemTotal * newQty;

    const updated = await prisma.cartItem.update({
      where: { id },
      data: {
        quantity: newQty,
        totalPrice: newTotal,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            images: true,
            leadTimeDays: true,
            isAvailable: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        ...updated,
        customizationData: JSON.parse(updated.customizationData || '{}'),
      },
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');

    if (clearAll === 'true') {
      if (auth) {
        await prisma.cartItem.deleteMany({ where: { userId: auth.userId } });
      }
      return NextResponse.json({ success: true, cleared: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ success: true, removed: true });
    }

    if (auth && item.userId && item.userId !== auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ success: true, removed: true });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}

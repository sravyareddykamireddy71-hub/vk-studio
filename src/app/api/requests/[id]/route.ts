import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    const { id } = params;

    const request = await prisma.customizationRequest.findFirst({
      where: {
        OR: [{ id }, { referenceNumber: id }],
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (auth?.role !== 'ADMIN' && request.userId && request.userId !== auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      request: {
        ...request,
        customizationDetails: JSON.parse(request.customizationDetails || '{}'),
      },
    });
  } catch (error) {
    console.error('Get request error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.customizationRequest.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    let convertedOrder = null;

    // Convert to Order action
    if (body.action === 'CONVERT_TO_ORDER' || body.status === 'CONVERTED_TO_ORDER') {
      const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const finalAmount = body.finalQuote
        ? parseFloat(body.finalQuote)
        : (existing.finalQuote || existing.estimatedPrice || 1000);

      convertedOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId: existing.userId,
          customerName: existing.customerName,
          customerEmail: existing.customerEmail,
          customerPhone: existing.customerPhone || 'Not provided',
          shippingAddress: body.shippingAddress || 'Studio Pickup / Address on file',
          city: body.city || 'Bengaluru',
          postalCode: body.postalCode || '560001',
          state: body.state || 'Karnataka',
          customizationRequestId: existing.id,
          subtotal: finalAmount,
          shippingFee: 0,
          totalAmount: finalAmount,
          paymentMethod: 'STUDIO_CONFIRMATION',
          paymentStatus: 'PENDING',
          productionStatus: 'CONFIRMED',
          customerNotes: existing.customerInstructions || null,
          adminNotes: `Converted from Customization Request ${existing.referenceNumber}`,
          items: {
            create: [
              {
                productId: existing.productId,
                productName: existing.productTitle,
                productImage: existing.product?.images ? JSON.parse(existing.product.images)[0] : null,
                unitPrice: finalAmount / existing.quantity,
                customizationPrice: 0,
                quantity: existing.quantity,
                totalPrice: finalAmount,
                customizationDetails: existing.customizationDetails,
              },
            ],
          },
        },
      });

      body.status = 'CONVERTED_TO_ORDER';
    }

    const updated = await prisma.customizationRequest.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.estimatedPrice !== undefined ? { estimatedPrice: parseFloat(body.estimatedPrice) } : {}),
        ...(body.finalQuote !== undefined ? { finalQuote: parseFloat(body.finalQuote) } : {}),
        ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
        ...(body.adminResponse !== undefined ? { adminResponse: body.adminResponse } : {}),
      },
      include: {
        product: true,
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      request: {
        ...updated,
        customizationDetails: JSON.parse(updated.customizationDetails || '{}'),
      },
      order: convertedOrder,
    });
  } catch (error) {
    console.error('Update request error:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
}

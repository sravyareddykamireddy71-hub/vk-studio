import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const auth = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let where: any = {};

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Customer only sees their requests
    if (auth.role !== 'ADMIN') {
      where.userId = auth.userId;
    } else {
      // Admin can filter by status
      if (status && status !== 'ALL') {
        where.status = status;
      }
    }

    const requests = await prisma.customizationRequest.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
          },
        },
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

    const parsed = requests.map((r) => ({
      ...r,
      customizationDetails: JSON.parse(r.customizationDetails || '{}'),
    }));

    return NextResponse.json({ requests: parsed });
  } catch (error) {
    console.error('Fetch customization requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customization requests' },
      { status: 500 }
    );
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
      productId,
      productTitle,
      customizationDetails,
      customerInstructions,
      referenceFileUrl,
      quantity,
      estimatedPrice,
    } = body;

    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const refNumber = `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest = await prisma.customizationRequest.create({
      data: {
        referenceNumber: refNumber,
        userId: auth ? auth.userId : null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone?.trim() || null,
        productId: productId || null,
        productTitle: productTitle || 'Custom Bespoke Commission',
        customizationDetails: typeof customizationDetails === 'string'
          ? customizationDetails
          : JSON.stringify(customizationDetails || {}),
        customerInstructions: customerInstructions || null,
        referenceFileUrl: referenceFileUrl || null,
        quantity: parseInt(quantity || 1),
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null,
        status: 'NEW_REQUEST',
      },
    });

    return NextResponse.json({
      success: true,
      request: {
        ...newRequest,
        customizationDetails: JSON.parse(newRequest.customizationDetails || '{}'),
      },
    });
  } catch (error) {
    console.error('Create customization request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit customization request' },
      { status: 500 }
    );
  }
}

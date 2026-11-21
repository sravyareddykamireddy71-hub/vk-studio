import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Can be queried by id or slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const totalReviews = product.reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              product.reviews.reduce((acc, r) => acc + r.rating, 0) /
              totalReviews
            ).toFixed(1)
          )
        : 5.0;

    return NextResponse.json({
      product: {
        ...product,
        totalReviews,
        averageRating,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.slug ? { slug: body.slug } : {}),
        ...(body.tagline !== undefined ? { tagline: body.tagline } : {}),
        ...(body.description ? { description: body.description } : {}),
        ...(body.basePrice !== undefined ? { basePrice: parseFloat(body.basePrice) } : {}),
        ...(body.images ? { images: typeof body.images === 'string' ? body.images : JSON.stringify(body.images) } : {}),
        ...(body.model3dType !== undefined ? { model3dType: body.model3dType } : {}),
        ...(body.categoryId ? { categoryId: body.categoryId } : {}),
        ...(body.isAvailable !== undefined ? { isAvailable: Boolean(body.isAvailable) } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: Boolean(body.isFeatured) } : {}),
        ...(body.leadTimeDays !== undefined ? { leadTimeDays: parseInt(body.leadTimeDays) } : {}),
        ...(body.materials ? { materials: typeof body.materials === 'string' ? body.materials : JSON.stringify(body.materials) } : {}),
        ...(body.colors ? { colors: typeof body.colors === 'string' ? body.colors : JSON.stringify(body.colors) } : {}),
        ...(body.dimensions !== undefined ? { dimensions: body.dimensions } : {}),
        ...(body.weight !== undefined ? { weight: body.weight } : {}),
        ...(body.customizationFields ? { customizationFields: typeof body.customizationFields === 'string' ? body.customizationFields : JSON.stringify(body.customizationFields) } : {}),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

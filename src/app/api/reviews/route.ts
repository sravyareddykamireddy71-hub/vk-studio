import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const all = searchParams.get('all');

    const auth = await getCurrentUser();

    let where: any = {};
    if (all === 'true' && auth?.role === 'ADMIN') {
      // Admin sees all reviews (published & unpublished)
    } else {
      where.isPublished = true;
    }

    if (productId) {
      where.productId = productId;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getCurrentUser();
    const body = await req.json();

    const { productId, authorName, rating, reviewText, imageUrl } = body;

    if (!productId || !authorName || !rating || !reviewText) {
      return NextResponse.json(
        { error: 'Product, author name, rating, and review text are required' },
        { status: 400 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        productId,
        userId: auth ? auth.userId : null,
        authorName: authorName.trim(),
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        reviewText: reviewText.trim(),
        imageUrl: imageUrl || null,
        isPublished: true, // Default publish, can be moderated by admin
        isVerifiedPurchase: Boolean(auth),
      },
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

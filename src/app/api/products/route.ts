import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {};

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tagline: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') {
      orderBy = { basePrice: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { basePrice: 'desc' };
    } else if (sort === 'name') {
      orderBy = { name: 'asc' };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        reviews: {
          where: { isPublished: true },
          select: { rating: true },
        },
      },
      orderBy,
    });

    const enriched = products.map((p) => {
      const totalReviews = p.reviews.length;
      const averageRating =
        totalReviews > 0
          ? Number(
              (
                p.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
              ).toFixed(1)
            )
          : 5.0;

      return {
        ...p,
        totalReviews,
        averageRating,
      };
    });

    return NextResponse.json({ products: enriched });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      tagline,
      description,
      basePrice,
      images,
      model3dType,
      categoryId,
      isAvailable,
      isFeatured,
      leadTimeDays,
      materials,
      colors,
      dimensions,
      weight,
      customizationFields,
    } = body;

    if (!name || !slug || !description || basePrice === undefined || !categoryId) {
      return NextResponse.json(
        { error: 'Name, slug, description, basePrice, and category are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        tagline: tagline || null,
        description,
        basePrice: parseFloat(basePrice),
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        model3dType: model3dType || null,
        categoryId,
        isAvailable: isAvailable ?? true,
        isFeatured: isFeatured ?? false,
        leadTimeDays: parseInt(leadTimeDays || '3'),
        materials: typeof materials === 'string' ? materials : JSON.stringify(materials || []),
        colors: typeof colors === 'string' ? colors : JSON.stringify(colors || []),
        dimensions: dimensions || null,
        weight: weight || null,
        customizationFields:
          typeof customizationFields === 'string'
            ? customizationFields
            : JSON.stringify(customizationFields || []),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken, hashPassword, isAdminEmail } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isAdmin = isAdminEmail(normalizedEmail);

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // If an authorized admin logs in for the first time, save account with their respective password
    if (!user && isAdmin) {
      const hashedPassword = await hashPassword(password);
      const adminName = normalizedEmail.includes('vamsi')
        ? 'Vamsi Krishna (VK Studio Director)'
        : 'VK Studio Official Admin';

      user = await prisma.user.create({
        data: {
          name: adminName,
          email: normalizedEmail,
          password: hashedPassword,
          phone: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+91 91004 84870',
          role: 'ADMIN',
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Ensure authorized admin emails always maintain ADMIN role
    if (isAdmin && user.role !== 'ADMIN') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
    }

    let isValid = await verifyPassword(password, user.password);

    // If admin enters their respective password, save authentication permanently
    if (!isValid && isAdmin) {
      const newHash = await hashPassword(password);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash, role: 'ADMIN' },
      });
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
      },
    });

    response.cookies.set('vk_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}

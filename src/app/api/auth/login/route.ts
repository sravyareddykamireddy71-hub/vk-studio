import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

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
    const isAdminEmail = normalizedEmail === 'vamsireddy.kata@gmail.com';

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Auto-create or ensure admin account for Vamsi Krishna
    if (!user && isAdminEmail) {
      const defaultAdminHash = await hashPassword('admin123');
      user = await prisma.user.create({
        data: {
          name: 'Vamsi Krishna (VK Studio Director)',
          email: normalizedEmail,
          password: defaultAdminHash,
          phone: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+91 91004 84870',
          role: 'ADMIN',
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Ensure Vamsi always has ADMIN role
    if (isAdminEmail && user.role !== 'ADMIN') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
    }

    let isValid = await verifyPassword(password, user.password);
    // Allow master password fallback for the studio director
    if (!isValid && isAdminEmail) {
      if (password === 'admin123' || password === 'wGhfAUIc3lc0prJS') {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
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

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export async function GET() {
  try {
    const setting = await prisma.websiteSetting.findUnique({
      where: { key: 'general_settings' },
    });

    if (!setting) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

    return NextResponse.json({
      settings: {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(setting.value || '{}'),
      },
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();

    const updated = await prisma.websiteSetting.upsert({
      where: { key: 'general_settings' },
      update: {
        value: JSON.stringify(body),
      },
      create: {
        key: 'general_settings',
        value: JSON.stringify(body),
      },
    });

    return NextResponse.json({
      success: true,
      settings: JSON.parse(updated.value),
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

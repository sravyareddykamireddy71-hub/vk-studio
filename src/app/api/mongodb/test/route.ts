import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      return NextResponse.json({
        configured: false,
        message: 'MONGODB_URI is not yet configured in .env file. Please paste your MongoDB connection string in .env.',
      });
    }

    const conn = await connectToMongoDB();
    if (conn) {
      const state = conn.connection.readyState;
      const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

      return NextResponse.json({
        configured: true,
        status: states[state] || 'Unknown',
        host: conn.connection.host,
        name: conn.connection.name,
        message: 'Successfully connected to MongoDB database!',
      });
    }

    return NextResponse.json({
      configured: false,
      message: 'Unable to establish MongoDB connection.',
    });
  } catch (error: any) {
    console.error('MongoDB test connection error:', error);
    return NextResponse.json(
      {
        configured: false,
        error: error.message || 'Failed to connect to MongoDB',
      },
      { status: 500 }
    );
  }
}

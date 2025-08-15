import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // In a real implementation, this would store to monitoring service
    // For now, just log and return success

    return NextResponse.json({
      success: true,
      message: 'Performance metrics recorded successfully',
    });
  } catch (error) {
    console.error('Performance metrics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record performance metrics' },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'GET method not supported for performance metrics' },
    { status: 405 }
  );
}

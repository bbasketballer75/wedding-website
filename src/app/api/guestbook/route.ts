import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    // Return sample guestbook data
    const guestbookData = {
      success: true,
      data: [
        {
          id: 'sample-1',
          name: 'Austin & Jordyn',
          message: 'Thank you for celebrating with us! 💕',
          timestamp: new Date().toISOString(),
          approved: true,
        },
        {
          id: 'sample-2',
          name: 'Wedding Guest',
          message: 'Congratulations on your beautiful wedding!',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          approved: true,
        },
      ],
    };

    return NextResponse.json(guestbookData);
  } catch (error) {
    console.error('Guestbook API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guestbook entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate required fields
    if (!body.name || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name and message are required' },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Guestbook entry submitted successfully',
      data: {
        id: `entry-${Date.now()}`,
        name: body.name,
        message: body.message,
        timestamp: new Date().toISOString(),
        status: 'pending_approval',
      },
    });
  } catch (error) {
    console.error('Guestbook POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit guestbook entry' },
      { status: 500 }
    );
  }
}

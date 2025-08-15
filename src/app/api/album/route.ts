import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    // Return sample album data for now
    const albumData = {
      success: true,
      data: [
        {
          id: 'sample-1',
          filename: 'sample-photo.jpg',
          url: '/images/sample-photo.jpg',
          caption: 'Beautiful wedding moment',
          uploadedAt: new Date().toISOString(),
          approved: true,
        },
      ],
    };

    return NextResponse.json(albumData);
  } catch (error) {
    console.error('Album API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch album data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        id: `upload-${Date.now()}`,
        status: 'pending_approval',
      },
    });
  } catch (error) {
    console.error('Album POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload to album' },
      { status: 500 }
    );
  }
}

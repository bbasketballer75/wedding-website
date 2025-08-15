import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    // Return sample map locations data
    const locationsData = {
      success: true,
      data: [
        {
          id: 'ceremony',
          name: 'Ceremony Venue',
          address: '123 Wedding Lane, Love City, LC 12345',
          coordinates: { lat: 40.7128, lng: -74.006 },
          type: 'ceremony',
          description: 'Where we say "I do"',
        },
        {
          id: 'reception',
          name: 'Reception Venue',
          address: '456 Celebration Ave, Party Town, PT 67890',
          coordinates: { lat: 40.7589, lng: -73.9851 },
          type: 'reception',
          description: 'Where we party!',
        },
      ],
    };

    return NextResponse.json(locationsData);
  } catch (error) {
    console.error('Map locations API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch map locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
    });
  } catch (error) {
    console.error('Map locations POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

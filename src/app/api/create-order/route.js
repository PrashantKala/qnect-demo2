import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    // Your logic here
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

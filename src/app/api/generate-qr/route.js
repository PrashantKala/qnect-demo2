import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import axios from 'axios';

// Your backend server
const BACKEND_API_URL = 'https://qnect-backend.onrender.com/api';

export async function POST(request) {
  try {
    // Get authorization header
    const headersList = request.headers;
    const authHeader = headersList.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Forward the request to the backend
    const backendResponse = await axios.post(
      `${BACKEND_API_URL}/qrs/create-and-send`,
      {},
      { headers: { Authorization: authHeader } }
    );

    return NextResponse.json({ message: 'Success! QR generated and emailed.' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({ 
      message: error.response?.data?.message || 'An internal server error occurred.'
    }, { status: error.response?.status || 500 });
  }
}
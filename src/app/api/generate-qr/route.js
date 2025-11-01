import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_API_URL = 'https://qnect-backend.onrender.com/api';

export async function POST(request) {
  try {
    const headersList = request.headers;
    const authHeader = headersList.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const backendResponse = await axios.post(
      `${BACKEND_API_URL}/qrs/generate`,
      {},
      {
        headers: { Authorization: authHeader },
        validateStatus: false
      }
    );

    if (!backendResponse.data) {
      throw new Error('Empty response from backend');
    }

    return NextResponse.json(backendResponse.data, { 
      status: backendResponse.status 
    });

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.data) {
      return NextResponse.json(error.response.data, { 
        status: error.response.status || 500 
      });
    }

    return NextResponse.json({ 
      message: 'An internal server error occurred.',
      details: error.message
    }, { 
      status: 500 
    });
  }
}
import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_API_URL = 'https://qnect-backend.onrender.com/api';

export async function POST(request) {
  try {
    // Get auth token from request
    const headersList = request.headers;
    const authHeader = headersList.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Forward request to backend
    try {
      const backendResponse = await axios.post(
        `${BACKEND_API_URL}/qrs/generate`,
        {},  // No body needed as user info comes from token
        { 
          headers: { 
            Authorization: authHeader 
          },
          validateStatus: false // This will prevent axios from throwing on non-2xx status
        }
      );

      // Ensure we have a valid response
      if (!backendResponse.data) {
        throw new Error('Empty response from backend');
      }

      // Return backend response to frontend
      return NextResponse.json(
        backendResponse.data,
        { status: backendResponse.status }
      );
    } catch (axiosError) {
      // Handle axios specific errors
      if (axiosError.response?.data) {
        return NextResponse.json(axiosError.response.data, { 
          status: axiosError.response.status || 500 
        });
      }

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return NextResponse.json({ 
      message: error.response?.data?.message || 'An internal server error occurred.',
      error: error.response?.data
    }, { 
      status: error.response?.status || 500 
    });
  }
}
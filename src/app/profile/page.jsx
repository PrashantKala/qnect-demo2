"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// ▼▼▼ THIS IS THE FIX ▼▼▼
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// ▲▲▲ THIS IS THE FIX ▲▲▲
import { fetchMyQRs } from '../../../lib/api';

export default function ProfilePage() {
  const { userToken, isLoading: isAuthLoading, logout, userEmail } = useAuth();
  const router = useRouter();
  const [qrs, setQrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Protect the route
  useEffect(() => {
    if (!isAuthLoading && !userToken) {
      router.replace('/login?redirect=/profile');
    }
  }, [userToken, isAuthLoading, router]);

  // Fetch data
  useEffect(() => {
    if (userToken) {
      fetchMyQRs()
        .then(response => setQrs(response.data))
        .catch(err => console.error("Failed to fetch QRs", err))
        .finally(() => setIsLoading(false));
    }
  }, [userToken]);

  if (isAuthLoading || (isLoading && userToken)) {
    return <main className="container mx-auto px-6 py-12 pt-24 min-h-screen"><p>Loading profile...</p></main>;
  }

  return (
    <main className="container mx-auto px-6 py-12 pt-24 min-h-screen">
      <h1 className="text-4xl font-bold text-primary-blue mb-8">My Profile & QRs</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-primary-blue mb-4">My Account</h2>
            <p className="text-text-secondary text-lg break-all">{userEmail}</p>
            <button 
              onClick={logout} 
              className="w-full text-center mt-6 px-4 py-2 text-sm text-red-600 font-medium bg-red-100 rounded-lg hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* QR List Card */}
        <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary-blue">My Activated QR Codes ({qrs.length})</h2>
            <Link href="/order-qr" className="inline-block px-4 py-2 bg-accent-cyan text-primary-blue font-bold rounded-lg text-sm hover:opacity-90">
              + Get New QR
            </Link>
          </div>
          <div className="space-y-4">
            {qrs.length > 0 ? (
              qrs.map(qr => (
                <div key={qr._id} className="p-4 border border-border-color rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-mono text-sm text-text-secondary">ID: {qr.qrId}</p>
                    <p className="text-lg font-semibold text-primary-blue">Status: <span className="capitalize">{qr.status}</span></p>
                  </div>
                  <p className="text-sm text-text-secondary">Activated: {new Date(qr.activatedAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-center py-8">
                You have not purchased or activated any QR codes yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
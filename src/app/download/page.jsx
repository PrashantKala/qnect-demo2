"use client";

import { useEffect } from 'react';

export default function DownloadPage() {
    useEffect(() => {
        // Get the device's user agent
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // 1. Check for iOS
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            window.location.href = "https://apps.apple.com/in/app/qnect-940570/id6766070178";
        }
        // 2. Check for Android
        else if (/android/i.test(userAgent)) {
            window.location.href = "https://play.google.com/store/apps/details?id=com.qnect_app";
        }
        // 3. Fallback for Desktop/Mac/Windows
        else {
            // Redirect to a page with both buttons, or just back to the homepage
            window.location.href = "/";
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="p-8 bg-white rounded-lg shadow-lg text-center border-2 border-accent-cyan max-w-md w-full">
                <h1 className="text-2xl font-bold text-primary-blue mb-4">Redirecting you...</h1>
                <p className="text-gray-600 mb-6">Taking you to the official app store to download QNect.</p>
                <div className="w-12 h-12 border-4 border-t-accent-cyan border-b-primary-blue border-l-primary-blue border-r-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        </div>
    );
}

"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RoleGuard({ children, allowedRoles }) {
    const { userRole, isLoading, userToken } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!userToken) {
                // Not logged in
                router.push('/login');
            } else if (userRole && allowedRoles.includes(userRole)) {
                setIsAuthorized(true);
            } else {
                // Logged in but wrong role
                router.push('/');
            }
        }
    }, [isLoading, userRole, userToken, router, allowedRoles]);

    if (isLoading || !isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 size={48} className="animate-spin text-primary-blue" />
                <span className="ml-4 text-xl font-medium text-gray-700">Verifying access...</span>
            </div>
        );
    }

    return <>{children}</>;
}

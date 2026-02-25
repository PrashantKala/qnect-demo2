"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoleGuard from '../components/RoleGuard';
import { useAuth } from '../context/AuthContext';

export default function SalespersonLayout({ children }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const getLinkClasses = (path) => {
        const isActive = pathname === path;
        return `block px-4 py-2 my-2 rounded-md transition-colors ${isActive
            ? 'bg-green-100 text-green-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
            }`;
    };

    return (
        <RoleGuard allowedRoles={['salesperson']}>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <nav className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col pt-8 px-4 h-full shadow-sm">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800 px-2 tracking-tight">QNect Sales</h2>
                    <ul className="flex-1 overflow-y-auto">
                        <li>
                            <Link href="/salesperson" className={getLinkClasses('/salesperson')}>
                                Dashboard & QRs
                            </Link>
                        </li>
                    </ul>
                    <div className="mb-4">
                        <button onClick={logout} className="w-full text-left px-4 py-2 my-2 rounded-md text-red-600 hover:bg-red-50 transition-colors font-medium">
                            Logout
                        </button>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}

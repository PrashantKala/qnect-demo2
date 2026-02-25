"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const getLinkClasses = (path) => {
        const isActive = pathname === path;
        return `block px-4 py-2 my-2 rounded-md transition-colors ${isActive
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
            }`;
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <nav className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col pt-8 px-4 h-full shadow-sm">
                <h2 className="text-2xl font-bold mb-8 text-gray-800 px-2 tracking-tight">QNect Admin</h2>
                <ul className="flex-1 overflow-y-auto">
                    <li>
                        <Link href="/admin" className={getLinkClasses('/admin')}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/qrs" className={getLinkClasses('/admin/qrs')}>
                            QR Management
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/salespersons" className={getLinkClasses('/admin/salespersons')}>
                            Salespersons
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/users" className={getLinkClasses('/admin/users')}>
                            User Management
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}

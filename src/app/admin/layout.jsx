"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoleGuard from '../components/RoleGuard';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const getLinkClasses = (path) => {
        const isActive = pathname === path;
        return `block px-4 py-2 my-2 rounded-md transition-colors ${isActive
            ? 'bg-blue-100 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
            }`;
    };

    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                {/* Sidebar */}
                <nav className={`${isSidebarOpen ? 'w-64 px-4' : 'w-0 px-0 opacity-0 md:opacity-100'} transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex-shrink-0 flex flex-col pt-8 h-full shadow-sm overflow-hidden whitespace-nowrap`}>
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
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 mr-4 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 transition flex items-center justify-center font-bold"
                            aria-label="Toggle Sidebar"
                        >
                            {isSidebarOpen ? '❮' : '❯'}
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Admin Portal</h1>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}

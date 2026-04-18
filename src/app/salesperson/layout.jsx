"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoleGuard from '../components/RoleGuard';
import { useAuth } from '../context/AuthContext';

export default function SalespersonLayout({ children }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const getLinkClasses = (path) => {
        const isActive = pathname === path;
        return `block px-4 py-2 my-2 rounded-md transition-colors ${isActive
            ? 'bg-green-100 text-green-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
            }`;
    };

    return (
        <RoleGuard allowedRoles={['salesperson']}>
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <nav className={`${isSidebarOpen ? 'w-64 px-4' : 'w-0 px-0 opacity-0 md:opacity-100'} transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex-shrink-0 flex flex-col pt-8 h-screen sticky top-0 shadow-sm overflow-hidden whitespace-nowrap`}>
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
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm sticky top-0 z-10 w-full">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 mr-4 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 transition flex items-center justify-center font-bold"
                            aria-label="Toggle Sidebar"
                        >
                            {isSidebarOpen ? '❮' : '❯'}
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Salesperson Portal</h1>
                    </header>
                    <main className="flex-1 p-4 md:p-8 bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}

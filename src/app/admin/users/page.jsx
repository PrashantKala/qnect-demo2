"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchUsers, fetchUserDetail } from '../api/adminApi';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // QR preview modal state
    const [previewUser, setPreviewUser] = useState(null);
    const [previewQrs, setPreviewQrs] = useState([]);
    const [loadingPreview, setLoadingPreview] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await fetchUsers();
                setUsers(response.data);
            } catch (err) {
                setError("Could not load user data.");
            } finally {
                setIsLoading(false);
            }
        };
        loadUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const handleViewQrs = async (user) => {
        setPreviewUser(user);
        setLoadingPreview(true);
        try {
            const res = await fetchUserDetail(user._id);
            setPreviewQrs(res.data.qrs || []);
        } catch (err) {
            setPreviewQrs([]);
        } finally {
            setLoadingPreview(false);
        }
    };

    const closePreview = () => {
        setPreviewUser(null);
        setPreviewQrs([]);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-gray-600 animate-pulse">Loading Users...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">All Registered Users</h3>
                        <p className="text-sm text-gray-500 mt-1">Showing {filteredUsers.length} of {users.length} users</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                {error && <div className="p-4 bg-red-50 border-b border-red-200"><p className="text-sm text-red-600 font-medium">{error}</p></div>}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign-up Method</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">QRs</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                {(user.firstName || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <Link href={`/admin/users/${user._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobileNumber || user.phoneNumber || <span className="text-gray-400 italic">N/A</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${user.authMethod === 'google' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.authMethod || 'email'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleViewQrs(user)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="View assigned QR codes"
                                        >
                                            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm ? 'No users found matching your search.' : 'No users registered yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User QR Preview Modal */}
            {previewUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={closePreview}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative border border-gray-100 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={closePreview}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            QR Codes for {`${previewUser.firstName || ''} ${previewUser.lastName || ''}`.trim()}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">{previewUser.email}</p>

                        {loadingPreview ? (
                            <div className="py-8 text-center text-gray-500 animate-pulse">Loading QR codes...</div>
                        ) : previewQrs.length === 0 ? (
                            <div className="py-8 text-center text-gray-400">No QR codes assigned to this user.</div>
                        ) : (
                            <div className="overflow-y-auto space-y-3 flex-1">
                                {previewQrs.map((qr) => (
                                    <div key={qr._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`https://qnect.in/c/${qr.qrId}`)}`}
                                            alt="QR"
                                            className="rounded border border-gray-200 flex-shrink-0"
                                            width={60}
                                            height={60}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-mono text-gray-600 truncate">{qr.qrId}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${qr.status === 'activated' ? 'bg-green-100 text-green-800' : qr.status === 'disabled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {qr.status}
                                                </span>
                                                {qr.expiresAt && (
                                                    <span className="text-xs text-gray-400">
                                                        Expires: {new Date(qr.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchUserDetail } from '../../api/adminApi';

export default function UserDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchUserDetail(id);
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load user details.');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    if (isLoading) return <div className="flex items-center justify-center h-full"><h2 className="text-xl font-semibold text-gray-600 animate-pulse">Loading...</h2></div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
    if (!data) return null;

    const { user, qrs } = data;
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const address = user.address;
    const hasAddress = address && (address.houseNumber || address.streetName || address.city || address.state || address.pincode);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Back link */}
            <Link href="/admin/users" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back to Users
            </Link>

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
                    {(user.firstName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{fullName || 'Unknown User'}</h1>
                    <p className="text-gray-500 mt-1">{user.email}</p>
                </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div><span className="font-medium text-gray-500">First Name:</span> <span className="text-gray-900 ml-2">{user.firstName || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Last Name:</span> <span className="text-gray-900 ml-2">{user.lastName || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Email:</span> <span className="text-gray-900 ml-2">{user.email}</span></div>
                    <div><span className="font-medium text-gray-500">Mobile:</span> <span className="text-gray-900 ml-2">{user.mobileNumber || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Role:</span> <span className="text-gray-900 ml-2 capitalize">{user.role}</span></div>
                    <div><span className="font-medium text-gray-500">Auth Method:</span> <span className="text-gray-900 ml-2 capitalize">{user.authMethod}</span></div>
                    <div><span className="font-medium text-gray-500">Referral Code:</span> <span className="text-gray-900 ml-2 font-mono">{user.referralCode || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Wallet Credits:</span> <span className="text-gray-900 ml-2">{user.wallet?.credits ?? 0}</span></div>
                    <div><span className="font-medium text-gray-500">Registered:</span> <span className="text-gray-900 ml-2">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                </div>
            </div>

            {/* Address */}
            {hasAddress && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Address</h2>
                    </div>
                    <div className="p-6 text-sm text-gray-900">
                        <p>{[address.houseNumber, address.streetName].filter(Boolean).join(', ')}</p>
                        {address.landmark && <p className="text-gray-500">Near: {address.landmark}</p>}
                        <p>{[address.city, address.state, address.pincode].filter(Boolean).join(', ')}</p>
                        {address.country && <p>{address.country}</p>}
                    </div>
                </div>
            )}

            {/* Guardians */}
            {user.guardians && user.guardians.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Guardians ({user.guardians.length})</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        {user.guardians.map((g, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                                    {(g.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">{g.name} {g.relation && <span className="text-gray-400 ml-1">({g.relation})</span>}</p>
                                    <p className="text-gray-500">{g.email || g.phoneNumber || 'No contact info'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Assigned QRs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Assigned QR Codes ({qrs.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold By</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activated</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {qrs.map((qr) => (
                                <tr key={qr._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{qr.qrId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${qr.status === 'activated' ? 'bg-green-100 text-green-800' : qr.status === 'disabled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {qr.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {qr.soldBySalesperson ? (
                                            `${qr.soldBySalesperson.firstName || ''} ${qr.soldBySalesperson.lastName || ''}`.trim() || qr.soldBySalesperson.email
                                        ) : (
                                            <span className="text-gray-400 italic">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {qr.activatedAt ? new Date(qr.activatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : <span className="text-gray-400 italic">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {qr.expiresAt ? new Date(qr.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : <span className="text-gray-400 italic">Never</span>}
                                    </td>
                                </tr>
                            ))}
                            {qrs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No QR codes assigned to this user.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

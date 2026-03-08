"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchSalespersonDetail } from '../../api/adminApi';

export default function SalespersonDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchSalespersonDetail(id);
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load salesperson details.');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    if (isLoading) return <div className="flex items-center justify-center h-full"><h2 className="text-xl font-semibold text-gray-600 animate-pulse">Loading...</h2></div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
    if (!data) return null;

    const { salesperson, user, qrs, stats } = data;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Back link */}
            <Link href="/admin/salespersons" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back to Salespersons
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{salesperson.name}</h1>
                    <p className="text-gray-500 mt-1 font-mono text-sm">{salesperson.salespersonId}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full self-start ${salesperson.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {salesperson.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">QRs Assigned</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalAssigned}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">QRs Sold</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">{stats.totalSold}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">Avg Sales / Day</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{stats.avgPerDay}</p>
                </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div><span className="font-medium text-gray-500">Full Name:</span> <span className="text-gray-900 ml-2">{salesperson.name}</span></div>
                    <div><span className="font-medium text-gray-500">Salesperson ID:</span> <span className="text-gray-900 ml-2 font-mono">{salesperson.salespersonId}</span></div>
                    <div><span className="font-medium text-gray-500">Email:</span> <span className="text-gray-900 ml-2">{user?.email || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Contact:</span> <span className="text-gray-900 ml-2">{salesperson.contactNumber || user?.mobileNumber || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Auth Method:</span> <span className="text-gray-900 ml-2 capitalize">{user?.authMethod || 'N/A'}</span></div>
                    <div><span className="font-medium text-gray-500">Joined:</span> <span className="text-gray-900 ml-2">{new Date(salesperson.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                </div>
            </div>

            {/* Assigned QRs Table */}
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {qrs.map((qr) => {
                                const isSold = !!qr.soldBySalesperson;
                                const buyer = qr.assignedToUser;
                                return (
                                    <tr key={qr._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{qr.qrId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${qr.status === 'activated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {qr.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isSold ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {isSold ? 'Sold' : 'Available'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {buyer ? (
                                                <Link href={`/admin/users/${buyer._id}`} className="text-blue-600 hover:underline">
                                                    {`${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() || buyer.email}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400 italic">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(qr.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                    </tr>
                                );
                            })}
                            {qrs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No QR codes assigned to this salesperson yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

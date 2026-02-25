"use client";
import React, { useState, useEffect } from 'react';
import { fetchDashboard, fetchAssignedQRs, registerQRSale } from './api/salespersonApi';

export default function SalespersonDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [qrs, setQrs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Register Sale Form State
    const [selectedQrId, setSelectedQrId] = useState('');
    const [endUserEmail, setEndUserEmail] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const loadData = async () => {
        try {
            const [dashRes, qrsRes] = await Promise.all([
                fetchDashboard(),
                fetchAssignedQRs()
            ]);
            setDashboardData(dashRes.data);
            setQrs(qrsRes.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Could not load salesperson data. Please try again.');
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await loadData();
            setIsLoading(false);
        };
        init();
    }, []);

    const handleRegisterSale = async (e) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            const response = await registerQRSale(selectedQrId, endUserEmail);
            alert(response.data.message);
            // Reset form
            setSelectedQrId('');
            setEndUserEmail('');
            // Reload table
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to register sale.');
        } finally {
            setIsRegistering(false);
        }
    };

    if (isLoading) {
        return <div className="animate-pulse text-gray-500">Loading Dashboard...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const availableQrs = qrs.filter(qr => qr.status === 'available' && !qr.soldBySalesperson);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {dashboardData?.salesperson?.name || dashboardData?.user?.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-500 truncate">Salesperson ID</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{dashboardData?.salesperson?.salespersonId}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-500 truncate">Total Assigned QRs</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{qrs.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 block">
                    <h3 className="text-lg font-medium text-gray-500 truncate">QRs Available to Sell</h3>
                    <p className="mt-2 text-3xl font-semibold text-green-600">{availableQrs.length}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Register QR Sale</h3>
                <form onSubmit={handleRegisterSale} className="flex flex-col md:flex-row items-end gap-4">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="qrId" className="text-sm font-medium text-gray-700 mb-1">Select QR Code</label>
                        <select
                            id="qrId"
                            required
                            value={selectedQrId}
                            onChange={(e) => setSelectedQrId(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">-- Choose a QR to sell --</option>
                            {availableQrs.map(qr => (
                                <option key={qr.qrId} value={qr.qrId}>{qr.qrId}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col flex-1">
                        <label htmlFor="endUserEmail" className="text-sm font-medium text-gray-700 mb-1">End User Email</label>
                        <input
                            id="endUserEmail"
                            type="email"
                            required
                            placeholder="user@example.com"
                            value={endUserEmail}
                            onChange={(e) => setEndUserEmail(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isRegistering || availableQrs.length === 0}
                        className="bg-green-600 text-white font-medium px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300 h-[42px]"
                    >
                        {isRegistering ? 'Registering...' : 'Complete Sale'}
                    </button>
                </form>
                {availableQrs.length === 0 && (
                    <p className="mt-2 text-sm text-yellow-600 flex items-center">
                        No available QRs left to sell. Request more from an Admin.
                    </p>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Your Assigned QRs</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR ID (UUID)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End User Info</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {qrs.map((code) => {
                                const isSold = !!code.soldBySalesperson;
                                return (
                                    <tr key={code._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{code.qrId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${code.status === 'activated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {code.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isSold ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {isSold ? 'Sold' : 'Available'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {code.assignedToUser ? (
                                                <div>
                                                    <div className="font-medium text-gray-900">{code.assignedToUser.name}</div>
                                                    <div>{code.assignedToUser.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Not Assigned</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            {qrs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">You have no QRs assigned to you yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

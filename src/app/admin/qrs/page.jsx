"use client";
import React, { useState, useEffect } from 'react';
import { fetchQRCodes, generateQRCodes, fetchSalespersons } from '../api/adminApi';

export default function QRManagementPage() {
    const [qrCodes, setQrCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(50);
    const [salespersons, setSalespersons] = useState([]);
    const [selectedSalespersonId, setSelectedSalespersonId] = useState('');

    const fetchAndSetQRCodes = async () => {
        try {
            const response = await fetchQRCodes();
            setQrCodes(response.data);
            setError(null);
        } catch (err) {
            setError("Could not load data from the server.");
        }
    };

    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);
            await fetchAndSetQRCodes();
            try {
                const spRes = await fetchSalespersons();
                setSalespersons(spRes.data);
            } catch (err) {
                console.error("Could not fetch salespersons", err);
            }
            setIsLoading(false);
        };
        initialLoad();
    }, []);

    const handleGenerateSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await generateQRCodes(quantity, selectedSalespersonId || null);
            alert(response.data.message);
            await fetchAndSetQRCodes();
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during generation.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-gray-600 animate-pulse">Loading QR Data...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">QR Code Management</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Generate New QR Codes</h3>
                <form onSubmit={handleGenerateSubmit} className="flex items-end gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min="1"
                            max="10000"
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="salesperson" className="text-sm font-medium text-gray-700 mb-1">Assign To Salesperson (Optional)</label>
                        <select
                            id="salesperson"
                            value={selectedSalespersonId}
                            onChange={(e) => setSelectedSalespersonId(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
                        >
                            <option value="">None</option>
                            {salespersons.map(sp => (
                                <option key={sp._id} value={sp.userId}>{sp.name} ({sp.salespersonId})</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 h-[42px]"
                    >
                        {isLoading ? 'Processing...' : 'Generate Codes'}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Existing QR Codes ({qrCodes.length})</h2>
                    {error && <p className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR ID (UUID)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Salesperson</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold By (ID)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {qrCodes.map((code) => (
                                <tr key={code._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{code.qrId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${code.status === 'activated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {code.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.assignedSalespersonId ? 'Yes' : <span className="text-gray-400 italic">No</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.assignedToUser?.email || <span className="text-gray-400 italic">Unassigned</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.soldBySalesperson?.email || code.soldBySalesperson?._id || <span className="text-gray-400 italic">Not Sold</span>}</td>
                                </tr>
                            ))}
                            {qrCodes.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No QR codes found. Generate some above.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

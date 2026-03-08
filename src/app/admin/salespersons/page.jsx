"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchSalespersons, createSalesperson } from '../api/adminApi';

export default function SalespersonPage() {
    const [salespersons, setSalespersons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [newSalespersonId, setNewSalespersonId] = useState('');
    const [newContact, setNewContact] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const fetchAndSetSalespersons = async () => {
        try {
            const response = await fetchSalespersons();
            setSalespersons(response.data);
        } catch (err) {
            setError("Could not load salesperson data.");
        }
    };

    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);
            await fetchAndSetSalespersons();
            setIsLoading(false);
        };
        initialLoad();
    }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createSalesperson({ name: newName, salespersonId: newSalespersonId, contactNumber: newContact, email: newEmail, password: newPassword });
            alert(`Salesperson "${newName}" created successfully!`);
            setNewName(''); setNewSalespersonId(''); setNewContact(''); setNewEmail(''); setNewPassword('');
            await fetchAndSetSalespersons();
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-gray-600 animate-pulse">Loading Salesperson Data...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Salesperson Management</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Add New Salesperson</h3>
                <form onSubmit={handleAddSubmit} className="max-w-2xl mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson ID * (e.g. JAIPUR01)</label>
                            <input
                                type="text"
                                value={newSalespersonId}
                                onChange={(e) => setNewSalespersonId(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500 uppercase placeholder-gray-400"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gmail Address *</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                                placeholder="name@gmail.com"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <input
                                type="text"
                                value={newContact}
                                onChange={(e) => setNewContact(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password *</label>
                            <input
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-green-600 text-white font-medium px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
                    >
                        {isLoading ? 'Saving...' : 'Add Salesperson'}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Existing Salespersons ({salespersons.length})</h2>
                    {error && <p className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">QRs Assigned</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">QRs Sold</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Avg/Day</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salespersons.map((sp) => (
                                <tr key={sp._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/admin/salespersons/${sp._id}`} className="text-blue-600 hover:text-blue-800 hover:underline">{sp.name}</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono bg-gray-50">{sp.salespersonId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sp.contactNumber || <span className="text-gray-400 italic">N/A</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-700">{sp.totalAssigned ?? '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-green-700">{sp.totalSold ?? '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{sp.avgPerDay ?? '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sp.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {sp.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {salespersons.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No salespersons registered yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

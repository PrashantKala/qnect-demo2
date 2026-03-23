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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (qrId) => {
        setSelectedQrId(qrId);
        setEndUserEmail('');
        setFirstName('');
        setLastName('');
        setMobileNumber('');
        setVehicleNumber('');
        setAddress('');
        setPassword('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedQrId('');
        setEndUserEmail('');
        setFirstName('');
        setLastName('');
        setMobileNumber('');
        setVehicleNumber('');
        setAddress('');
        setPassword('');
    };

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

    // Auto-generate password: first 4 letters of firstName (lowercase) + first 4 digits of mobile
    useEffect(() => {
        const namePart = (firstName || '').replace(/[^a-zA-Z]/g, '').slice(0, 4).toLowerCase();
        const mobilePart = (mobileNumber || '').replace(/\D/g, '').slice(0, 4);
        const generated = namePart + mobilePart;
        if (generated) setPassword(generated);
    }, [firstName, mobileNumber]);

    const handleRegisterSale = async (e) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            const response = await registerQRSale(selectedQrId, {
                endUserEmail,
                firstName,
                lastName,
                mobileNumber,
                vehicleNumber,
                address,
                password
            });
            alert(response.data.message);
            closeModal();
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">Your Assigned QRs</h2>
                    {availableQrs.length === 0 && (
                        <p className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-md border border-yellow-100 flex items-center font-medium">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            No available QRs left to sell. Request more from Admin.
                        </p>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR ID (UUID)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End User Info</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                                                    <div className="font-medium text-gray-900">{code.assignedToUser.name || code.assignedToUser.firstName}</div>
                                                    <div>{code.assignedToUser.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button
                                                onClick={() => openModal(code.qrId)}
                                                disabled={isSold}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${isSold
                                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                    : 'bg-white text-green-600 border-green-200 hover:bg-green-50 shadow-sm'
                                                    }`}
                                            >
                                                {isSold ? 'Registered' : 'Register'}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {qrs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">You have no QRs assigned to you yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative border border-gray-100">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Register QR Sale
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">Assigning QR Code: <br /><span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 text-xs break-all mt-1 inline-block">{selectedQrId}</span></p>

                        <form onSubmit={handleRegisterSale} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="endUserEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input
                                    id="endUserEmail"
                                    type="email"
                                    required
                                    value={endUserEmail}
                                    onChange={(e) => setEndUserEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile No *</label>
                                    <input
                                        id="mobileNumber"
                                        type="text"
                                        required
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">Vehicle No *</label>
                                    <input
                                        id="vehicleNumber"
                                        type="text"
                                        required
                                        value={vehicleNumber}
                                        onChange={(e) => setVehicleNumber(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 uppercase"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    id="address"
                                    rows="2"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input
                                    id="password"
                                    type="text"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 font-mono"
                                    placeholder="Auto-generated from name + mobile"
                                />
                                <p className="text-xs text-gray-400 mt-1">First 4 letters of name + first 4 digits of mobile (editable)</p>
                            </div>

                            <p className="mt-1 text-xs text-gray-500 italic">If this email doesn't exist, an account will be created. The password will be emailed to the user.</p>

                            <div className="mt-8 flex gap-3 justify-end pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isRegistering || !endUserEmail}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:bg-green-300 flex items-center shadow-sm"
                                >
                                    {isRegistering ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Registering...
                                        </>
                                    ) : 'Complete Sale'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

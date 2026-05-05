"use client";
import React, { useState, useEffect } from 'react';
import { fetchQueries, updateQueryStatus } from '../api/adminApi';

export default function QueryManagementPage() {
    const [queries, setQueries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'answered'
    const [expandedId, setExpandedId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        loadQueries();
    }, []);

    const loadQueries = async () => {
        try {
            const response = await fetchQueries();
            setQueries(response.data);
        } catch (err) {
            setError("Could not load queries.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusToggle = async (queryId, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'answered' : 'pending';
        setUpdatingId(queryId);
        try {
            const response = await updateQueryStatus(queryId, newStatus);
            setQueries(prev => prev.map(q => q._id === queryId ? response.data : q));
        } catch (err) {
            console.error("Failed to update query status", err);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredQueries = queries.filter(q => {
        // Status filter
        if (statusFilter !== 'all' && q.status !== statusFilter) return false;
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const name = q.user
                ? `${q.user.firstName || ''} ${q.user.lastName || ''}`.trim().toLowerCase()
                : (q.name || '').toLowerCase();
            const email = q.user ? (q.user.email || '').toLowerCase() : (q.email || '').toLowerCase();
            return (
                name.includes(term) ||
                email.includes(term) ||
                (q.title || '').toLowerCase().includes(term) ||
                (q.description || '').toLowerCase().includes(term)
            );
        }
        return true;
    });

    const pendingCount = queries.filter(q => q.status === 'pending').length;
    const answeredCount = queries.filter(q => q.status === 'answered').length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-gray-600 animate-pulse">Loading Queries...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">User Queries</h1>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600">Total: <span className="font-bold text-gray-900">{queries.length}</span></span>
                </div>
                <div className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-gray-600">Pending: <span className="font-bold text-yellow-700">{pendingCount}</span></span>
                </div>
                <div className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600">Answered: <span className="font-bold text-green-700">{answeredCount}</span></span>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Status filter tabs */}
                        {['all', 'pending', 'answered'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors capitalize ${
                                    statusFilter === tab
                                        ? tab === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                            : tab === 'answered'
                                            ? 'bg-green-100 text-green-800 border-green-300'
                                            : 'bg-blue-100 text-blue-800 border-blue-300'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                {tab} {tab === 'pending' ? `(${pendingCount})` : tab === 'answered' ? `(${answeredCount})` : `(${queries.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email, or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                {error && <div className="p-4 bg-red-50 border-b border-red-200"><p className="text-sm text-red-600 font-medium">{error}</p></div>}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredQueries.map((q) => {
                                const fromName = q.user
                                    ? `${q.user.firstName || ''} ${q.user.lastName || ''}`.trim()
                                    : (q.name || 'Guest');
                                const fromEmail = q.user ? q.user.email : (q.email || '—');
                                const fromMobile = q.mobile || '—';
                                const location = [q.city, q.state].filter(Boolean).join(', ') || '—';
                                const isExpanded = expandedId === q._id;

                                return (
                                    <React.Fragment key={q._id}>
                                        <tr
                                            className={`hover:bg-gray-50 transition-colors cursor-pointer ${q.status === 'pending' ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-transparent'}`}
                                            onClick={() => setExpandedId(isExpanded ? null : q._id)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${q.user ? 'bg-blue-500' : 'bg-gray-400'}`}>
                                                        {fromName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{fromName}</p>
                                                        <p className="text-xs text-gray-500">{fromEmail}</p>
                                                        {fromMobile !== '—' && <p className="text-xs text-gray-400">{fromMobile}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{q.title}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-xs mt-0.5">{q.description}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(q.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {new Date(q.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    q.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {q.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleStatusToggle(q._id, q.status)}
                                                    disabled={updatingId === q._id}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors disabled:opacity-50 ${
                                                        q.status === 'pending'
                                                            ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100'
                                                    }`}
                                                >
                                                    {updatingId === q._id
                                                        ? '...'
                                                        : q.status === 'pending'
                                                        ? '✓ Mark Answered'
                                                        : '↩ Reopen'}
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Expanded detail row */}
                                        {isExpanded && (
                                            <tr className="bg-blue-50/50">
                                                <td colSpan="6" className="px-6 py-5">
                                                    <div className="max-w-3xl">
                                                        <h4 className="text-sm font-bold text-gray-800 mb-2">{q.title}</h4>
                                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{q.description}</p>
                                                        <div className="flex gap-4 mt-4 text-xs text-gray-500">
                                                            <span>Source: <span className="font-medium">{q.user ? 'Logged-in User' : 'Guest'}</span></span>
                                                            <span>Submitted: <span className="font-medium">{new Date(q.createdAt).toLocaleString()}</span></span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {filteredQueries.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className="font-medium">{searchTerm || statusFilter !== 'all' ? 'No queries match your filters.' : 'No queries submitted yet.'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

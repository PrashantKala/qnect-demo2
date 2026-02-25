"use client";
import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchQRCodes, fetchSalespersons } from './api/adminApi';

const StatCard = ({ title, value, colorClass }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 ${colorClass} flex-1 min-w-[240px] transition-transform hover:-translate-y-1 hover:shadow-md duration-300`}>
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="mt-2 text-4xl font-bold text-gray-800">{value}</p>
    </div>
);

export default function DashboardPage() {
    const [stats, setStats] = useState({ users: 0, qrs: 0, salespersons: 0, activatedQRs: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                // Fetch all data in parallel
                const [usersRes, qrsRes, salespersonsRes] = await Promise.all([
                    fetchUsers(),
                    fetchQRCodes(),
                    fetchSalespersons()
                ]);

                const activated = qrsRes.data.filter(qr => qr.status === 'activated').length;

                setStats({
                    users: usersRes.data.length,
                    qrs: qrsRes.data.length,
                    salespersons: salespersonsRes.data.length,
                    activatedQRs: activated
                });
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-gray-600 animate-pulse">Loading Dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
            <div className="flex flex-wrap gap-6">
                <StatCard title="Total Users" value={stats.users} colorClass="border-blue-500" />
                <StatCard title="Total QRs Generated" value={stats.qrs} colorClass="border-cyan-500" />
                <StatCard title="QRs Activated" value={stats.activatedQRs} colorClass="border-green-500" />
                <StatCard title="Sales Team Size" value={stats.salespersons} colorClass="border-yellow-500" />
            </div>
        </div>
    );
}

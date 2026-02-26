import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const SalesAnalyticsWidget = () => {
    const { user } = useAuth();

    const totalEarnings = user?.earnings || 0;
    const totalSales = user?.totalSales || 0;

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Sales Summary</h3>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-700">${totalEarnings.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Total Sales</p>
                    <p className="text-3xl font-bold text-blue-700">{totalSales}</p>
                    <p className="text-xs text-blue-500 mt-1">items sold</p>
                </div>
            </div>

            {totalSales === 0 && (
                <div className="mt-6 text-center py-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">No sales yet. Upload photos and set prices to start earning!</p>
                </div>
            )}
        </div>
    );
};

export default SalesAnalyticsWidget;

import React, { useState } from 'react';
import { FiFilter, FiDollarSign, FiCalendar } from 'react-icons/fi';

const SellerPayoutDetail = () => {
    // State for date range filter
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    // State for calculated amounts
    const [calculatedAmounts, setCalculatedAmounts] = useState({});

    // Dummy seller data
    const [sellers, setSellers] = useState([
        { id: 'SELL001', name: 'Fashion Hub', orders: 24, amount: null, paid: false },
        { id: 'SELL002', name: 'Tech Gadgets', orders: 15, amount: null, paid: false },
        { id: 'SELL003', name: 'Home Decor', orders: 32, amount: null, paid: false },
        { id: 'SELL004', name: 'Beauty Care', orders: 8, amount: null, paid: false },
        { id: 'SELL005', name: 'Sports Gear', orders: 19, amount: null, paid: false },
    ]);

    // Handle date range change
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Calculate amount for a seller
    const calculateAmount = (sellerId) => {
        // Dummy calculation logic - replace with your actual calculation
        const seller = sellers.find(s => s.id === sellerId);
        const amount = seller.orders * 25; // Assuming $25 per order

        setCalculatedAmounts(prev => ({
            ...prev,
            [sellerId]: amount
        }));

        // Update the sellers array
        setSellers(prev => prev.map(seller =>
            seller.id === sellerId ? { ...seller, amount } : seller
        ));
    };

    // Handle payout for a seller
    const handlePayout = (sellerId) => {
        setSellers(prev => prev.map(seller =>
            seller.id === sellerId ? { ...seller, paid: true } : seller
        ));
        alert(`Payout processed for seller ${sellerId}`);
    };

    // Filter sellers based on date range (dummy implementation)
    const filteredSellers = sellers; // In real app, filter by date

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Payouts</h1>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-700">Filter Payouts</h2>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="start"
                                    value={dateRange.start}
                                    onChange={handleDateChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="relative flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="end"
                                    value={dateRange.end}
                                    onChange={handleDateChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors">
                            <FiFilter /> Apply Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Payouts Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSellers.map((seller) => (
                                <tr key={seller.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seller.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seller.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seller.orders}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {seller.amount ? (
                                            <span className="font-semibold text-green-600">${seller.amount.toFixed(2)}</span>
                                        ) : (
                                            <span className="text-gray-400">Not calculated</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                                        {!seller.amount ? (
                                            <button
                                                onClick={() => calculateAmount(seller.id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Calculate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handlePayout(seller.id)}
                                                disabled={seller.paid}
                                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white ${seller.paid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                            >
                                                {seller.paid ? 'Paid' : 'Pay Now'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Card */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Sellers</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-900">{sellers.length}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <FiDollarSign size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-900">
                                {sellers.reduce((sum, seller) => sum + seller.orders, 0)}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <FiDollarSign size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Payout</p>
                            <p className="mt-1 text-3xl font-semibold text-gray-900">
                                ${sellers.reduce((sum, seller) => sum + (seller.amount || 0), 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <FiDollarSign size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerPayoutDetail;
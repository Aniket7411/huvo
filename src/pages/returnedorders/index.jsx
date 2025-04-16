import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { HttpClient } from '../../server/client/http';

const CancellationManagementPage = () => {

    const [returnsOrders, setReturnOrders] = useState([ ])


    const fetchReturnData = async () => {
        try {
            const response = await HttpClient.get("/return")
            console.log(response)

        } catch (error) {
            console.log(error?.message)
        }
    }


    useEffect(() => {
        fetchReturnData()
    }, [])


    const [orders, setOrders] = useState([
        {
            orderID: 'ORD-1001',
            username: 'john_doe',
            email: 'john@example.com',
            reason: 'Changed my mind',
            status: 'Refunded',
            amount: 1499,
            date: '2023-05-15'
        },
        {
            orderID: 'ORD-1002',
            username: 'jane_smith',
            email: 'jane@example.com',
            reason: 'Found better price elsewhere',
            status: 'Processing',
            amount: 2499,
            date: '2023-05-16'
        },
        {
            orderID: 'ORD-1003',
            username: 'robert_johnson',
            email: 'robert@example.com',
            reason: 'Product no longer needed',
            status: 'Cancelled',
            amount: 899,
            date: '2023-05-17'
        },
        {
            orderID: 'ORD-1004',
            username: 'sarah_williams',
            email: 'sarah@example.com',
            reason: 'Delivery time too long',
            status: 'Refunded',
            amount: 3299,
            date: '2023-05-18'
        },
        {
            orderID: 'ORD-1005',
            username: 'michael_brown',
            email: 'michael@example.com',
            reason: 'Wrong item ordered',
            status: 'Processing',
            amount: 1599,
            date: '2023-05-19'
        },
    ]);

    // State for filters and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort orders
    const filteredOrders = orders
        .filter(order => {
            const matchesSearch =
                order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'All' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Status options for filter
    const statusOptions = ['All', 'Processing', 'Refunded', 'Cancelled'];

    return (
        <div className="px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Cancellations</h1>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Username or Email"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        <FiFilter />
                        Filters
                        {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    {statusOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('orderID')}
                                >
                                    Order ID
                                    {sortConfig.key === 'orderID' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('username')}
                                >
                                    Username
                                    {sortConfig.key === 'username' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cancellation Reason
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('status')}
                                >
                                    Status
                                    {sortConfig.key === 'status' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('amount')}
                                >
                                    Amount
                                    {sortConfig.key === 'amount' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('date')}
                                >
                                    Date
                                    {sortConfig.key === 'date' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.orderID} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        {order.orderID}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {order.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Refunded' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{order.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No cancelled orders found matching your criteria
                    </div>
                )}
            </div>

            {/* Pagination would go here */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                    <span className="font-medium">{filteredOrders.length}</span> results
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancellationManagementPage;
import React, { useState, useEffect } from 'react';
import Superadminheader from '../../components/superadminheader';
import SuperAdminNav from '../../components/superadminNavbar/superadminnav';
import { Link } from 'react-router-dom';

// Dummy data
const dummyPayouts = [
    {
        sellerEmail: 'john.doe@example.com',
        name: 'John Doe',
        orderName: 'Order #1234',
        payoutAmount: 1500,
        paymentStatus: 'Paid'
    },
    {
        sellerEmail: 'jane.smith@example.com',
        name: 'Jane Smith',
        orderName: 'Order #5678',
        payoutAmount: 2000,
        paymentStatus: 'Pending'
    },
    {
        sellerEmail: 'raj.kapoor@example.com',
        name: 'Raj Kapoor',
        orderName: 'Order #7890',
        payoutAmount: 2500,
        paymentStatus: 'Paid'
    },
];

const SellerPayout = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(dummyPayouts);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = dummyPayouts.filter(item =>
            item.sellerEmail.toLowerCase().includes(term) ||
            item.name.toLowerCase().includes(term) ||
            item.orderName.toLowerCase().includes(term)
        );
        setFilteredData(filtered);
    }, [searchTerm]);

    return (
        <div className='flex'>
            <div className='bg-[#E7EFFA] h-screen' >
                <SuperAdminNav />
            </div>
            <div className="w-full">

                <Superadminheader />
                <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Seller Payouts</h1>

            <input
                type="text"
                placeholder="Search by Email, Name or Order"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                        <th className="px-4 py-2 text-left">Seller Email</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Order Name</th>
                        <th className="px-4 py-2 text-left">Payout Amount (₹)</th>
                        <th className="px-4 py-2 text-left">Payment Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <Link to="/seller_payouts_details">
                                <td className="px-4 py-3">{item.sellerEmail}</td>
                                </Link>
                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3">{item.orderName}</td>
                                <td className="px-4 py-3 text-green-600 font-medium">₹{item.payoutAmount}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-sm font-semibold 
                                        ${item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'}`}>
                                        {item.paymentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-gray-500 py-6">No matching results</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

            </div>
        </div>
    );
};

export default SellerPayout;

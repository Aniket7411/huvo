import React, { useEffect, useState } from 'react';
import { HttpClient } from '../../server/client/http';
import { FaRupeeSign } from 'react-icons/fa';
import Loader from '../../components/loader';

const ReturnOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReturnData = async () => {
        try {
            setLoading(true);
            const response = await HttpClient.get("/return");
            const formattedData = response.returnedOrders.map(each => ({
                orderId: each?.orderId,
                reason: each?.reason,
                refundStatus: each?.refundStatus || 'Processing',
                refundAmount: each?.refundAmount || 0,
                returnDate: new Date(each?.returnDate),
                firstName: each?.userId?.firstName,
                lastName: each?.userId?.lastName,
                email: each?.userId?.email,
                phone: each?.userId?.phone,
                products: each?.products || []
            }));
            setOrders(formattedData);
            setFilteredOrders(formattedData);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch returns:', error);
            setError('Failed to load return data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturnData();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = orders.filter(order =>
            order.orderId.toLowerCase().includes(term) ||
            `${order.firstName} ${order.lastName}`.toLowerCase().includes(term) ||
            order.email.toLowerCase().includes(term)
        );
        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Order Returns</h2>
            <input
                type="text"
                placeholder="Search by Order ID, Name, or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px', width: '300px', marginBottom: '20px' }}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {
                loading ? <Loader/> :   <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Refund Status</th>
                        <th>Refund Amount</th>
                        <th>Return Date</th>
                        <th>Reason</th>
                    </tr>
                </thead>

                
                <tbody>
    {filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-100 transition duration-200">
                <td className="px-4 py-3 font-medium text-gray-700">{order.orderId}</td>
                <td className="px-4 py-3 text-gray-600">{order.firstName} {order.lastName}</td>
                <td className="px-4 py-3 text-blue-600">{order.email}</td>
                <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold 
                        ${order.refundStatus === 'Completed' ? 'bg-green-100 text-green-700' 
                        : order.refundStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-gray-100 text-gray-700'}`}>
                        {order.refundStatus}
                    </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-1 text-gray-800">
                    <span className="text-green-600"><FaRupeeSign /></span>
                    {order.refundAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-500">{order.returnDate.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-600">{order.reason}</td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                No matching results
            </td>
        </tr>
    )}
</tbody>

            </table>
            }

          
        </div>
    );
};

export default ReturnOrders;

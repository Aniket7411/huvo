import { Link, useParams } from "react-router-dom";
import Superadminheader from "../../components/superadminheader";
import { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import SuperAdminNav from "../../components/superadminNavbar/superadminnav";

const SellerPayoutsList = () => {
    const { id } = useParams();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSellerProducts = async () => {
        setLoading(true);
        const data = {
            from: fromDate,
            to: toDate,
            sellerId: id,
        };

        try {
            const response = await HttpClient.get("/order", data);
            const formattedData = response?.data.map((each) => ({
                orderId: each?.orderId,
                productId: each?.productId,
                productName: each?.productName,
                quantity: each?.quantity,
                amount: each?.amount,
                shippingfees: each?.shippingfees,
                sellerAmount: each?.sellerAmount,
                platformCharge: each?.platformCharge,
            }));
            setProducts(formattedData);
        } catch (error) {
            console.error("Error fetching seller products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate totals
    const totals = products.reduce((acc, product) => {
        return {
            totalAmount: acc.totalAmount + (product.amount || 0),
            totalShipping: acc.totalShipping + (product.shippingfees || 0),
            totalSellerAmount: acc.totalSellerAmount + (product.sellerAmount || 0),
            totalPlatformCharge: acc.totalPlatformCharge + (product.platformCharge || 0),
            totalQuantity: acc.totalQuantity + (product.quantity || 0),
        };
    }, {
        totalAmount: 0,
        totalShipping: 0,
        totalSellerAmount: 0,
        totalPlatformCharge: 0,
        totalQuantity: 0,
    });

    return (
        <>
            <div className="flex">
                <SuperAdminNav />
                <div className="container mx-auto px-4 py-2">
                    <Superadminheader />

                    <h1 className="text-2xl font-semibold mb-6 text-gray-800">Product Sold (Payment completed)</h1>

                    {/* Filter Section */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-2     items-end bg-white p-3 rounded-lg shadow">
                        <div className="w-full sm:w-auto">
                            <label className="block text-sm font-medium text-gray-700 ">From</label>
                            <input
                                type="date"
                                className="border rounded p-2 w-full"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="block text-sm font-medium text-gray-700 ">To</label>
                            <input
                                type="date"
                                className="border rounded p-2 w-full"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={getSellerProducts}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition w-full sm:w-auto disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Get Products'}
                        </button>
                    </div>

                    {/* Products Table */}
                    {products.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>

                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.orderId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.amount?.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.shippingfees?.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.sellerAmount?.toFixed(2)}</td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.platformCharge?.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <Link
                                                    to={`/tracking_order/${product?.orderId}/${product?.productId}`}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                                >
                                                    Track Order
                                                </Link>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-100 font-semibold">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan="2">Total</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totals.totalQuantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{totals.totalAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{totals.totalShipping.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{totals.totalSellerAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{totals.totalPlatformCharge.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-lg shadow">
                            <p className="text-gray-500">
                                {loading ? 'Loading data...' : 'Apply Date filters and click "Get Products" to see data.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SellerPayoutsList;
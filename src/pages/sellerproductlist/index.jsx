import Superadminheader from "../../components/superadminheader";

const SellerPayoutsList = () => {
    // Sample data - replace with your actual data source
    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            quantity: 2,
            image: "https://via.placeholder.com/50",
            orderedDate: "2023-05-10",
            deliveredDate: "2023-05-15",
            totalCost: 199.98
        },
        {
            id: 2,
            name: "Smart Watch",
            quantity: 1,
            image: "https://via.placeholder.com/50",
            orderedDate: "2023-05-12",
            deliveredDate: "2023-05-18",
            totalCost: 159.99
        },
        {
            id: 3,
            name: "Bluetooth Speaker",
            quantity: 3,
            image: "https://via.placeholder.com/50",
            orderedDate: "2023-05-15",
            deliveredDate: "2023-05-20",
            totalCost: 237.00
        },
    ];

    return (
        <>
            <Superadminheader />
            <div className="container mx-auto px-4 py-2">
                <h1 className="text-2xl font-bold mb-3">Product Sales</h1>

                {/* Table Header - hidden on mobile */}
                <div className="hidden md:flex bg-gray-100 rounded-t-lg p-4 font-medium">
                    <div className="w-12 flex-shrink-0">Sr No.</div>
                    <div className="w-1/4">Name</div>
                    <div className="w-16 text-center">Qty</div>
                    <div className="w-16">Image</div>
                    <div className="w-1/5">Ordered</div>
                    <div className="w-1/5">Delivered</div>
                    <div className="w-1/6 text-right">Total</div>
                </div>

                {/* Product List */}
                <div className="space-y-2">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="flex flex-col md:flex-row md:items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                            {/* Mobile view - stacked layout */}
                            <div className="md:hidden mb-2 font-medium">#{index + 1}</div>

                            {/* Desktop view - row layout */}
                            <div className="hidden md:block w-12 flex-shrink-0">{index + 1}</div>

                            <div className="md:w-1/4 font-medium mb-2 md:mb-0">
                                {product.name}
                            </div>

                            <div className="md:w-16 text-center mb-2 md:mb-0">
                                <span className="md:hidden text-gray-600 mr-2">Qty:</span>
                                {product.quantity}
                            </div>

                            <div className="md:w-16 mb-2 md:mb-0">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            </div>

                            <div className="md:w-1/5 text-sm mb-2 md:mb-0">
                                <span className="md:hidden text-gray-600 mr-2">Ordered:</span>
                                {new Date(product.orderedDate).toLocaleDateString()}
                            </div>

                            <div className="md:w-1/5 text-sm mb-2 md:mb-0">
                                <span className="md:hidden text-gray-600 mr-2">Delivered:</span>
                                {new Date(product.deliveredDate).toLocaleDateString()}
                            </div>

                            <div className="md:w-1/6 text-right font-medium">
                                <span className="md:hidden text-gray-600 mr-2">Total:</span>
                                ${product.totalCost.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary - optional */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div className="font-medium">Total Sales</div>
                        <div className="text-xl font-bold">
                            ${products.reduce((sum, product) => sum + product.totalCost, 0).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerPayoutsList;
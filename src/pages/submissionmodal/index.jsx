import React from 'react';
import Modal from 'react-modal';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const ProductSubmissionModal = ({ response, isOpen, onClose, onAddAnother }) => {
    if (!response) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-lg shadow-xl outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        >
            <div className="p-6 max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-green-600">
                        Product Added Successfully!
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Product Main Info */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Product Image */}
                    <div className="w-full md:w-1/3">
                        <img
                            src={response.bannerImage}
                            alt={response.name}
                            className="w-full h-auto rounded-lg object-cover"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-2/3">
                        <h3 className="text-xl font-bold mb-2">{response.name}</h3>
                        <p className="text-gray-600 mb-4">{response.description}</p>

                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="bg-blue-100 px-3 py-1 rounded-full">
                                <span className="font-medium">Product ID:</span> {response.productId}
                            </div>
                            <div className="bg-purple-100 px-3 py-1 rounded-full">
                                <span className="font-medium">Group:</span> {response.group}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="mb-4">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold">₹{response.price}</span>
                                <span className="text-lg text-gray-500 line-through">₹{response.actualPrice}</span>
                                <span className="text-green-600 font-medium">
                                    {Math.round((response.discount / response.actualPrice) * 100)}% OFF
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                (Incl. GST: ₹{response.cgst + response.sgst} | Shipping: ₹{response.shippingFee})
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Colors */}
                    <div>
                        <h4 className="font-bold mb-2">Colors</h4>
                        <div className="flex flex-wrap gap-2">
                            {response.colors.map((color, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color.colorCode }}
                                    />
                                    <span>{color.colorCode}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sizes & Stock */}
                    <div>
                        <h4 className="font-bold mb-2">Sizes & Stock</h4>
                        <div className="flex flex-wrap gap-3">
                            {response.sizes.map((size, index) => (
                                <div key={index} className="bg-gray-100 px-3 py-1 rounded">
                                    {size.size}: {size.stock} pcs
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Material & Care */}
                    <div>
                        <h4 className="font-bold mb-2">Material & Care</h4>
                        <p>{response.materialAndCare || 'Not specified'}</p>
                    </div>

                    {/* Return Policy */}
                    <div>
                        <h4 className="font-bold mb-2">Return Policy</h4>
                        <div className="flex items-center gap-2">
                            {response.isReturnable ? (
                                <>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>This product is returnable</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>This product is not returnable</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="text-sm text-gray-500 mb-6">
                    <p>Created: {new Date(response.createdAt).toLocaleString()}</p>
                    <p>Last Updated: {new Date(response.updatedAt).toLocaleString()}</p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={onAddAnother}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Add Another Product
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProductSubmissionModal;
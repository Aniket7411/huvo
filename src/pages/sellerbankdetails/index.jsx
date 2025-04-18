import React, { useState, useEffect } from 'react';
import { HttpClient } from '../../server/client/http';
import { toast } from 'react-toastify';
import Loader from '../../components/loader';
import Modal from 'react-modal';


const SellerBankForm = ({ existingData = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        account_number: '',
        ifsc: '',
        upiId: '',
    });

    const [isLoading, setIsLoading] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    const getBankDetails = async () => {
        setIsLoading(true)
        try {
            const response = await HttpClient.get("/sellerbank")
            setFormData({
                name: response?.data?.bankDetails?.accountHolderName,
                email: response?.data?.contactDetails?.email,
                contact: response?.data?.contactDetails?.contact,
                account_number: response?.data?.bankDetails?.accountNumber,
                ifsc: response?.data?.bankDetails?.ifscCode,
            })
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)

        }
    }


    useEffect(() => {
        getBankDetails()
    }, [])

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Account holder name is required';
        else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.contact.trim()) {
            newErrors.contact = 'Contact number is required';
        } else if (!/^\d{10}$/.test(formData.contact)) {
            newErrors.contact = 'Contact must be 10 digits';
        }

        if (!formData.account_number.trim()) {
            newErrors.account_number = 'Account number is required';
        } else if (!/^\d{9,18}$/.test(formData.account_number)) {
            newErrors.account_number = 'Account number must be 9-18 digits';
        }

        if (!formData.ifsc.trim()) {
            newErrors.ifsc = 'IFSC code is required';
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc.toUpperCase())) {
            newErrors.ifsc = 'IFSC must be 11 characters (e.g., ABCD0123456)';
        }

        return newErrors;
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'ifsc' ? value.toUpperCase() : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {

            const response = await HttpClient.post("/sellerbank", formData)
            toast.success(response?.message)

            if (!existingData) {
                setFormData({
                    name: '',
                    email: '',
                    contact: '',
                    account_number: '',
                    ifsc: '',
                    upiId: '',
                });
            }

            if (onSubmit) onSubmit(response.data);
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error?.response?.data?.message || error?.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const accountDeleteConfirm = async () => {
        try {

            const response = await HttpClient.delete("/sellerbank")
            setConfirmModal(false)

            
        } catch (error) {
            toast.error(error?.data?.message)
            setConfirmModal(false)
        }
    }


    return (

        <>

            {
                isLoading ? <div className='h-screen flex items-center justify-center'> <Loader /> </div> : <>
                    <form onSubmit={handleSubmit} className=" mx-auto px-6 pt-2 bg-white rounded-lg shadow-sm border border-gray-100">

                        <div className='flex items-center justify-between mb-2'>
                            <h2 className="text-xl font-semibold text-md md:text-xl  text-gray-800">Bank Account Details</h2>
                            <button
                                onClick={() => setConfirmModal(confirmModal)}
                                type="button"
                                className="bg-red-600 text-sm md:text-md hover:bg-red-700 text-white font-semibold px-2 py-1 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Delete Account
                            </button>
                        </div>
                        <Modal
                            isOpen={confirmModal}
                            contentLabel="Delete Account Confirmation"
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                        >
                            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Account</h2>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete your account? This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setConfirmModal(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={accountDeleteConfirm}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Modal>


                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Holder Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData?.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter full name as per bank"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors?.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData?.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="contact"
                                    value={formData?.contact}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="10-digit mobile number"
                                    maxLength="10"
                                />
                                {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Account Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="account_number"
                                    value={formData?.account_number}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.account_number ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="9-18 digit account number"
                                />
                                {errors?.account_number && <p className="mt-1 text-sm text-red-600">{errors?.account_number}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    IFSC Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="ifsc"
                                    value={formData?.ifsc}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors?.ifsc ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="ABCD0123456"
                                    maxLength="11"
                                />
                                {errors?.ifsc && <p className="mt-1 text-sm text-red-600">{errors?.ifsc}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    UPI ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="upiId"
                                    value={formData?.upiId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="yourname@upi"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`mt-4 mb-5 py-1 px-2 rounded-md text-white bg-[#011F4B] font-medium  transition-colors`}
                        >
                            Update Bank Details
                        </button>
                    </form>
                </>
            }
        </>



    );
};

export default SellerBankForm;
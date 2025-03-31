import React from 'react';
import { FaShippingFast, FaMoneyBillWave, FaUndo, FaQuestionCircle } from 'react-icons/fa';

const ShippingInfo = () => {
    const faqItems = [
        {
            question: "What are the delivery charges?",
            answer: (
                <>
                    <p>Delivery charge varies with each Seller.</p>
                    <p>Sellers incur relatively higher shipping costs on low value items. In such cases, charging a nominal delivery charge helps them offset logistics costs. Please check your order summary to understand the delivery charges for individual products.</p>
                    <p>For Products listed as Huvo Plus, a Rs 100 charge for delivery per item.</p>
                </>
            ),
            icon: <FaShippingFast className="text-blue-500" />
        },
        {
            question: "Timeline of X-Y business days?",
            answer: (
                <>
                    <p>It is possible that the Seller or our courier partners have a holiday between the day you placed your order and the date of delivery, which is based on the timelines shown on the product page. In this case, we add a day to the estimated date. Some courier partners and Sellers do not work on Sundays and this is factored in to the delivery dates.</p>
                    <p className="mt-2 font-semibold">What is the estimated delivery time?</p>
                    <p>Sellers generally procure and ship the items within the time specified on the product page. Business days exclude public holidays and Sundays.</p>
                    <p>Estimated delivery time depends on the following factors:</p>
                    <ul className="list-disc pl-5 mt-1">
                        <li>The Seller offering the product</li>
                        <li>Product's availability with the Seller</li>
                        <li>The destination to which you want the order shipped to and location of the Seller.</li>
                    </ul>
                </>
            ),
            icon: <FaShippingFast className="text-blue-500" />
        },
        {
            question: "Are there any hidden costs?",
            answer: (
                <p>There are NO hidden charges when you make a purchase on Huvo. List prices are final and all-inclusive. The price you see on the product page is exactly what you would pay.</p>
            ),
            icon: <FaMoneyBillWave className="text-green-500" />
        },
        {
            question: "Why does the estimated delivery time vary for each seller?",
            answer: (
                <>
                    <p>You have probably noticed varying estimated delivery times for sellers of the product you are interested in. Delivery times are influenced by product availability, geographic location of the Seller, your shipping destination and the courier partner's time-to-deliver in your location.</p>
                    <p className="mt-1">The estimated maximum timeframe is 15 Business days for the initial contact to the client.</p>
                </>
            ),
            icon: <FaQuestionCircle className="text-purple-500" />
        },
        {
            question: "Why is the CoD option not offered in my location?",
            answer: (
                <>
                    <p>Availability of CoD depends on the ability of our courier partner servicing your location to accept cash as payment at the time of delivery.</p>
                    <p className="mt-1">Our courier partners have limits on the cash amount payable on delivery depending on the destination and your order value might have exceeded this limit. Please enter your pin code on the product page to check if CoD is available in your location.</p>
                </>
            ),
            icon: <FaMoneyBillWave className="text-green-500" />
        },
        {
            question: "I need to return an item, how do I arrange for a pick-up?",
            answer: (
                <p>Returns are easy. Contact Us to initiate a return. You will receive a call explaining the process, once you have initiated a return.</p>
            ),
            icon: <FaUndo className="text-orange-500" />
        },
        {
            question: "I did not receive my order but got a delivery confirmation SMS/Email.",
            answer: (
                <p>In case the product was not delivered and you received a delivery confirmation email/SMS, report the issue within 7 days from the date of delivery confirmation for the seller to investigate.</p>
            ),
            icon: <FaQuestionCircle className="text-purple-500" />
        }
    ];

    return (
        <div className=" mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Shipping & Delivery Information</h1>

            <div className="space-y-6">
                {faqItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                                    <div className="text-gray-700 space-y-2">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h2 className="text-xl font-semibold mb-3 text-blue-800">Need more help?</h2>
                <p className="text-blue-700">Contact our customer support team for any additional questions about shipping and delivery.</p>
                <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                    Contact Support
                </button>
            </div>
        </div>
    );
};

export default ShippingInfo;
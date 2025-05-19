import React, { useState } from "react";
import { Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const subscriptionPlans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      image: "https://cdn-icons-png.flaticon.com/512/1828/1828543.png",
      description: "Basic features with limited capabilities",
      features: [
        "Unlimited products listing",
        "Basic analytics",
        "Email support"
      ],
      popular: false
    },
    {
      id: "silver",
      name: "Silver",
      price: "₹499/month",
      image: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
      description: "For growing businesses",
      features: [
        "Unlimited products listing",
        "Advanced analytics",
        "Priority email support",
        "Basic marketing tools"
      ],
      popular: false
    },
    {
      id: "gold",
      name: "Gold",
      price: "₹999/month",
      image: "https://cdn-icons-png.flaticon.com/512/2583/2583439.png",
      description: "For established sellers",
      features: [
        "Unlimited products listing",
        "Premium analytics",
        "24/7 chat support",
        "Advanced marketing tools",
        "Discount coupons"
      ],
      popular: true
    },
    {
      id: "platinum",
      name: "Platinum",
      price: "₹1999/month",
      image: "https://cdn-icons-png.flaticon.com/512/2583/2583467.png",
      description: "For high-volume sellers",
      features: [
        "Unlimited products listing",
        "Enterprise analytics",
        "Dedicated account manager",
        "All marketing features",
        "API access"
      ],
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    toast.info(`${subscriptionPlans.find(p => p.id === planId).name} plan selected`);
  };

  return (
    <div className=" bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <div className="mb-2">
          <h1 className="text-xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-3xl">
            Subscription Plans
          </h1>
          <p className="mt-2  mx-auto text-xl text-gray-500">
            Choose the plan that's right for your business
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-yellow-50 mb-2 border-l-4 border-yellow-400 p-4 mb-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Coming Soon</h3>
              <div className="mt-2 text-yellow-700">
                <p>This feature will be available soon. The cards below are for preview only and will be updated via API later.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative w-full sm:w-80 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 ${selectedPlan === plan.id
                  ? "ring-4 ring-blue-500"
                  : "hover:shadow-xl"
                } ${plan.popular ? "border-2 border-yellow-400" : "border border-gray-200"}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-bold rounded-bl-lg">
                  POPULAR
                </div>
              )}

              <div className="bg-white p-2">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                  <Switch
                    checked={selectedPlan === plan.id}
                    onChange={() => handlePlanSelect(plan.id)}
                    className={`${plan.popular ? 'bg-yellow-400' : ''}`}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-12 h-12 mb-2 object-contain"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/3767/3767084.png";
                    }}
                  />

                  <p className="text-3xl font-bold text-blue-600 mb-1">{plan.price}</p>

                  <p className="text-center text-gray-600 mb-1 px-2">{plan.description}</p>

                  <hr className="border-t border-gray-200 w-full my-1" />

                  <ul className="w-full mt-2 space-y-1 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-2 pb-2">
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-2 rounded-md font-medium transition-colors duration-200 ${selectedPlan === plan.id
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="mt-2 text-center">
            <button
              onClick={() => toast.info("This feature will be available soon!")}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-1 px-3 rounded-lg text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Stay Tuned
            </button>
            {/* <p className="mt-2 text-gray-500">
              You'll be redirected to our secure payment gateway
            </p> */}
          </div>
        )}

        {/* <div className="mt-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Options:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["Credit/Debit Cards", "Net Banking", "UPI Payments", "Wallet Payments", "EMI Options"].map((option, index) => (
              <div key={index} className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{option}</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Subscription;
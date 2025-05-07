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
      image: "https://example.com/free-icon.png",
      description: "Basic features with limited capabilities",
      features: [
        "5 products listing",
        "Basic analytics",
        "Email support"
      ]
    },
    {
      id: "silver",
      name: "Silver",
      price: "₹499/month",
      image: "https://example.com/silver-icon.png",
      description: "For growing businesses",
      features: [
        "50 products listing",
        "Advanced analytics",
        "Priority email support",
        "Basic marketing tools"
      ]
    },
    {
      id: "gold",
      name: "Gold",
      price: "₹999/month",
      image: "https://example.com/gold-icon.png",
      description: "For established sellers",
      features: [
        "200 products listing",
        "Premium analytics",
        "24/7 chat support",
        "Advanced marketing tools",
        "Discount coupons"
      ]
    },
    {
      id: "platinum",
      name: "Platinum",
      price: "₹1999/month",
      image: "https://example.com/platinum-icon.png",
      description: "For high-volume sellers",
      features: [
        "Unlimited products",
        "Enterprise analytics",
        "Dedicated account manager",
        "All marketing features",
        "API access"
      ]
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    toast.success(`${subscriptionPlans.find(p => p.id === planId).name} plan selected`);
  };

  const proceedToPayment = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }
    navigate(`/payment?plan=${selectedPlan}`);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Choose Your Subscription Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id}
            className={`border rounded-lg p-4 transition-all duration-300 ${
              selectedPlan === plan.id 
                ? "ring-2 ring-blue-500 shadow-lg" 
                : "hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <Switch 
                checked={selectedPlan === plan.id}
                onChange={() => handlePlanSelect(plan.id)}
              />
              <h2 className="text-xl font-semibold">{plan.name}</h2>
            </div>
            
            <div className="flex flex-col items-center">
              <img 
                src={plan.image} 
                alt={plan.name} 
                className="w-16 h-16 mb-3 object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/64?text=Plan";
                }}
              />
              
              <p className="text-2xl font-bold text-blue-600 mb-2">{plan.price}</p>
              
              <hr className="border-t border-gray-200 w-full my-2" />
              
              <p className="text-center text-gray-600 mb-3">{plan.description}</p>
              
              <ul className="space-y-2 mb-4 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-2 rounded-md ${
                  selectedPlan === plan.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 text-center">
          <button
            onClick={proceedToPayment}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
          >
            Proceed to Payment
          </button>
          <p className="mt-2 text-gray-500">
            You'll be redirected to our secure payment gateway
          </p>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Payment Options:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Credit/Debit Cards</li>
          <li>Net Banking</li>
          <li>UPI Payments</li>
          <li>Wallet Payments</li>
          <li>EMI Options Available</li>
        </ul>
      </div>
    </div>
  );
};

export default Subscription;
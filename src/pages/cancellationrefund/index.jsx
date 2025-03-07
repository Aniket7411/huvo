import React from "react";

const CancellationAndRefundPolicies = () => {
  return (
    <div className="bg-gray-100 p-6 md:p-10 rounded-lg shadow-lg">
      <h1 className="text-2xl mt-6 font-bold text-gray-800 mb-4">
        Cancellation and Refund Policies
      </h1>
      <p className="text-gray-700 mb-4">
        <strong>VRADAKART PRIVATE LIMITED</strong> believes in helping its
        customers as far as possible and has therefore a liberal cancellation
        policy. Under this policy:
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>
          Cancellations will be considered only if the request is made within 6-8
          days of placing the order. However, the cancellation request may not
          be entertained if the orders have been communicated to the
          vendors/merchants and they have initiated the process of shipping them.
        </li>
        <li>
          VRADAKART PRIVATE LIMITED does not accept cancellation requests for
          perishable items like flowers, eatables, etc. However,
          refund/replacement can be made if the customer establishes that the
          quality of the product delivered is not good.
        </li>
        <li>
          In case of receipt of damaged or defective items, please report the
          same to our Customer Service team. The request will, however, be
          entertained once the merchant has checked and determined the same at
          their own end. This should be reported within 6-8 days of receipt of
          the products.
        </li>
        <li>
          If you feel that the product received is not as shown on the site or as
          per your expectations, you must bring it to the notice of our customer
          service within 6-8 days of receiving the product. The Customer Service
          Team, after looking into your complaint, will take an appropriate
          decision.
        </li>
        <li>
          For complaints regarding products that come with a warranty from
          manufacturers, please refer the issue to them directly.
        </li>
        <li>
          In case of any refunds approved by <strong>VRADAKART PRIVATE LIMITED</strong>, it
          will take 6-8 days for the refund to be processed to the end customer.
        </li>
      </ul>
    </div>
  );
};

export default CancellationAndRefundPolicies;

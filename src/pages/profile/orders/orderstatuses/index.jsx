import React from 'react';

const OrderStatusTracker = (props) => {

    const { orderStatuses } = props

    console.log("orderStatuses", orderStatuses)

    const statusSequence = [
        'placed',
        'confirmed',
        'Dispatched',
        'Out for delivery',
        'Delivered'
    ];



    return (
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        {orderStatuses.map((item, index) => {
          const isCompleted = item.date !== null;
          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 p-3 rounded-lg shadow-sm transition-all duration-300 ${
                isCompleted
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className="font-semibold capitalize">{item.status}</span>
              {isCompleted && (
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
      

    );
};



export default OrderStatusTracker;
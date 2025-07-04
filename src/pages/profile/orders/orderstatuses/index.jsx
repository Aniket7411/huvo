import React from 'react';

const OrderStatusTracker = (props) => {
  const { orderStatuses } = props;

  console.log("orderStatuses", orderStatuses);

  const statusSequence = [
    'placed',
    'confirmed',
    'Dispatched',
    'Out for delivery',
    'Delivered',
  ];

  return (
    <div className="p-4">
      {(!orderStatuses || orderStatuses.length === 0) ? (
        <div className="text-center text-gray-600 text-lg font-semibold">
          No orders available
        </div>
      ) : (
        <div className="flex flex-col md:flex-row flex-wrap gap-4">
          {orderStatuses.map((item, index) => {
            const isCompleted = item.date !== null;
            return (
              <div
                key={index}
                className={`flex flex-col items-start md:flex-row md:items-center gap-2 p-4 rounded-lg shadow-md transition-all duration-300 ${
                  isCompleted
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
                style={{
                  flex: '1 1 calc(50% - 1rem)',
                  maxWidth: 'calc(50% - 1rem)',
                  minWidth: '250px',
                }}
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
      )}
    </div>
  );
};

export default OrderStatusTracker;

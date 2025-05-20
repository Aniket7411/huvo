import React from 'react';

const TrendingProductsHeading = props => {

    const { displayCategory } = props
    return (
        <div className="flex flex-col items-center w-full px-4 py-2">
            {/* Compact header with vibrant gradient */}
            <div className="w-full max-w-2xl">
                <h1 className="text-xl md:text-2xl font-bold text-center mb-1">
                    Trending products for{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                        {displayCategory}
                    </span>
                </h1>

                <p className="text-gray-600 text-sm md:text-base text-center">
                    Hot picks everyone's loving this week
                </p>

                {/* Optional decorative elements */}
                <div className="flex justify-center mt-2 space-x-2">
                    {['🔥', '✨', '🚀'].map((emoji, index) => (
                        <span key={index} className="text-xl opacity-80">{emoji}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendingProductsHeading;
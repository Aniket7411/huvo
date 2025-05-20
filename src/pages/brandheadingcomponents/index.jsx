import React from 'react';

const TrendingBrandsHeader = (props) => {
    const {category} = props
    return (
        <div className="flex flex-col items-center w-full px-4 py-3 bg-gradient-to-b from-gray-50 to-white">
            {/* Premium brand header with metallic gradient */}
            <div className="w-full max-w-2xl text-center">
                <div className="mb-2 flex justify-center space-x-2">
                    {['⭐', '🛍️', '⭐'].map((emoji, index) => (
                        <span key={index} className="text-xl opacity-90">{emoji}</span>
                    ))}
                </div>

                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-600 via-gray-800 to-black">
                       Trending Brands for {category}
                    </span>
                </h1>
                {/*                 
                <h2 className="text-lg md:text-xl font-medium text-gray-700 mb-3">
                    Trending <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">{displayCategory}</span> Collections
                </h2> */}

                <div className="flex justify-center">
                    <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default TrendingBrandsHeader;
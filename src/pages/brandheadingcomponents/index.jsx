import React from 'react';

const TrendingHeader = ({ category }) => {
    const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);

    return (
        <div className="flex flex-col items-center w-full px-4 py-2">
            {/* Compact header with blue gradient */}
            <div className="w-full max-w-2xl">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-1">
                    Trending Brands for{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                        {displayCategory}
                    </span>
                </h1>

                <p className="text-gray-600 text-sm md:text-base text-center">
                    Top picks for {displayCategory.toLowerCase()}
                </p>

                {/* Compact category pills */}
                {/* <div className="flex gap-2 justify-center">
          {['women', 'men', 'kids'].map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${cat === category.toLowerCase()
                ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div> */}
            </div>
        </div>
    );
};

export default TrendingHeader;
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function GroceriesHomeApplianceCollection() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data for categories
  const allCategories = [
    {
      _id: 1,
      name: "Fruits & Vegetables",
      group: [
        {
          name: "groceries-home-appliance",
          image: "https://via.placeholder.com/300x200.png?text=Fruits+%26+Vegetables"
        }
      ]
    },
    {
      _id: 2,
      name: "Home Appliances",
      group: [
        {
          name: "groceries-home-appliance",
          image: "https://via.placeholder.com/300x200.png?text=Home+Appliances"
        }
      ]
    },
    {
      _id: 3,
      name: "Beverages",
      group: [
        {
          name: "groceries-home-appliance",
          image: "https://via.placeholder.com/300x200.png?text=Beverages"
        }
      ]
    },
    {
      _id: 4,
      name: "Cleaning Essentials",
      group: [
        {
          name: "groceries-home-appliance",
          image: "https://via.placeholder.com/300x200.png?text=Cleaning+Essentials"
        }
      ]
    }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <>
      <section>
        <div   style={{
        backgroundImage: "url('assets/appliance.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }} className="lg:py-[35%] xl:py-[28%] px-[10%]">
          <div>
            <h2 className="font-[Quicksand] mb-5 z-[1] relative text-[#011F4B] text-center font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="bg-[#011F4B] text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] text-white px-6 py-3 sm:px-8 sm:py-4 opacity-90 rounded-md shadow-md">
                "When comfort meets convenience, in every appliance and grocery."
              </span>
            </h2>

            <p className="font-[Poppins] font-normal text-center text-[#0F0F0F]">
              From fresh groceries to modern appliances, we have everything for your home.
            </p>
            <p className="font-[Poppins] font-normal text-center text-[#0F0F0F]">
              Discover the perfect products for your kitchen, home, and everyday needs.
            </p>
          </div>
        </div>
      </section>

      <section className="px-[2%] md:px-[5%] py-5">
        <h2 className="font-[Quicksand] font-medium text-center text-[#011F4B] text-4xl mb-3">
          CATEGORIES
        </h2>
        <p className="font-[Poppins] font-normal text-[#949494] m-auto text-center w-full lg:w-[40%] mb-8">
          Explore a wide range of categories that suit your lifestyle. From groceries to home appliances, we have it all!
        </p>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Search products..."
            onChange={handleSearch}
            value={searchTerm}
            className="w-full md:w-[40%] p-3 border border-[#011F4B] rounded-md text-[#011F4B] focus:outline-none"
          />
        </div>

        <ul className="flex flex-wrap justify-center">
          {allCategories.length ? (
            allCategories
              .filter(category => category?.name.toLowerCase().includes(searchTerm))
              .map((category, i) => {
                const [groupDetails] = category?.group.filter((g) => g.name === "groceries-home-appliance");
                return (
                  <li key={i} className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[15%] m-1">
                    <Link to={`/collections?category=${category?._id}&group=groceries-home-appliance`}>
                      <div className="relative mb-2">
                        <img
                          className="h-[300px] object-cover w-full rounded-md"
                          src={groupDetails?.image}
                          alt={groupDetails?.name}
                        />
                        <p className="font-[Quicksand] absolute bottom-0 font-medium text-xl tracking-wide bg-[#969696A8] w-full text-center text-white py-1 px-2 uppercase">
                          {category?.name}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })
          ) : (
            <h2 className="font-[Quicksand] font-medium text-center text-4xl text-[#011F4B]">
              No Categories Available
            </h2>
          )}
        </ul>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 my-2">
          <div className="relative col-span-2">
            <Link to={`/collections?newArrival=true&group=groceries-home-appliance`}>
              <img src="https://via.placeholder.com/600x400.png?text=New+Arrivals" alt="New Arrivals" />
              <div className="absolute py-1 px-5 text-3xl md:text-5xl left-[5px] top-[72px] md:top-[50%] md:left-[25%] uppercase bg-[#000000A8] text-white text-center font-[Quicksand]">
                NEW ARRIVALS
              </div>
            </Link>
          </div>
          <div className="relative">
            <Link to={`/collections?discount=50&group=groceries-home-appliance`}>
              <img className="h-full object-cover" src="https://via.placeholder.com/600x400.png?text=50%+OFF" alt="50% Off" />
              <div className="absolute py-1 px-5 text-2xl top-[25px] md:text-5xl md:top-[50%] md:left-[12%] uppercase bg-[#000000A8] text-white text-center font-[Quicksand]">
                UPTO 50% OFF
              </div>
            </Link>
          </div>
        </div>

        {/* Uncomment for more load functionality */}
        {/* <button className="font-[Quicksand] font-medium text-xl text-[#011F4B] rounded-[3px] bg-white block m-auto py-[5px] px-5 border-2 border-[#011F4B] border-solid mt-4">
          LOAD MORE
        </button> */}
      </section>
    </>
  );
}

import React from "react";
import { CiStar } from "react-icons/ci";

export default function TrackOrder() {
  // const [progressValue,setprogressValue] = useState(0)
  return (
    <>
      <section className="font-[Poppins] px-5 sm:px-[5%] md:px-[11%] lg:px-[20%] xl:px-[30%] pt-[35%] sm:pt-[30%] md:pt-[15%] lg:pt-[12%] xl:pt-[10%] pb-5">
        <div className="border-2 border-solid border-[#D6CBCB] radius-[6px] px-10 py-5 mb-10">
          <div className="flex justify-between">
            <p className="text-[#474747] font-medium text-lg mb-2">
              ARRIVING MONDAY
            </p>
            <p className="text-[#878787] font-medium ">See all orders</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <img
              className="aspect-square object-contain"
              src="assets/checkout-girl.png"
              alt=""
            />
            <div>
              <p className="text-[#878787] font-medium ">Rate us</p>
              <div className="text-[#FFD233] flex gap-2 ">
                <CiStar /> <CiStar /> <CiStar /> <CiStar /> <CiStar />
              </div>
            </div>
          </div>
          <div className="w-full bg-[#959595] my-4 h-[1px] text-[#959595]"></div>
          {/* <div className='flex justify-center gap-5 sm:gap-[60px] mb-5'>
                <p className='font-medium active:text-[#011F4B] focus:text-[#011F4B] text-[#6A6A6A] '>Ordered </p>
                <p className='font-medium active:text-[#011F4B] focus:text-[#011F4B] text-[#6A6A6A] '>Shipped </p>
                <p className='font-medium active:text-[#011F4B] focus:text-[#011F4B] text-[#6A6A6A] '>Out for delivery </p>
                <p className='font-medium active:text-[#011F4B] focus:text-[#011F4B] text-[#6A6A6A] '>Delivered </p>
            </div>
            <div className='relative'>
            <progress max={100} value={progressValue} className='custom-progress-bar  !mb-8 !block !w-[80%] !m-auto'></progress>
            <div className='flex absolute gap-5 sm:gap-[123px] bottom-[-7px]'>
                <div onClick={()=>setprogressValue(0)} className='ml-[36px] h-[20px] w-[20px] rounded-full bg-[#011F4B]'></div>
                <div onClick={()=>setprogressValue(33.33)} className='h-[20px] w-[20px] rounded-full bg-[#011F4B]'></div>
                <div onClick={()=>setprogressValue(66.66)} className='h-[20px] w-[20px] rounded-full bg-[#011F4B]'></div>
                <div onClick={()=>setprogressValue(99.99)} className='h-[20px] w-[20px] rounded-full bg-[#011F4B]'></div>
            </div>
            </div> */}

          <div className="hidden sm:block">
            <div className="flex justify-center gap-5 sm:gap-[60px] mb-5">
              <p className="font-medium active:text-[#011F4B] focus:text-[#011F4B] text-[#6A6A6A] ">
                Ordered{" "}
              </p>
              <p className="font-medium active:text-[#011F4B] focus:text-[#011F4B] text-[#6A6A6A] ">
                Shipped{" "}
              </p>
              <p className="font-medium active:text-[#011F4B] focus:text-[#011F4B] text-[#6A6A6A] ">
                Out for delivery{" "}
              </p>
              <p className="font-medium active:text-[#011F4B] focus:text-[#011F4B] text-[#6A6A6A] ">
                Delivered{" "}
              </p>
            </div>
            <ol className="flex items-center w-full mb-5 ml-[40px]">
              <li className="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-[#011F4B] after:border-4 after:inline-block dark:after:border-blue-800">
                <span className="flex items-center justify-center w-[30px] h-[30px] bg-[#011F4B] rounded-full lg:w-[40px] lg:h-[40px] dark:bg-blue-800 shrink-0"></span>
              </li>
              <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700">
                <span className="flex items-center justify-center w-[30px] h-[30px] bg-gray-100 rounded-full lg:w-[40px] lg:h-[40px]  shrink-0"></span>
              </li>
              <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700">
                <span className="flex items-center justify-center w-[30px] h-[30px] bg-gray-100 rounded-full lg:w-[40px] lg:h-[40px]  shrink-0"></span>
              </li>
              
              {/* <li className="flex w-full items-center before:content-[''] before:w-full before:h-1 before:border-b before:border-gray-100 before:border-4 before:inline-block dark:before:border-gray-700">
                <span className="flex items-center justify-center w-[30px] h-[30px] bg-gray-100 rounded-full lg:w-[40px] lg:h-[40px]  shrink-0"></span>
              </li> */}
              <li className="flex items-center w-full">
                <span className="flex items-center justify-center w-[30px] h-[30px] bg-gray-100 rounded-full lg:w-[40px] lg:h-[40px]  shrink-0"></span>
              </li>
            </ol>
          </div>
          <div className="block sm:hidden my-5">
            <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700">
              <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-[#011F4B] rounded-full -start-4 "></span>
                <h3 className="font-medium leading-tight">Ordered </h3>
              </li>
              <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 "></span>
                <h3 className="font-medium leading-tight">Shipped</h3>
              </li>
              <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4   "></span>
                <h3 className="font-medium leading-tight">Out for delivery</h3>
              </li>
              <li className="ms-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4   "></span>
                <h3 className="font-medium leading-tight">Delivered</h3>
              </li>
            </ol>
          </div>

          <div className="flex justify-around flex-wrap gap-2 sm:gap-1">
            <button className="font-[Quicksand] w-full sm:w-auto text-[#555555] bg-[#F2F2F2] rounded-md border-[1px] border-solid border-black px-3 py-1 font-medium ">
              BUY AGAIN
            </button>
            <button className="font-[Quicksand] w-full sm:w-auto text-[#555555] bg-[#F2F2F2] rounded-md border-[1px] border-solid border-black px-3 py-1 font-medium ">
              SHARE TRACKING
            </button>
          </div>
        </div>
        <div className="border-2 border-solid border-[#D6CBCB] radius-[6px] px-10 py-5">
          <p className="text-[#474747] font-medium text-lg mb-2">
            ORDERS & RETURNS
          </p>
          <div className="mb-3">
            <p className="text-[#39AC25] font-medium ">Delivered </p>
            <p className="text-[#8A8A8A] font-medium text-sm mb-3">
              On Tue, 30 Jan
            </p>
            <div className="bg-[#F2F2F2] rounded-md p-2 flex gap-3">
              <img
                className="w-1/4 object-contain h-[100px]"
                src="assets/men-hoodie.png"
                alt=""
              />
              <div>
                <p className="text-[#595555] font-medium">Hoodie</p>
                <p className="text-[#8A8A8A] font-normal">On Tue, 30 Jan</p>
                <p className="text-[#8A8A8A] font-normal">
                  Size <span className="text-[#ffc0cb]">XL</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import React from "react";

import Superadminnavbar from "../superadminnavbar";
import "./layoutsuperadmin.css";

function Superadminlayout({ children }) {
  return ( 
    <>
      {/* <div className="flex h-screen">
      <div className="w-1/5 h-full bg-[#a0aec0] hidden lg:block "> 
        <Sidenavbar />
      </div>
      <div className="w-4/5 w-full lg:w-full">
        <Headeradmin  />
        {children}
      </div> */} 
 
        <div class="w-full h-screen flex">
          <nav
            class="hidden lg:block bg-[#a0aec0] h-screen px-0 sidenav"
            style={{
              width: "17%",
            }}
          >
            <Superadminnavbar />
          </nav>
          <div class="flex-1 flex flex-col">
            {/* <div class="z-10 headerMain">
              <Headeradmin />
            </div> */}
            <main role="main" class="mt-16 flex-1 mainDashboard"
            
            style={{overflowY:'auto'}}
            >
              {children}
            </main>
          </div>
        </div> 
    </>
  );
}

export default Superadminlayout;
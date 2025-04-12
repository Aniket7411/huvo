import React from "react";
import Headeradmin from "../headeradmin";
import Sidenavbar from "../sidenavbar";
import "./layout.css";

function AdminLayout({ children }) {
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
          class="hidden lg:block bg-[#ffff] w-1/6 h-screen px-0 sidenav"

        >
          <Sidenavbar />
        </nav>
        <div class="flex-1 flex flex-col">
            <Headeradmin />
          <main role="main" 

            style={{ overflowY: 'auto' }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;

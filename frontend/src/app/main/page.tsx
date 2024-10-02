"use client"


import MainPart from "../components/mainpart";
import Navbar from "../components/navbar/page";

function Main() {

  return (
    <div className="">
      <div className="max-w-[1450px] m-auto px-0 md:px-8 pb-5">
        <div className="px-4 md:px-0">
          <Navbar/>
        </div>
        
        <MainPart/>
      </div>
    </div>
  );
}

export default Main;
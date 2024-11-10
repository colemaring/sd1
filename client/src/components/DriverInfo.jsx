import React from "react";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";

function DriverInfo() {
  return (
    <div className="flex rounded-xl bg-[#f0f0f0] w-full h-full p-4 ">
      <div className="flex flex-col pl-2">
        <div className="rounded-full bg-[#d9d9d9] w-20 h-20 text-center"></div>
        <h1 className="text-5xl font-semibold mt-4 ">540</h1>
        <h2 className="text-center">Risk Score</h2>
      </div>
      <div className="flex flex-col relative">
        <div className="pt-1 relative pl-2">
          <h3 className="text-md">Current Driver</h3>
          <h1 className="text-2xl font-semibold">Jane Doe</h1>
          <h3 className="text-sm">phone</h3>
        </div>
        <div className="relative top-9 left-20">
          <h1 className="text-4xl font-bold">+1 (123) 123-1234</h1>
          <h2 className="text-md text-center">Contact Information</h2>
        </div>
      </div>
    </div>
  );
}

export default DriverInfo;

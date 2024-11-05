import React from 'react'
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";




function DriverInfo() {
  return (
    <div>
        <h2 className="text-center text-xl font-bold pt-2">Contact Information</h2>
        <div className='p-4'>
            <p className='flex pb-4'><BsTelephone className='pr-4 w-8 h-8'/> Phone</p>
            <p className='flex  pb-4'> <CiMail className='pr-4 w-8 h-8'/> Email</p>
            <p className='flex '> <RiUserLocationLine className='pr-4 w-8 h-8'/> Address</p>
        </div>
    </div>
  )
}

export default DriverInfo
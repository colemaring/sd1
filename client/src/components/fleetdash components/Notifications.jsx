import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";

function Notifications() {
  const notifications = [
    {
      driver: "Ellie",
      alert: "going 60mph at a 40mph road",
      date: "04 April 2021 | 4:00 pm",
    },
    {
      driver: "Jenny",
      alert: "not wearing a seatbelt",
      date: "04 April 2021 | 3:00 pm",
    },
    {
      driver: "Adam",
      alert: "using his phone",
      date: "03 April 2021 | 5:00 pm",
    },
    // {
    //   driver: "Robert",
    //   alert: "not following the route",
    //   date: "04 April 2021 | 6:00 pm",
    // },
    // { driver: "Jack", alert: "smoking", date: "01 April 2021 | 3:00 pm" },
  ];

  return (
    <div className="h-full md:max-h-[100px]">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-start">Notifications</h1>
        <a href="#" className="text-green-400 text-md font-semibold">
          View All
        </a>
      </div>

      {notifications.map(({ driver, alert, date }) => (
        <div className=" bg-slate-100 p-2 rounded-xl mt-4" key={driver}>
          <div className="">
            <FaRegCircleUser className="float-start pr-2" size={30} /> {driver}{" "}
            is {alert}
          </div>
          <div className="text-md text-gray-400">{date}</div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;

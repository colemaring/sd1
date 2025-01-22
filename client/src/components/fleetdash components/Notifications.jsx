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
  ];

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-start text-foreground">
          Notifications
        </h1>
        <a
          href="#"
          className="text-md font-semibold hover:underline"
          style={{
            color: `hsl(var(--primary))`,
          }}
        >
          View All
        </a>
      </div>

      {/* Notifications List */}
      {notifications.map(({ driver, alert, date }) => (
        <div
          className="bg-card text-foreground p-2 rounded-xl mt-3 text-sm"
          key={driver}
        >
          <div className="flex items-center">
            <FaRegCircleUser className="pr-2" size={24} />
            <span className="font-medium">
              {driver} is {alert}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;

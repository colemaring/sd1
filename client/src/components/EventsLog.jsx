import React from "react";

function EventsLog() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold pt-2 pb-4">Event Log</h2>
      <table class="table table-striped">
        <thead className="text-sm">
          <tr>
            <th scope="col" className="text-gray-500 font-thin">
              DATE
            </th>
            <th scope="col" className="text-gray-500 font-thin">
              EVENT TYPE
            </th>
            <th scope="col" className="text-gray-500 font-thin">
              DURATION/LOCATION
            </th>
            <th scope="col" className="text-gray-500 font-thin">
              AI TYPE
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr>
            <td>03/10/24</td>
            <td>Speeding</td>
            <td>10 min</td>
            <td>Inside</td>
          </tr>
          <tr>
            <td>02/05/24</td>
            <td>Seatbelt</td>
            <td>15 min</td>
            <td>Inside</td>
          </tr>
          <tr>
            <td>01/12/24</td>
            <td>Lane Weaving</td>
            <td>Address</td>
            <td>Outside</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EventsLog;

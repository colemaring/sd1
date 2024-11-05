import React from 'react'

function EventsLog() {
  return (
<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Date of Event</th>
      <th scope="col">Event Type</th>
      <th scope="col">Duration/Location</th>
      <th scope="col">AI Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>03/10/24</td>
      <td>Speeding</td>
      <td>10 min</td>
      <td>Outside</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>03/10/24</td>
      <td>Speeding</td>
      <td>10 min</td>
      <td>Outside</td>
    </tr>    <tr>
      <th scope="row">3</th>
      <td>03/10/24</td>
      <td>Speeding</td>
      <td>10 min</td>
      <td>Outside</td>
    </tr>
  </tbody>
</table>  )
}

export default EventsLog
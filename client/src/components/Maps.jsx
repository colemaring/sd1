import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import ReactDOMServer from "react-dom/server";
import TruckInfo from "./TruckInfo";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const Maps = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCpXgZFps6pD6fIHR-vtK2n-FU9Yx42nmI",
  });

  const mapRef = useRef(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [marker, setMarker] = useState(null);

  // most of this was taken from maps api documentation
  useEffect(() => {
    if (isLoaded) {
      const myLatlng = new window.google.maps.LatLng(27.363882, -82.044922);
      const mapOptions = {
        zoom: 14,
        center: myLatlng,
      };

      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );

      // Create a marker
      const marker = new window.google.maps.Marker({
        position: myLatlng,
        icon: {
          url: "/assets/truck.png",
          scaledSize: new window.google.maps.Size(45, 35), // scaled size
        },
      });

      // Set the marker on the map
      marker.setMap(map);
      setMarker(marker);

      // Create an InfoWindow instance with TruckInfo component
      const infoWindowContent = ReactDOMServer.renderToString(<TruckInfo />);
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });
      setInfoWindow(infoWindow);

      // Open TruckInfo component when the marker is clicked
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      mapRef.current = map;
    }
  }, [isLoaded]);

  return isLoaded ? <div id="map" style={containerStyle}></div> : null;
};

export default Maps;

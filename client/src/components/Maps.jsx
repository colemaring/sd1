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
    googleMapsApiKey: "AIzaSyD1TG-X57XSAbU9rv1MLH2oThRbGnrPorU",
  });

  const mapRef = useRef(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      const myLatlng = new window.google.maps.LatLng(27.363882, -82.044922);
      const mapOptions = {
        zoom: 13,
        center: myLatlng,
      };

      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );

      const marker = new window.google.maps.Marker({
        position: myLatlng,
        icon: {
          url: "/assets/truck.png",
          scaledSize: new window.google.maps.Size(45, 35), // scaled size
        },
      });

      marker.setMap(map);
      setMarker(marker);

      const infoWindowContent = ReactDOMServer.renderToString(<TruckInfo />);
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });
      setInfoWindow(infoWindow);

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      mapRef.current = map;
    }
  }, [isLoaded]);

  return isLoaded ? <div id="map" style={containerStyle}></div> : null;
};

export default Maps;

import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",  // Adjust height as needed
};

const defaultCenter = {
  lat: 12.9716, // Default latitude (Example: Bengaluru)
  lng: 77.5946, // Default longitude
};

const GoogleMapComponent = ({ onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  // Handle map click to update marker position
  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newLocation);
    onLocationSelect(newLocation); // Pass location to parent component
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={15}
        onClick={handleMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;

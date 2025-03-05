import React, { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import SearchBar from "./SearchBar";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ClipboardPlus, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";



const TomTomMap = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [popup, setPopup] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null); // Store selected hospital
  const API_KEY = import.meta.env.VITE_TOM_TOM_API_KEY;
  const navigate = useNavigate();
  const url1=import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const mapInstance = tt.map({
      key: API_KEY,
      container: "map",
      center: [77.5946, 12.9716], // Bangalore default
      zoom: 10,
    });

    setMap(mapInstance);

    mapInstance.on("click", async (event) => {
      if (!mapInstance) return;

      const { lng, lat } = event.lngLat;

      try {
        // const response = await fetch(
        //   `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${API_KEY}`
        // );
        
        // const data = await response.json();

        const fetchPOI = async () => {
          const url = `https://api.tomtom.com/search/2/poiSearch/hospital.json?key=${API_KEY}&lat=${lat}&lon=${lng}&radius=100&limit=1`;

          try {
            const poiResponse = await fetch(url);
            const poiData = await poiResponse.json();
            // console.log("point of search");
            // console.log(poiData);
            

            if (poiData.results && poiData.results.length > 0) {
              const place = poiData.results[0];
              const object=poiData.results[0];
              // console.log("object");
              // console.log(object);
              const isRegistered = await checkHospitalInDatabase(place.id);

  
        setSelectedHospital({
          id: place.id, 
          name: place.poi.name,
          object: object,
          isRegistered, // New field to determine which button to show
        });
           
              // setSelectedHospital({ id: place.id, name: place.poi.name, address: address });
              // Remove existing marker and popup
              if (marker) marker.remove();
              if (popup) popup.remove();

              // Create new popup
              const newPopup = new tt.Popup({ offset: 25 })
                .setLngLat([lng, lat])
                .setHTML(`<h5>${place.poi.name}</h5>`)
                .addTo(mapInstance);

              // Add new marker
              const newMarker = new tt.Marker()
                .setLngLat([lng, lat])
                .addTo(mapInstance);

              setMarker(newMarker);
              setPopup(newPopup);
            } else {
              setSelectedHospital({ id: null, name: "No hospital found" ,
                object: null, address:""});

              // Show a message for creating a hospital
              if (popup) popup.remove();
              const newPopup = new tt.Popup({ offset: 25 })
                .setLngLat([lng, lat])
                .setHTML(`
                  <h5>No hospital found</h5>
                  
                `)
                .addTo(mapInstance);

              setPopup(newPopup);
            }
          } catch (error) {
            console.error("Error fetching POI details:", error);
          }
        };

        fetchPOI();
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    });

    return () => mapInstance.remove();
  }, []);

  const checkHospitalInDatabase = async (hospitalId) => {
    try {
      const response = await fetch(`${url1}/api/hospital/check/${hospitalId}`);
      const data = await response.json();
      console.log(data);
      return data.exists; // Assuming API returns { exists: true/false }
    } catch (error) {
      console.error("Error checking hospital:", error);
      return false;
    }
  };
  
  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${query}.json?key=${API_KEY}`
      );
      const data = await response.json();
  
      if (data.results.length > 0) {
        const { lat, lon } = data.results[0].position;
        const placeName = data.results[0].poi?.name || data.results[0].address.freeformAddress;
        const placeId = data.results[0].id || null;
        const object=data.results[0];
        console.log("object");
        console.log(object);
        
        const isRegistered = await checkHospitalInDatabase(placeId);
  
        setSelectedHospital({
          id: placeId,
          name: placeName,
          object: object, // Added new field to store the whole object of the searched place
          isRegistered, // New field to determine which button to show
        });
  
        // Remove existing marker and popup
        if (marker) marker.remove();
        if (popup) popup.remove();
  
        // Move map to searched location
        map.flyTo({ center: [lon, lat], zoom: 18 });
  
        // Create new popup
        const newPopup = new tt.Popup({ offset: 25 })
          .setLngLat([lon, lat])
          .setHTML(`<h6>${placeName}</h6>`)
          .addTo(map);
  
        // Add new marker
        const newMarker = new tt.Marker().setLngLat([lon, lat]).addTo(map);
  
        setMarker(newMarker);
        setPopup(newPopup);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

 

  const login = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
  
    const email = user.email;
    // Hook for navigation
  
    if (isAuthenticated) {
      try {
        // Check if admin exists
        const response = await fetch(`${url1}/api/admin/check/${email}`);
        const data = await response.json();
        // console.log(data);
        let adminId;
        if (data.exists) {
          console.log("Admin exists");
          console.log(selectedHospital.object);
          const result = selectedHospital.object;
          adminId = data.admin._id;
          const hospitalId = result.id;
      const name = result.poi.name;
      const address = [
        result.address?.streetName,
        result.address?.freeformAddress,
        result.address?.countrySubdivisionName,
        result.address?.country
      ].filter(Boolean).join(", ");

     console.log(address);
     console.log(name);
     console.log(hospitalId);


          navigate("/admin-dashboard", { state: {  hospitalId,name,address,email } });
        } else {
          console.log("Admin does not exist");
  
          // Register admin
          const res = await fetch(`${url1}/api/admin/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });
  
          const registerData = await res.json();
          const result = selectedHospital.object;
          const hospitalId = result.id;
      const name = result.poi.name;
      const address = [
        result.address?.streetName,
        result.address?.freeformAddress,
        result.address?.countrySubdivisionName,
        result.address?.country
      ].filter(Boolean).join(", ");


          navigate("/admin-dashboard", { state: {  hospitalId,name,address,email } });
        }
  
        // Redirect to Admin Dashboard with adminId and email as state
        
  
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  
  

  return (
    <div className="flex h-screen w-full p-10 pt-5 overflow-hidden">
      {/* Main Map Container */}
      <motion.div 
        className="flex-1 relative rounded-xl overflow-hidden shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        layout
      >
        <SearchBar onSelectLocation={handleSearch} />
        <div id="map" className="h-full w-full" />
      </motion.div>
  
      {/* Right Sidebar for Hospital Details */}
      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-1/4 ml-4"
          >
            <Card className="sticky top-5">
              <CardHeader>
                <CardTitle>Hospital Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <p className="text-lg font-medium">{selectedHospital.name}</p>
                  </div>
                  
                  {selectedHospital.isRegistered ? (
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/view-details/${selectedHospital.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={login}
                    >
                      <ClipboardPlus className="mr-2 h-4 w-4" />
                      Register Hospital
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TomTomMap;






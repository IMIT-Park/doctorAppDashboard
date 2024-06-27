import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Autocomplete,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { googleMapsApiKey } from "../../utils/NetworkHandler";
import IconSearch from "../../components/Icon/IconSearch";

const libraries = ["places"];

const defaultCenter = {
  lat: -33.8688,
  lng: 151.2195,
};

const GoogleLocationPicker = ({ data, setData }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator?.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        () => {
          console.error("Error fetching geolocation.");
        }
      );
    }

    if (data.googleLocation && data.googleLocation.lat && data.googleLocation.long) {
      const { lat, long } = data.googleLocation;
      const initialLocation = { lat, lng: long };
      setCenter(initialLocation);
      setMarker({ position: initialLocation });
      setLocation(initialLocation);
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    setMap(map);
    map.addListener("click", (event) => {
      const clickedLocation = {
        lat: event?.latLng?.lat(),
        lng: event?.latLng?.lng(),
      };
      setLocation(clickedLocation);
      setMarker({
        position: event?.latLng,
        placeId: null,
        formatted_address: null,
        name: null,
      });
      setInfoWindow({
        position: event?.latLng,
        content: {
          placeId: null,
          formatted_address: null,
          name: null,
        },
      });
    });
  }, []);

  const onPlaceChanged = () => {
    const place = autocomplete?.getPlace();
    if (!place?.geometry || !place?.geometry?.location) {
      console.log("No details available for input: '" + place?.name + "'");
      return;
    }
    const location = {
      lat: place?.geometry?.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setSelectedPlace(place);
    setMarker({
      position: place?.geometry?.location,
      placeId: place?.place_id,
      formatted_address: place?.formatted_address,
      name: place?.name,
    });
    setInfoWindow({
      position: place?.geometry?.location,
      content: {
        placeId: place?.place_id,
        formatted_address: place?.formatted_address,
        name: place?.name,
      },
    });
    setLocation(location);
    map.panTo(place?.geometry?.location);
    map.setZoom(13);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (location?.lat && location?.lng) {
      setData((prevData) => ({
        ...prevData,
        googleLocation: { lat: location.lat, long: location.lng },
      }));
    }
  }, [location]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => setAutocomplete(autocomplete)}
        onPlaceChanged={onPlaceChanged}
      >
        <div className="relative border border-white-dark/20  w-full max-w-96 my-2 flex m-auto">
          <button
            type="button"
            placeholder="Enter your Location"
            className="text-[#006241] m-auto p-3 flex items-center justify-center"
          >
            <IconSearch className="mx-auto w-5 h-5" />
          </button>
          <input
            id="pac-input"
            type="text"
            placeholder="Enter your Location"
            className="form-input border-0 border-l rounded-none bg-white  focus:shadow-[0_0_5px_2px_rgb(194_213_255_/_62%)] dark:shadow-[#1b2e4b] placeholder:tracking-wider focus:outline-none py-3"
            onKeyDown={handleKeyDown}
          />
        </div>
      </Autocomplete>

      {location?.lat && location?.lng && (
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full justify-center p-2">
          <div className="flex items-center gap-1">
            <p className="text-gray-500">Latitude:</p>
            <div className="text-slate-800 dark:text-slate-300">
              {location?.lat}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-gray-500">Longitude:</p>
            <div className="text-slate-800 dark:text-slate-300">
              {location?.lng}
            </div>
          </div>
        </div>
      )}
      <GoogleMap
        id="map"
        mapContainerClassName="w-full aspect-video"
        zoom={13}
        center={center}
        onLoad={onMapLoad}
      >
        {marker && <Marker position={marker.position} />}
        {infoWindow && (
          <InfoWindow position={infoWindow.position}>
            <div>
              <h2>{infoWindow.content.name}</h2>
              <p>Place ID: {infoWindow.content.placeId}</p>
              <p>{infoWindow.content.formatted_address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleLocationPicker;

import { showMessage } from "./showMessage";

export const handleGetLocation = (googleLocation) => {
  if (!googleLocation) {
    showMessage("Location information is not available", "error");
    return;
  }

  try {
    const decodedLocation = googleLocation.replace(/\\/g, "");

    const cleanedGoogleLocation =
      decodedLocation.startsWith('"') && decodedLocation.endsWith('"')
        ? decodedLocation.slice(1, -1)
        : decodedLocation;

    const locationData = JSON.parse(cleanedGoogleLocation);

    const cleanedLocationData = {};
    Object.keys(locationData).forEach((key) => {
      const trimmedKey = key.trim();
      cleanedLocationData[trimmedKey] = locationData[key];
    });

    const { lat, long } = cleanedLocationData;

    if (lat && long) {
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${long}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      showMessage("Invalid location data", "error");
    }
  } catch (error) {
    console.error("Failed to parse location data", error);
    showMessage("Invalid location data", "error");
  }
};

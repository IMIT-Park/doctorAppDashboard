import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  const [bookingDetails, setBookingDetails] = useState(() => {
    const savedBookingDetails = sessionStorage.getItem("bookingDetails");
    return savedBookingDetails ? JSON.parse(savedBookingDetails) : {
      doctor_id: null,
      clinic_id: null,
      patient_id: null,
      schedule_date: "",
      schedule_time: "",
      type: "walk in",
      DoctorTimeSlot_id: null,
    };
  });

  useEffect(() => {
    sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
  },[bookingDetails]);

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      setUserDetails(JSON.parse(userData));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, bookingDetails, setBookingDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

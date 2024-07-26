import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  const [ids, setIds] = useState(() => {
    const savedBookingDetails = localStorage.getItem("ids");
    return savedBookingDetails
      ? JSON.parse(savedBookingDetails)
      : {
          ownerId: null,
          clinicId: null,
          doctorId: null,
          salespersonId: null,
        };
  });

  const [bookingDetails, setBookingDetails] = useState(() => {
    const savedBookingDetails = localStorage.getItem("bookingDetails");
    return savedBookingDetails
      ? JSON.parse(savedBookingDetails)
      : {
          doctor_id: null,
          clinic_id: null,
          patient_id: null,
          schedule_date: "",
          schedule_time: "",
          DoctorTimeSlot_id: null,
          type: "walkin",
          whoIsBooking: "",
        };
  });

  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    localStorage.setItem("ids", JSON.stringify(ids));
  }, [ids]);

  useEffect(() => {
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
  }, [bookingDetails]);

  useEffect(() => {
    const patientData = localStorage.getItem("patientDetails");
    const convertedpatientData = JSON.parse(patientData);
    setPatientDetails(convertedpatientData);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUserDetails(JSON.parse(userData));
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        ids,
        setIds,
        userDetails,
        setUserDetails,
        bookingDetails,
        setBookingDetails,
        patientDetails,
        setPatientDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

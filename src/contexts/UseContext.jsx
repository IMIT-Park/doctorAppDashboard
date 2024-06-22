import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      setUserDetails(JSON.parse(userData));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

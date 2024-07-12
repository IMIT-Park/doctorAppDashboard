import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import NetworkHandler from "../../../utils/NetworkHandler";
import { useNavigate } from "react-router-dom";

const ClinicBookingDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  }, [dispatch]);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", {
      name,
      phoneNumber,
      dob,
      gender,
      address,
      remarks,
    });
    // Redirect or perform further actions after submission
    // Example:
    // navigate('/next-page');
  };

  return (
    <div>
      <ScrollToTop />

      <div className="panel flex justify-center items-center min-h-screen">
        <div className="w-full max-w-lg p-6 bg-[#fbfbfb] dark:bg-[#121c2c] rounded-lg shadow-lg">
          <h1 className="text-center font-bold text-2xl text-black mb-4 dark:text-[#fbfbfb]">
            Patient Details
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input form-input-green mb-4 px-3"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="form-input form-input-green mb-4 px-3"
              required
            />
            <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
              <div className="w-full mb-4 md:mb-0">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="form-input form-input-green px-3"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  placeholder="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-input form-input-green px-3"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input form-input-green mb-4 px-3 h-32"
              required
            ></textarea>
            <textarea
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="form-input form-input-green mb-4 px-3 h-20"
            ></textarea>
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-green inline-flex justify-center w-40 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style={{ fontSize: "19px" }}
                onClick={()=> navigate("/clinic/bookings/SelectorDoctor")}
              >
                Nextss
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicBookingDoctor;

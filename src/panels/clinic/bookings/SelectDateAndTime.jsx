import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const SelectDoctor = () => {
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
    console.log("Form submitted:", {
      name,
      phoneNumber,
      dob,
      gender,
      address,
      remarks,
    });
  };

  return (
    <div>
      <ScrollToTop />

      <div className="panel">
        <h1 className="text-center font-bold text-2xl text-black m-8 dark:text-[#fbfbfb]">
          Select Doctors
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap justify-center mb-6 space-x-4">
            <div className="mb-5">
              <Flatpickr
                // value={date1}
                options={{
                  dateFormat: "Y-m-d",
                  position:  "auto left",
                  inline:true,

                }}
                className="form-input"
                // onChange={(date) => setDate1(date)}
              />
            </div>
          </div>

          
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn btn-green inline-flex justify-center w-40 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{ fontSize: "19px" }}
              onClick={() =>
                navigate("/clinic/bookings/ClinicSelectDateAndTime")
              }
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectDoctor;

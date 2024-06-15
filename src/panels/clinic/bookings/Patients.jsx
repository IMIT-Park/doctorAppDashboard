import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Swal from "sweetalert2";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { Link, useLocation, useNavigate } from "react-router-dom";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";

const Patients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const previousUrl = location?.state?.previousUrl;

  useEffect(() => {
    dispatch(setPageTitle("Doctor"));
  });

  const showBlockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to block this Owner!",
      showCancelButton: true,
      confirmButtonText: "Block",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: "Blocked!",
          text: "The Owner has been blocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  const showUnblockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to unblock this Owner!",
      showCancelButton: true,
      confirmButtonText: "Unblock",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: "Unblocked!",
          text: "The Owner has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  const showAlert = (async) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Booked Successfull!",
      padding: "2em",
      customClass: "sweet-alerts",
    });
  };

  const [active, setActive] = useState(null);
  const [date1, setDate1] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [isTimeDisabled, setIsTimeDisabled] = useState(false);

  const togglePara = (value) => {
    setActive((oldValue) => (oldValue === value ? null : value));
  };

  const handleTimeSelection = (time) => {
    if (selectedTime === time) {
      setIsTimeDisabled((prev) => !prev);
    } else {
      setSelectedTime(time);
      setIsTimeDisabled(false);
    }
  };

  // const handleTimeSelection = (time) => {
  //   setSelectedTime(time);
  // };

  const handleBookNow = () => {
    showAlert();
    setSelectedTime(null);
  };

  return (
    <div>
      <ScrollToTop />
      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
        <ul className="flex space-x-2 rtl:space-x-reverse mb-2">
          <li>
            <Link to="/clinic/bookings" className="text-primary hover:underline">
              Doctors
            </Link>
          </li>
          <li className="before:content-['/'] before:mr-2">
            <Link to="/clinic/bookings/:doctor_id/patients" className="text-primary hover:underline">
              Patients
            </Link>
          </li>
          <li className="before:content-['/'] before:mr-2">
            <span>Booking</span>
          </li>
        </ul>
      </div>

      <div className="panel mb-1">
        {/* <div className="flex justify-between flex-wrap gap-4 sm:px-4">
          <div>
            <img
              src="/assets/images/profile-4.jpeg"
              alt="img"
              className="w-36 h-36 rounded-full object-cover mb-2"
            />
            <div className="text-2xl font-semibold capitalize">Doctor</div>
          </div>
          <label
            className="w-12 h-6 relative"
            onClick={(e) => {
              e.stopPropagation();
              showBlockAlert();
            }}
          >
            <input
              type="checkbox"
              className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
              id={`custom_switch_checkbox`}
              checked={true}
            />
            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
          </label>
        </div> */}
        <div className="text-left sm:px-4 mt-5">
          {" "}
          {/*mt-5 */}
          <div className="mt-5">
          <div className="text-2xl font-semibold capitalize mb-2">Patient</div> 
            <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
              <div className="text-white-dark">Address :</div>
              <div>13 Tetrick Road, Cypress Gardens, Florida, 33884, US</div>
            </div>
            <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
              <div className="text-white-dark">Email :</div>
              <div>vristo@gmail.com</div>
            </div>
            <div className="flex items-center sm:gap-2 flex-wrap">
              <div className="text-white-dark">Phone :</div>
              <div>+1 (070) 123-4567</div>
            </div>
            <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
              <div className="text-white-dark">Gender :</div>
              <div>Male</div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-4">
          <form className="w-full max-w-xs ml-auto flex justify-center">
            <div className="relative">
              <select className="form-select  bg-white  h-11 w-full sm:w-56 mt-6 mb-3 placeholder:tracking-wider ltr:pr-10 rtl:pl-11">
                <option value="">Choose The Type...</option>
                <option value="walkin">WalkIn</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </form>
        </div>
        
        <div className="w-11/13 border-t mx-auto my-4"></div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div className="border-gray-300 p-2 mb-4 w-full sm:w-max mt-5 md:order-1">
            <div className="border border-gray-300 p-2 mb-4 text-center w-full md:w-36  font-semibold">
              Select Date
            </div>
            <div className="flex items-start my-6 justify-center md:justify-start">
              <div className="form-input-wrapper  md:max-w-xs mx-auto md:mx-0">
                <Flatpickr
                  // value={date1}
                  placeholder="Select date"
                  onChange={(date) => setDate1(date)}
                  options={{
                    dateFormat: "Y-m-d",
                    position: "auto left",
                    inline: true,
                  }}
                  className="form-input"
                />
              </div>
            </div>
          </div>
          <div className=" border-gray-300 p-2 mb-4 w-full md:w-8/12 mt-5 mr-5 order-2 md:order-2 mx-auto md:mx-0">
            <div className="border border-gray-300 p-2 text-center mb-4 w-full lg:w-36 md:w-36 sm:w-80 font-semibold">
              Select Time
            </div>
            <div className="flex flex-col items-start my-6">
              <div className=" w-full p-2 pb-4">
                <div className="w-full sm:w-20 p-1 font-semibold text-lg">
                  Morning
                </div>

                <div className="flex flex-wrap gap-3 md:gap-3">
                  {[
                    "10:00 AM",
                    "10:30 AM",
                    "11:00 AM",
                    "11:30 AM",
                    "12:00 AM",
                    "12:30 AM",
                  ].map((time) => (
                    <div
                      key={time}
                      className={`p-3 w-24 h-10 mt-3 cursor-pointer text-center hover:bg-blue-500 ${
                        selectedTime === time && !isTimeDisabled
                          ? "bg-blue-500 text-white"
                          : ""
                      }`}
                      onClick={() => handleTimeSelection(time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start my-6">
              <div className=" w-full p-2 pb-4">
                <div className="w-full sm:w-20 p-1 font-semibold text-lg">
                  Afternoon
                </div>
                <div className="flex flex-wrap gap-3 md:gap-3">
                  {[
                    "1:00 PM",
                    "1:30 PM",
                    "2:00 PM",
                    "2:30 PM",
                    "3:00 PM",
                    "3:30 PM",
                    "4:00 PM",
                    "4:30 PM",
                    "5:00 PM",
                    "5:30 PM",
                    "6:00 PM",
                  ].map((time) => (
                    <div
                      key={time}
                      className={`p-3 w-24 h-10 mt-3 cursor-pointer text-center hover:bg-blue-500 ${
                        selectedTime === time && !isTimeDisabled
                          ? "bg-blue-500 text-white"
                          : ""
                      }`}
                      onClick={() => handleTimeSelection(time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start flex-wrap gap-2 ml-6">
              <div className="flex items-center gap-1 ">
                <div className="border p-2 bg-blue-500"></div>
                <div className="mr-3">Selected</div>
              </div>
              <div className="flex items-center gap-1 ">
                <div className="border p-2 bg-gray-300"></div>
                <div className="mr-3">Booked Slots</div>
              </div>
              <div className="flex items-center gap-1 ">
                <div className="border p-2 bg-black"></div>
                <div className="mr-3">Available Slots</div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="w-1 h-80 bg-gray-300 mx-4"></div> */}
        <div className="w-11/13 border-t mx-auto my-4"></div>
        <div className="mt-6">
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="btn btn-green"
              onClick={handleBookNow}
              // disabled={!selectedTime}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Swal from "sweetalert2";
import ScrollToTop from "../../../components/ScrollToTop";
import { useLocation, useNavigate } from "react-router-dom";

const Patients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const previousUrl = location?.state?.previousUrl;

  useEffect(() => {
    dispatch(setPageTitle("Doctor"));
  }, [dispatch]);

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
      text: "Booked Successfully!",
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

  const handleBookNow = () => {
    showAlert();
    setSelectedTime(null);
  };

  return (
    <div>
      <ScrollToTop />
      <div className="panel mb-1">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div className="border-gray-300 p-2 mb-4 w-full sm:w-max mt-5">
            <div className="border border-blue-300 rounded p-2 mb-4 text-center text-green-800 w-full md:w-36 font-semibold text-lg">
              Select Date
            </div>
            <div className="flex items-start my-6 justify-center md:justify-start">
              <div className="form-input-wrapper mt-5 md:max-w-xs mx-auto md:mx-0">
                <Flatpickr
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

          <div className="border-s mx-auto my-4"></div>

          <div className="border-gray-300 p-2 mb-4 w-full md:w-8/12 mt-5 mr-5 mx-auto md:mx-0">
            <div className="border border-blue-300 rounded p-2 text-center text-green-800 mb-4 w-full lg:w-40 md:w-36 sm:w-80 font-semibold text-lg">
              Select Timeslot
            </div>
            <div className="flex flex-col items-start my-6">
              <div className="w-full p-2 pb-4">
                <div className="flex flex-wrap gap-3 md:gap-3">
                  {["4:00 PM - 8:00 PM", "1:00 PM - 3:00 PM"].map((time) => (
                    <div
                      key={time}
                      className={`p-3 w-full sm:w-48 md:w-60 h-10 mt-3 cursor-pointer pb-8 rounded text-center border border-gray-300 hover:bg-green-100 ${
                        selectedTime === time && !isTimeDisabled
                          ? "bg-green-800 text-white"
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
              <div className="w-full p-2 pb-4">
                <div className="border border-blue-300 rounded p-2 text-center text-green-800 mb-4 w-full lg:w-40 md:w-36 sm:w-80 font-semibold text-lg">
                  Select Timeslot
                </div>
                <div className="flex flex-wrap text-base gap-3 md:gap-3">
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
                      className={`p-3 w-full sm:w-[calc(100%/2-0.5rem)] md:w-[calc(100%/3-0.5rem)] lg:w-[calc(100%/4-0.5rem)] xl:w-[calc(100%/6-0.5rem)] h-10 mt-3 cursor-pointer pb-8 rounded text-center border border-gray-300 hover:bg-green-100 ${
                        selectedTime === time && !isTimeDisabled
                          ? "bg-green-800 text-white"
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
                <div className="border p-2 bg-green-800"></div>
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

        <div className="mt-6">
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="btn btn-green"
              onClick={handleBookNow}
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

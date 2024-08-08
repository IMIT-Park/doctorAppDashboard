import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Swal from "sweetalert2";
import ScrollToTop from "../../../components/ScrollToTop";
import { useLocation, useNavigate } from "react-router-dom";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import { formatDate, reverseformatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import NetworkHandler from "../../../utils/NetworkHandler";
import IconLoader from "../../../components/Icon/IconLoader";
import { UserContext } from "../../../contexts/UseContext";
import { showMessage } from "../../../utils/showMessage";

const Patients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = localStorage.getItem("userData");
  const userData = JSON.parse(userDetails);

  const { bookingDetails, setBookingDetails } = useContext(UserContext);

  const clinicId =
    bookingDetails?.clinic_id || userData?.UserClinic[0]?.clinic_id;

  useEffect(() => {
    dispatch(setPageTitle("Booking"));
  }, [dispatch]);

  const [timeslotsLoading, setTimeslotsLoading] = useState(false);
  const [doctorTimeSlots, setDoctorTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [timeslotWarning, setTimeslotWarning] = useState(
    "Doctor is not available on this date."
  );
  const [bookingLoading, setBookingLoading] = useState(false);
  const [consultationWarning, setConsultationWarning] = useState("");
  const [bookingType, setBookingType] = useState("walkin");

  // fetch timeslots function
  const fetchTimeSlots = async (date) => {
    setConsultationWarning("");
    setTimeslotsLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/booking/getdoctordate/${bookingDetails?.doctor_id}`,
        {
          date: date,
          clinic_id: clinicId,
        }
      );

      const filteredTimeSlots = response?.data?.doctorTimeSlots.filter(
        (timeslot) => timeslot?.leave !== true
      );

      setDoctorTimeSlots(filteredTimeSlots);
    } catch (error) {
      if (error?.response?.status === 400) {
        setTimeslotWarning(
          error?.response?.data?.error
            ? error?.response?.data?.error
            : "Doctor is not available on this date."
        );
      } else {
        setTimeslotWarning("Doctor is not available on this date.");
      }
      setDoctorTimeSlots([]);
      console.error(error?.response?.data?.error);
    } finally {
      setTimeslotsLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId) {
      fetchTimeSlots(reverseformatDate(selectedDate));
    }
  }, [clinicId, selectedDate]);

  // timeslot select function
  const handleSelectTimeslot = (timeslot) => {
    setSelectedTimeSlot(timeslot);
  };

  const handleDateChange = (selectedDates) => {
    const date = selectedDates[0];
    setSelectedDate(reverseformatDate(date));
    setSelectedTimeSlot(null);
    setConsultations([]);
    setSelectedConsultation(null);
  };

  // fetch consultations function
  const fetchConsultations = async (date) => {
    setConsultationLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/booking/getconsulation/${bookingDetails?.doctor_id}`,
        {
          DoctorTimeSlot_id: selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id,
          date: date,
          clinic_id: clinicId,
        }
      );
      if (response?.data?.noOfConsultationsPerDay?.length > 0) {
        setConsultationWarning(
          "No available consultations for this day. Please select another day."
        );
      } else {
        setConsultations(response?.data?.consultationSlots);
        setConsultationWarning("");
      }
    } catch (error) {
      setConsultations([]);
      console.error(error?.response?.data?.error);
    } finally {
      setConsultationLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId && selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id) {
      fetchConsultations(reverseformatDate(selectedDate));
    }
  }, [selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id]);

  const handleSelectConsultation = (consultation) => {
    setSelectedConsultation(consultation);
  };

  const createBooking = async () => {
    if (!selectedTimeSlot) {
      showMessage("please select a timeslot !", "warning");
      return;
    }

    if (!selectedConsultation) {
      showMessage("please select a time !", "warning");
      return;
    }

    setBookingLoading(true);

    try {
      const { whoIsBooking, ...restBookingDetails } = bookingDetails;
      const bookingData = {
        ...restBookingDetails,
        schedule_date: reverseformatDate(selectedDate) || "",
        schedule_time: selectedConsultation?.slot || "",
        DoctorTimeSlot_id:
          selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id || null,
        type: bookingType,
      };

      const response = await NetworkHandler.makePostRequest(
        "/v1/booking/createBooking",
        bookingData
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Booking Added Successfully",
          padding: "2em",
          customClass: "sweet-alerts",
          confirmButtonColor: "#006241",
        });
        setTimeout(() => {
          navigate(
            bookingDetails?.whoIsBooking === "owner"
              ? "/owner/add-booking"
              : "/clinic/bookings"
          );
        }, 3000);
        setBookingDetails({
          doctor_id: null,
          clinic_id: null,
          patient_id: null,
          schedule_date: "",
          schedule_time: "",
          DoctorTimeSlot_id: null,
          type: "walkin",
          whoIsBooking: "",
          created_by: "",
        });
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Todays Booking Slots Filled!",
          text: "Todays Booking Slots Filled. Kindly Select Another date to book.",
          padding: "2em",
          customClass: "sweet-alerts",
          confirmButtonColor: "#006241",
        });
      }
      console.error(error?.response?.data?.error);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <ScrollToTop />
      <button
        onClick={() => navigate(-1)}
        type="button"
        className="btn btn-green btn-sm -mt-4 mb-2"
      >
        <IconCaretDown className="w-4 h-4 rotate-90" />
      </button>
      <div className="panel mb-1">
        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
          <label htmlFor="full-name">Booking Type :</label>
          <select
            id="bookingType"
            className={`form-select form-select-green h-10 max-w-32`}
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value)}
          >
            <option value="walkin">Walkin</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div className="border-gray-300 p-2 md:mb-4 w-full sm:w-max mt-5">
            <div className="border border-blue-300 dark:border-blue-900 rounded py-1 px-6 mb-4 text-center text-[#006241] font-semibold text-lg w-fit">
              Select Date
            </div>
            <div className="flex items-start md:my-6 justify-center md:justify-start">
              <div className="form-input-wrapper mt-5 md:max-w-xs mx-auto md:mx-0">
                <Flatpickr
                  placeholder="Select date"
                  options={{
                    defaultDate: selectedDate,
                    dateFormat: "d-m-Y",
                    position: "auto left",
                    inline: true,
                  }}
                  className="form-input"
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>

          <div className="border-s dark:border-slate-800 mx-auto md:my-4"></div>

          <div className="border-gray-300 p-2 mb-4 w-full md:w-8/12 mt-5 mr-5 mx-auto md:mx-0 flex flex-col items-start">
            <div className="border border-blue-300 dark:border-blue-900 rounded py-1 px-6 text-center text-[#006241] mb-6 font-semibold text-lg w-fit">
              Select Timeslot
            </div>
            {timeslotsLoading ? (
              <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
            ) : (
              <>
                {doctorTimeSlots && doctorTimeSlots?.length > 0 ? (
                  <>
                    <div className="flex flex-col items-start mb-4">
                      <div className="w-full pb-4">
                        <div className="flex flex-wrap gap-3 md:gap-3">
                          {doctorTimeSlots?.map((timeslot) => (
                            <div
                              key={timeslot?.timeSlot?.DoctorTimeSlot_id}
                              className={`border w-44 flex justify-center rounded py-2 border-slate-300 dark:border-slate-700 cursor-pointer font-semibold text-base ${
                                selectedTimeSlot?.timeSlot
                                  ?.DoctorTimeSlot_id ===
                                timeslot?.timeSlot?.DoctorTimeSlot_id
                                  ? "bg-green-800 text-white"
                                  : "text-slate-900 dark:text-slate-300"
                              }`}
                              onClick={() => handleSelectTimeslot(timeslot)}
                            >
                              {formatTime(timeslot?.timeSlot?.startTime)} -{" "}
                              {formatTime(timeslot?.timeSlot?.endTime)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {consultationLoading ? (
                      <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
                    ) : (
                      <>
                        {consultations && consultations?.length > 0 ? (
                          <>
                            <div className="border border-blue-300 dark:border-blue-900 rounded py-1 px-6 text-center text-[#006241] mb-6 font-semibold text-lg w-fit">
                              Select Time
                            </div>
                            <div className="flex flex-wrap text-base gap-2 md:gap-2">
                              {consultations?.map((time, index) => (
                                <div
                                  key={index}
                                  className={`border w-[85px] flex justify-center rounded py-[6px] border-slate-300 dark:border-slate-700 cursor-pointer font-semibold text-sm ${
                                    selectedConsultation?.slot === time?.slot
                                      ? "bg-green-800 text-white"
                                      : ""
                                  } ${
                                    !time?.Available
                                      ? "cursor-not-allowed text-slate-300 dark:text-slate-800 border-slate-200 dark:border-slate-800"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (time?.Available) {
                                      handleSelectConsultation(time);
                                    }
                                  }}
                                >
                                  {formatTime(time?.slot)}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-center items-center text-center w-full h-full min-h-24 text-base text-gray-500">
                            {consultationWarning}
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full min-h-24 grid place-items-center text-center text-base text-gray-500">
                    {timeslotWarning}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="btn btn-green text-base px-10 min-w-40"
              onClick={createBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? (
                <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
              ) : (
                "Book Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;

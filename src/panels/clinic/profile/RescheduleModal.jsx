import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import "flatpickr/dist/flatpickr.css";
import IconX from "../../../components/Icon/IconX";
import NetworkHandler from "../../../utils/NetworkHandler";
import { formatTime } from "../../../utils/formatTime";
import { formatDate, reverseformatDate } from "../../../utils/formatDate";
import { showMessage } from "../../../utils/showMessage";
import IconLoader from "../../../components/Icon/IconLoader";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import Swal from "sweetalert2";

const RescheduleModal = ({
  addRescheduleModal,
  closeAddRescheduleModal,
  fetchAppointments,
  bookingId,
  clinicId,
  doctorId,
}) => {
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


  // fetch timeslots function
  const fetchTimeSlots = async (date) => {
    setConsultationWarning("");
    setTimeslotsLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/booking/getdoctordate/${doctorId}`,
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
    if (addRescheduleModal && clinicId) {
      fetchTimeSlots(reverseformatDate(selectedDate));
    }
  }, [clinicId, selectedDate, addRescheduleModal]);

  // timeslot select function
  const handleSelectTimeslot = (timeslot) => {
    setSelectedTimeSlot(timeslot);
  };
  console.log(selectedTimeSlot);

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
        `/v1/booking/getconsulation/${doctorId}`,
        {
          DoctorTimeSlot_id: selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id,
          date: date,
          clinic_id: clinicId,
        }
      );
      console.log(response.data);
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

  console.log(selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id);

  // Create booking
  const createBooking = async (event) => {
    event.preventDefault();
    console.log("Selected Date:", selectedDate);
    console.log("Booking ID:", bookingId);

    if (!selectedDate) {
      showMessage("Please select a date.", "error");
      return;
    }
    console.log(selectedDate);
    console.log(selectedConsultation?.slot);
    console.log( selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id);
    // setBookingLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/Reschedule/${bookingId}`,
        {
          new_schedule_date: reverseformatDate(selectedDate) || "",
          schedule_time: selectedConsultation?.slot || "",
          DoctorTimeSlot_id:
            selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id || null,
        }
      );
        console.log(response);
      if (response.status === 201) {
        showMessage("Rescheduled successfully!", "success");
        closeAddRescheduleModal();
        fetchAppointments();
      } else {
        showMessage("Failed to reschedule. Please try again.", "error");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          Swal.fire({
            icon: "error",
            title: "Doctor is on leave",
            text: `Doctor is on leave on ${formatDate(selectedDate)}`,
            padding: "2em",
            customClass: "sweet-alerts",
            confirmButtonColor: "#006241",
          });
        } else if (error.response && error.response.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Invalid Date Selection",
            text: "Please select the date matching the day of the week",
            padding: "2em",
            customClass: "sweet-alerts",
            confirmButtonColor: "#006241",
          });
        } else {
          showMessage("An error occurred. Please try again.", "error");
        }
      }
    } finally {
      // setBookingLoading(true);
    }
  };

  const currentDate = formatDate(new Date());

  return (
    <Transition appear show={addRescheduleModal} as={Fragment}>
      <Dialog
        as="div"
        open={addRescheduleModal}
        onClose={() => {
          closeAddRescheduleModal();
        }}
        className="relative z-[51]"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[black]/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={() => {
                    closeAddRescheduleModal();
                  }}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>

                <div className="p-5 ">
                  {/* <div className="panel">
                    <h1 className="text-center font-bold text-2xl text-slate-800 m-8 dark:text-slate-">
                      Select Date
                    </h1>
                    <form onSubmit={handleReschedule}>
                      <div className="flex flex-wrap justify-center mb-6 space-x-4">
                        <div className="mb-5">
                          <Flatpickr
                            value={selectedDate}
                            options={{
                              dateFormat: "Y-m-d",
                              position: "auto left",
                              inline: true,
                            }}
                            className="form-input"
                            onChange={(date) => setSelectedDate(date)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-center items-center mt-8">
                        <button
                          type="button"
                          className="btn btn-outline-danger gap-2"
                          onClick={() => {
                            closeAddRescheduleModal();
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-green ltr:ml-4 rtl:mr-4"
                        >
                          {loading ? (
                            <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </form>
                  </div> */}
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
                              minDate: "today",
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
                                        key={
                                          timeslot?.timeSlot?.DoctorTimeSlot_id
                                        }
                                        className={`border w-44 flex justify-center rounded py-2 border-slate-300 dark:border-slate-700 cursor-pointer font-semibold text-base ${
                                          selectedTimeSlot?.timeSlot
                                            ?.DoctorTimeSlot_id ===
                                          timeslot?.timeSlot?.DoctorTimeSlot_id
                                            ? "bg-green-800 text-white"
                                            : "text-slate-900 dark:text-slate-300"
                                        }`}
                                        onClick={() =>
                                          handleSelectTimeslot(timeslot)
                                        }
                                      >
                                        {formatTime(
                                          timeslot?.timeSlot?.startTime
                                        )}{" "}
                                        -{" "}
                                        {formatTime(
                                          timeslot?.timeSlot?.endTime
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {consultationLoading ? (
                                <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
                              ) : (
                                <>
                                  {consultations &&
                                  consultations?.length > 0 ? (
                                    <>
                                      <div className="border border-blue-300 dark:border-blue-900 rounded py-1 px-6 text-center text-[#006241] mb-6 font-semibold text-lg w-fit">
                                        Select Time
                                      </div>
                                      <div className="flex flex-wrap text-base gap-2 md:gap-2">
                                        {consultations?.map((time, index) => (
                                          <div
                                            key={index}
                                            className={`border w-[85px] flex justify-center rounded py-[6px] border-slate-300 dark:border-slate-700 cursor-pointer font-semibold text-sm ${
                                              selectedConsultation?.slot ===
                                              time?.slot
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RescheduleModal;

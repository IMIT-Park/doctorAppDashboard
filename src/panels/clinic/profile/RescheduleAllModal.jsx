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

const RescheduleAllModal = ({
  addRescheduleAllModal,
  closeRescheduleAllModal,
  fetchAppointments,
  bookingId,
  clinicId,
  doctorId,
  schedule_date,
}) => {
  const [timeslotsLoading, setTimeslotsLoading] = useState(false);
  const [doctorTimeSlots, setDoctorTimeSlots] = useState([]);
  const [doctorTimeSlotsId, setDoctorTimeSlotsId] = useState(null);
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

      const doctorTimeSlotIds = filteredTimeSlots.map(
        (timeslot) => timeslot.timeSlot?.DoctorTimeSlot_id
      );

      setDoctorTimeSlotsId(doctorTimeSlotIds);
      // console.log(response);
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
    if (addRescheduleAllModal && clinicId) {
      fetchTimeSlots(reverseformatDate(selectedDate));
    }
  }, [clinicId, selectedDate, addRescheduleAllModal]);

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

  // console.log(selectedTimeSlot?.timeSlot?.DoctorTimeSlot_id);

  // Bulk Rescheduling

  const createReschedule = async (event) => {
    event.preventDefault();
    console.log("Selected Date:", selectedDate);
    console.log("Booking ID:", bookingId);

    if (!selectedDate) {
      showMessage("Please select a date.", "error");
      return;
    }
    setBookingLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/RescheduleBooking/${doctorId}`,
        {
          clinic_id: clinicId,
          schedule_date: schedule_date,
          new_schedule_date: reverseformatDate(selectedDate) || "",
          timeslots: doctorTimeSlotsId?.map((id) => ({
            DoctorTimeSlot_id: id,
          })),
        }
      );

      if (response?.status === 200) {
        showMessage("Rescheduled successfully!", "success");
        closeRescheduleAllModal();
        fetchAppointments();
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          showMessage(
            `Doctor is on leave on ${formatDate(selectedDate)}`,
            "warning"
          );
        }
       
        else if (status === 403) {
          if (
            data.error.includes(
              "Please select the date matching the day of the week"
            )
          ) {
            Swal.fire({
              icon: "error",
              title: "Invalid Date Selection",
              text: data.error,
              padding: "2em",
              customClass: "sweet-alerts",
              confirmButtonColor: "#006241",
            });
          } else if (
            data.error.includes("Booking already exists on") &&
            data.error.includes("and timeslot")
          ) {
            Swal.fire({
              icon: "error",
              title: "Booking Conflict",
              text: data.error,
              padding: "2em",
              customClass: "sweet-alerts",
              confirmButtonColor: "#006241",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Invalid Date Selection",
              text: data.error,
              padding: "2em",
              customClass: "sweet-alerts",
              confirmButtonColor: "#006241",
            });
          }
        }

        // else if (error.response.status === 400) {
        //   showMessage("Doctor is not available on this date.", "error");
        // } else {
        //   showMessage("An error occurred. Please try again.", "error");
        // }
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Transition appear show={addRescheduleAllModal} as={Fragment}>
      <Dialog
        as="div"
        open={addRescheduleAllModal}
        onClose={() => {
          closeRescheduleAllModal();
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={() => {
                    closeRescheduleAllModal();
                  }}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>

                <div className="p-5 ">
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
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        className="btn btn-green text-base px-10 min-w-40"
                        onClick={createReschedule}
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

export default RescheduleAllModal;

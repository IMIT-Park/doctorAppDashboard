import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconPlus from "../../../components/Icon/IconPlus";
import IconX from "../../../components/Icon/IconX";
import axios from "axios";
import NetworkHandler from "../../../utils/NetworkHandler";
import Swal from "sweetalert2";

const AddLeave = ({
  addLeaveModal,
  buttonLoading,
  closeAddLeaveModal,
  allDoctorNames,
  fetchLeaveData,
}) => {
  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);

  const [leaveType, setLeaveType] = useState("Full Day");
  const days = [
    { name: "Sunday", id: "0" },
    { name: "Monday", id: "1" },
    { name: "Tuesday", id: "2" },
    { name: "Wednesday", id: "3" },
    { name: "Thursday", id: "4" },
    { name: "Friday", id: "5" },
    { name: "Saturday", id: "6" },
  ];
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const resetForm = () => {
    setLeaveType("Full Day");
    setSelectedDate("");
    setStartDate("");
    setEndDate("");
    setTimeSlots([]);
    setErrorMessage("");
    setSelectedDoctorId("");
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    setSelectedDoctorId(selectedDoctorId);
    console.log("Selected Doctor ID:", selectedDoctorId);
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setErrorMessage("");
    setTimeSlots([]);
    console.log("Selected Date:", date);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/doctor/getTimeSlot/${selectedDoctorId}`,
        { date }
      );
      console.log("API Response:", response.data);

      if (response.data.doctorTimeSlots.count === 0) {
        setErrorMessage("No Timeslots found for this day");
      } else {
        setTimeSlots(response.data.doctorTimeSlots?.rows);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      if (error.response && error.response.status === 404) {
        setErrorMessage("No Timeslots found for this day");
      } else {
        setErrorMessage("An error occurred while fetching timeslots");
      }
    }
  };

  const getDayName = (dayId) => {
    const day = days.find((d) => d.id === String(dayId));
    return day ? day.name : "";
  };

  const convertTo12HourFormat = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${period}`;
  };

  const handleSaveLeave = async () => {
    if (!selectedDoctorId) {
      showBlockAlert("No doctor selected");
      return;
    }

    if (leaveType === "Full Day" && !selectedDate) {
      showBlockAlert("No date selected");
      return;
    }

    if (leaveType === "Full Day" && timeSlots.length === 0) {
      showBlockAlert("No time slots selected");
      return;
    }

    if (leaveType === "Multiple" && (!startDate || !endDate)) {
      showBlockAlert("Please select a date range");
      return;
    }

    try {
      if (leaveType === "Full Day") {
        const leaveData = {
          leaveslots: timeSlots.map((slot) => ({
            clinic_id: userData?.UserClinic[0]?.clinic_id,
            DoctorTimeSlot_id: slot.DoctorTimeSlot_id,
            leave_date: selectedDate,
          })),
        };
        const response = await NetworkHandler.makePostRequest(
          `/v1/doctor/createLeaveSlots/${selectedDoctorId}`,
          leaveData
        );
        showMessage("Leave added successfully.");
      } else if (leaveType === "Multiple") {
        const leaveData = {
          startDate: startDate,
          endDate: endDate,
          clinic_id: userData?.UserClinic[0]?.clinic_id,
        };
        console.log(leaveData);
        const response = await NetworkHandler.makePostRequest(
          `/v1/doctor/createBlukLeave/${selectedDoctorId}`,
          leaveData
        );
        console.log(response);
        showMessage("Bulk leave added successfully.");
      }
      closeAddLeaveModal();
      fetchLeaveData();
      resetForm();
    } catch (error) {
      console.error("Error creating leave slots:", error);
      if (error.response && error.response.status === 404) {
        showBlockAlert("Leave already taken on the date");
      } else {
        showBlockAlert("An error occurred while creating leave slots");
      }
    }
  };

  const showMessage = (msg = "", type = "success") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      showCloseButton: true,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

  const showBlockAlert = (msg = "", type = "success") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      showCloseButton: true,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: "warning",
      title: msg,
      padding: "10px 20px",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${period}`;
  };

  return (
    <Transition appear show={addLeaveModal} as={Fragment}>
      <Dialog
        as="div"
        open={addLeaveModal}
        onClose={(e) => {}}
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
          <div className="flex min-h-full items-center justify-center px-4 py-8">
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
                    closeAddLeaveModal();
                    resetForm();
                  }}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="text-lg font-bold bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  New Leave
                </div>
                <div className="p-5 ">
                  <form>
                    <div className="mb-8 flex items-center flex-col md:flex-row justify-between gap-8">
                      <div className="w-full">
                        <label htmlFor="ChooseDoctor" className="block mb-5">
                          Choose Doctor
                        </label>
                        <select
                          id="ChooseDoctor"
                          className="form-select text-white-dark w-full"
                          required
                          onChange={handleDoctorChange}
                        >
                          <option value="">Choose Doctor</option>
                          {allDoctorNames.map((doctor) => (
                            <option
                              key={doctor.doctor_id}
                              value={doctor.doctor_id}
                            >
                              {doctor.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full">
                        <label className="block mb-5">Select Duration</label>
                        <div className="flex items-center gap-3">
                          <div>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="leave_type"
                                className="form-radio text-success"
                                value="Full Day"
                                checked={leaveType === "Full Day"}
                                onChange={() => setLeaveType("Full Day")}
                              />
                              <span className="mr-4">Full Day</span>
                            </label>
                          </div>
                          <div>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="leave_type"
                                className="form-radio text-success"
                                value="Multiple"
                                checked={leaveType === "Multiple"}
                                onChange={() => setLeaveType("Multiple")}
                              />
                              <span className="mr-4">Multiple</span>
                            </label>
                          </div>
                          <div>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="leave_type"
                                className="form-radio text-success"
                                value="By Shift"
                                checked={leaveType === "By Shift"}
                                onChange={() => setLeaveType("By Shift")}
                              />
                              <span className="">By Shift</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {leaveType === "Full Day" && (
                      <div className="mb-8 flex items-center flex-col md:flex-row justify-between gap-8">
                        <div className="w-full">
                          <label htmlFor="Date">Date</label>

                          <input
                            id="Date"
                            type="date"
                            className="form-input"
                            value={selectedDate || ""}
                            onChange={handleDateChange}
                          />
                        </div>
                        <div className="w-full">
                          {errorMessage && (
                            <div className="text-red-500 mt-2">
                              {errorMessage}
                            </div>
                          )}
                        </div>
                        {/* {timeSlots.length > 0 && (
                          <div className="mt-5">
                            <label>Doctor Time Slots:</label>
                            <div className="flex flex-wrap mt-2">
                              {timeSlots.map((slot) => (
                                <div key={slot.DoctorTimeSlot_id}>
                                  <div className="badge badge-outline-dark text-gray-500">
                                    {getDayName(slot.day_id)}:{" "}
                                    {formatTime(slot.startTime)} -{" "}
                                    {formatTime(slot.endTime)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )} */}
                      </div>
                    )}

                    {leaveType === "Multiple" && (
                      <div className="mb-5">
                        <label htmlFor="date">
                          You can select multiple dates.
                        </label>
                        <div className="mb-8 mt-2 flex items-center flex-col md:flex-row justify-between gap-8">
                          <div className="w-full">
                            <p className="mt-2">From</p>
                            <input
                              id="StartDate"
                              type="date"
                              className="form-input"
                              value={startDate || ""}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div className="w-full">
                            <p className="mt-2">To</p>
                            <input
                              id="EndDate"
                              type="date"
                              className="form-input"
                              value={endDate || ""}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {leaveType === "By Shift" && (
                      <div className="mb-8 flex flex-col  gap-5 justify-between ">
                        <div>
                          <label htmlFor="Date">Date</label>
                          <input
                            id="Date"
                            type="date"
                            className="form-input"
                            value={selectedDate || ""}
                            onChange={handleDateChange}
                          />
                          {errorMessage && (
                            <div className="text-red-500 mt-2">
                              {errorMessage}
                            </div>
                          )}
                        </div>
                        
                        <div className="w-full">
                          {timeSlots.length > 0 && (
                            <div className="mt-5 w-full">
                              <label>Doctor Time Slots:</label>
                              <div className="flex flex-wrap mt-2">
                                {timeSlots.map((slot) => (
                                  <div key={slot.DoctorTimeSlot_id}>
                                    <div className="badge badge-outline-dark text-gray-500">
                                      {getDayName(slot.day_id)}:{" "}
                                      {formatTime(slot.startTime)} -{" "}
                                      {formatTime(slot.endTime)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger gap-2"
                        onClick={() => {
                          closeAddLeaveModal();
                          resetForm();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary ltr:ml-4 rtl:mr-4"
                        onClick={handleSaveLeave}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddLeave;

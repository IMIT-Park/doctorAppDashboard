import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import IconX from "../../../components/Icon/IconX";
import NetworkHandler from "../../../utils/NetworkHandler";
import { formatTime } from "../../../utils/formatTime";
import { formatDate, reverseformatDate } from "../../../utils/formatDate";
import { showMessage } from "../../../utils/showMessage";
import IconLoader from "../../../components/Icon/IconLoader";
import Swal from "sweetalert2";

const AddLeave = ({ addLeaveModal, closeAddLeaveModal, fetchLeaveData }) => {
  const userDetails = localStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic?.[0]?.clinic_id || 0;

  const [leaveType, setLeaveType] = useState("Full Day");
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);

  const fetchDoctorData = async () => {
    setDoctorsLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getDoctorbyId/${clinicId}`
      );
      setAllDoctors(response?.data?.doctors || []);
    } catch (error) {
      console.log(error);
    } finally {
      setDoctorsLoading(false);
    }
  };

  // fetching Doctors
  useEffect(() => {
    if (addLeaveModal) {
      fetchDoctorData();
    }
  }, [addLeaveModal]);

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
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setErrorMessage("");
    setTimeSlots([]);
    setSelectedTimeSlots([]);
    setLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/leave/getTimeSlot/${selectedDoctorId}`,
        { date }
      );

      if (response?.data?.doctorTimeSlots?.count === 0) {
        setErrorMessage("No Timeslots found for this day");
      } else {
        // Filter time slots based on clinicId
        const filteredTimeSlots = response?.data?.doctorTimeSlots?.rows?.filter(
          (slot) => slot?.clinic_id === clinicId
        );

        if (filteredTimeSlots?.length === 0) {
          setErrorMessage("No Timeslots found for this day");
        } else {
          setTimeSlots(filteredTimeSlots);
        }
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      if (error.response && error.response.status === 404) {
        setErrorMessage("No Timeslots found for this day");
      } else {
        console.log("An error occurred while fetching timeslots");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTimeSlots([...selectedTimeSlots, value]);
    } else {
      setSelectedTimeSlots(selectedTimeSlots.filter((id) => id !== value));
    }
  };

  const handleSaveLeave = async (e) => {
    e.preventDefault();

    if (!selectedDoctorId) {
      showMessage("No doctor selected", "warning");
      return;
    }

    if (
      (leaveType === "Full Day" && !selectedDate) ||
      (leaveType === "By Shift" && !selectedDate)
    ) {
      showMessage("Select a date for leave", "warning");
      return;
    }

    if (leaveType === "Full Day" && timeSlots.length === 0) {
      showMessage("No time slots available", "error");
      return;
    }

    if (leaveType === "Multiple" && (!startDate || !endDate)) {
      showMessage("Please select a date range", "warning");
      return;
    }

    if (leaveType === "By Shift" && selectedTimeSlots.length === 0) {
      showMessage("Please select a time slot", "warning");
      return;
    }

    setButtonLoading(true);

    try {
      if (leaveType === "Full Day") {
        const leaveData = {
          leaveslots: timeSlots.map((slot) => ({
            clinic_id: userData?.UserClinic[0]?.clinic_id,
            DoctorTimeSlot_id: slot.DoctorTimeSlot_id,
            leave_date: selectedDate,
          })),
        };
        console.log("Sending Full Day Leave Data:", leaveData);
        const response = await NetworkHandler.makePostRequest(
          `/v1/leave/createLeaveSlots/${selectedDoctorId}`,
          leaveData
        );
        showMessage("Leave added successfully.");
      } else if (leaveType === "Multiple") {
        const leaveData = {
          startDate: startDate,
          endDate: endDate,
          clinic_id: userData?.UserClinic[0]?.clinic_id,
        };
        const response = await NetworkHandler.makePostRequest(
          `/v1/leave/createBlukLeave/${selectedDoctorId}`,
          leaveData
        );
        showMessage("Bulk leave added successfully.");
      } else if (leaveType === "By Shift") {
        const leaveData = {
          leaveslots: selectedTimeSlots.map((slotId) => ({
            clinic_id: userData?.UserClinic[0]?.clinic_id,
            DoctorTimeSlot_id: slotId,
            leave_date: selectedDate,
          })),
        };
        console.log("Sending Shift Day Leave Data:", leaveData);
        const response = await NetworkHandler.makePostRequest(
          `/v1/leave/createLeaveSlots/${selectedDoctorId}`,
          leaveData
        );
        showMessage("Leave by shift added successfully.");
      }
      closeAddLeaveModal();
      fetchLeaveData();
      resetForm();
    } catch (error) {
      console.error("Error creating leave slots:", error);
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Cannot add leave!",
          text: `${error?.response?.data?.error}`,
          padding: "2em",
          customClass: "sweet-alerts",
        });
      } else {
        showMessage("An error occurred while creating leave slots", "error");
      }
    } finally {
      setButtonLoading(false);
    }
  };

  const currentDate = reverseformatDate(new Date());

  return (
    <Transition appear show={addLeaveModal} as={Fragment}>
      <Dialog
        as="div"
        open={addLeaveModal}
        onClose={() => {
          closeAddLeaveModal();
          resetForm();
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
                  <form onSubmit={handleSaveLeave}>
                    <div className="mb-8 flex items-center flex-col md:flex-row justify-between gap-8">
                      <div className="w-full">
                        <label htmlFor="ChooseDoctor" className="">
                          Choose Doctor
                        </label>
                        <select
                          id="ChooseDoctor"
                          className="form-select form-select-green w-full dark:text-slate-400"
                          required
                          onChange={handleDoctorChange}
                        >
                          <option value="">Choose Doctor</option>
                          {doctorsLoading ? (
                            <option value="">loading...</option>
                          ) : (
                            <>
                              {allDoctors.map((doctor) => (
                                <option
                                  key={doctor.doctor_id}
                                  value={doctor.doctor_id}
                                >
                                  {doctor.name}
                                </option>
                              ))}
                            </>
                          )}
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
                      <div className="mb-8 flex items-start flex-col">
                        <div className="w-full md:w-[calc(50%-20px)]">
                          <label htmlFor="Date">Date</label>

                          <input
                            id="Date"
                            type="date"
                            className="form-input form-input-green"
                            value={selectedDate || ""}
                            onChange={handleDateChange}
                            min={currentDate}
                          />
                        </div>
                        <div className="w-full mt-2">
                          {loading ? (
                            <div className="flex items-center">
                              <IconLoader className="animate-spin" />
                            </div>
                          ) : errorMessage ? (
                            <div className="text-red-500 mt-2">
                              {errorMessage}
                            </div>
                          ) : (
                            selectedDate &&
                            timeSlots?.length > 0 && (
                              <div className="text-slate-800 mt-2 dark:text-slate-200">
                                You want to add Fullday leave on{" "}
                                {formatDate(selectedDate)} ?
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {leaveType === "Multiple" && (
                      <div className="mb-5">
                        <label htmlFor="date">
                          You can select multiple dates.
                        </label>
                        <div className="mb-12 mt-2 flex items-center flex-col md:flex-row justify-between gap-8">
                          <div className="w-full">
                            <p className="mt-2">From</p>
                            <input
                              id="StartDate"
                              type="date"
                              className="form-input form-input-green"
                              value={startDate || ""}
                              onChange={(e) => setStartDate(e.target.value)}
                              min={currentDate}
                            />
                          </div>
                          <div className="w-full">
                            <p className="mt-2">To</p>
                            <input
                              id="EndDate"
                              type="date"
                              className="form-input form-input-green"
                              value={endDate || ""}
                              onChange={(e) => setEndDate(e.target.value)}
                              min={currentDate}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {leaveType === "By Shift" && (
                      <div className="mb-2 flex items-start flex-col justify-between gap-5">
                        <div className="w-full md:w-[calc(50%-20px)]">
                          <label htmlFor="Date">Date</label>
                          <input
                            id="Date"
                            type="date"
                            className="form-input form-input-green"
                            value={selectedDate || ""}
                            onChange={handleDateChange}
                            min={currentDate}
                          />
                          {errorMessage && (
                            <div className="text-red-500 mt-2">
                              {errorMessage}
                            </div>
                          )}
                        </div>

                        <div className="w-full">
                          {timeSlots?.length > 0 && (
                            <div className="w-full">
                              <label>Select Time Slots:</label>
                              <div className="flex flex-wrap my-2 gap-3">
                                {timeSlots?.map((slot) => (
                                  <div
                                    key={slot.DoctorTimeSlot_id}
                                    className="flex items-center border dark:border-slate-600 pr-2 py-2 rounded"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`slot-${slot.DoctorTimeSlot_id}`}
                                      value={slot.DoctorTimeSlot_id}
                                      className="form-checkbox mr-2 ml-2"
                                      onChange={handleTimeSlotChange}
                                    />
                                    <label
                                      htmlFor={`slot-${slot.DoctorTimeSlot_id}`}
                                      className="-mb-0.5"
                                    >
                                      {formatTime(slot?.startTime)} -{" "}
                                      {formatTime(slot?.endTime)}
                                    </label>
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
                        type="submit"
                        className="btn btn-green ltr:ml-4 rtl:mr-4"
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />
                        ) : (
                          "Submit"
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

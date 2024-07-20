import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import NetworkHandler from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";
import { formatTime } from "../../../utils/formatTime";
import { formatDate, reverseformatDate } from "../../../utils/formatDate";
import Swal from "sweetalert2";

const AddLeave = ({ open, closeModal, clinicId, doctorId, fetchLeaveData }) => {
  const [leaveType, setLeaveType] = useState("Full Day");
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to reset the form
  const resetForm = () => {
    setLeaveType("Full Day");
    setSelectedDate("");
    setStartDate("");
    setEndDate("");
    setErrorMessage("");
    setTimeSlots([]);
    setSelectedTimeSlots([]);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Handle date change to fetch time slots
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setErrorMessage("");
    setTimeSlots([]);
    setLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/leave/getTimeSlot/${doctorId}`,
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
        setErrorMessage("An error occurred while fetching timeslots");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotChange = (e) => {
    const { value, checked } = e.target;
    const slotId = parseInt(value, 10);
    if (checked) {
      setSelectedTimeSlots((prev) => [...prev, slotId]);
    } else {
      setSelectedTimeSlots((prev) => prev.filter((id) => id !== slotId));
    }
  };

  // Handle leave submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    try {
      let leaveData;

      if (leaveType === "By Shift" && selectedTimeSlots.length === 0) {
        showMessage("No time slots selected for leave", "warning");
        setButtonLoading(false);
        return;
      }
      if (leaveType === "Full Day" && !selectedDate) {
        showMessage("Select a date for leave", "warning");
        setButtonLoading(false);
        return;
      }

      if (leaveType === "Full Day" && !timeSlots?.length) {
        showMessage("No slots found for this day", "warning");
        setButtonLoading(false);
        return;
      }

      if (leaveType === "Multiple" && (!startDate || !endDate)) {
        showMessage("Please select a date range", "warning");
        setButtonLoading(false);
        return;
      }

      if (leaveType === "Full Day") {
        leaveData = {
          leaveslots: timeSlots.map((slot) => ({
            DoctorTimeSlot_id: slot.DoctorTimeSlot_id,
            leave_date: selectedDate,
          })),
        };
      } else if (leaveType === "Multiple") {
        leaveData = {
          startDate: startDate,
          endDate: endDate,
        };
      } else if (leaveType === "By Shift") {
        leaveData = {
          leaveslots: [...new Set(selectedTimeSlots)].map((slotId) => ({
            DoctorTimeSlot_id: slotId,
            leave_date: selectedDate,
          })),
        };
      }

      const url =
        leaveType === "Multiple"
          ? `/v1/leave/createBlukLeave/${doctorId}`
          : `/v1/leave/createLeaveSlots/${doctorId}`;
      const response = await NetworkHandler.makePostRequest(url, leaveData);

      showMessage(
        leaveType === "Multiple"
          ? "Bulk leave added successfully."
          : "Leave added successfully."
      );
      closeModal();
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
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        open={open}
        onClose={closeModal}
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  New Leave
                </div>
                <div className="p-5">
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="duration" className="text-white-dark mb-3">
                      Select Duration
                    </label>
                    <div
                      id="duration"
                      className="flex items-center flex-wrap  gap-2 sm:gap-5 mb-4"
                    >
                      <label className="inline-flex">
                        <input
                          type="radio"
                          name="duration"
                          value="Full Day"
                          className="form-radio peer text-[#006241]"
                          checked={leaveType === "Full Day"}
                          onChange={() => setLeaveType("Full Day")}
                        />
                        <span className="peer-checked:text-[#006241]">
                          Full Day
                        </span>
                      </label>
                      <label className="inline-flex">
                        <input
                          type="radio"
                          name="duration"
                          value="Multiple"
                          className="form-radio peer text-[#006241]"
                          checked={leaveType === "Multiple"}
                          onChange={() => setLeaveType("Multiple")}
                        />
                        <span className="peer-checked:text-[#006241]">
                          Multiple
                        </span>
                      </label>
                      <label className="inline-flex">
                        <input
                          type="radio"
                          name="duration"
                          value="By Shift"
                          className="form-radio peer text-[#006241]"
                          checked={leaveType === "By Shift"}
                          onChange={() => setLeaveType("By Shift")}
                        />
                        <span className="peer-checked:text-[#006241]">
                          By Shift
                        </span>
                      </label>
                    </div>
                    {leaveType === "Full Day" && (
                      <div className="mb-8 flex items-start flex-col">
                        <div className="w-full md:w-1/2">
                          <label htmlFor="Date">Date</label>
                          <input
                            id="Date"
                            type="date"
                            className="form-input form-input-green"
                            value={selectedDate || ""}
                            onChange={handleDateChange}
                            min={currentDate}
                            disabled={loading}
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
                        <div className="mb-8 mt-2 flex items-center flex-col md:flex-row justify-between gap-8">
                          <div className="w-full">
                            <p className="mt-2">From</p>
                            <input
                              id="StartDate"
                              type="date"
                              className="form-input"
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
                              className="form-input"
                              value={endDate || ""}
                              onChange={(e) => setEndDate(e.target.value)}
                              min={currentDate}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {leaveType === "By Shift" && (
                      <div className="mb-8 flex flex-col gap-5 justify-between">
                        <div className="w-1/2">
                          <label htmlFor="Date">Date</label>
                          <input
                            id="Date"
                            type="date"
                            className="form-input"
                            value={selectedDate || ""}
                            onChange={handleDateChange}
                            min={currentDate}
                            disabled={loading}
                          />
                          {loading ? (
                            <div className="flex items-center mt-4">
                              <IconLoader className="animate-spin" />
                            </div>
                          ) : (
                            errorMessage && (
                              <div className="text-red-500 mt-4">
                                {errorMessage}
                              </div>
                            )
                          )}
                        </div>
                        <div className="w-full">
                          {timeSlots?.length > 0 && (
                            <div className="mt-5 w-full">
                              <label className="block mb-2">
                                Select Time Slots:
                              </label>
                              <div className="flex flex-wrap my-2 gap-3">
                                {timeSlots?.map((slot) => (
                                  <div
                                    key={slot.DoctorTimeSlot_id}
                                    className="flex items-center border dark:border-slate-600 pr-2 py-2 rounded"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`slot-${slot?.DoctorTimeSlot_id}`}
                                      value={slot.DoctorTimeSlot_id}
                                      className="form-checkbox mr-2 ml-2"
                                      onChange={handleTimeSlotChange}
                                    />
                                    <label
                                      htmlFor={`slot-${slot?.DoctorTimeSlot_id}`}
                                      className="-mb-0.5"
                                    >
                                      {formatTime(slot.startTime)} -{" "}
                                      {formatTime(slot.endTime)}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-green ltr:ml-4 rtl:mr-4"
                        disabled={buttonLoading}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
                        ) : (
                          "Add"
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

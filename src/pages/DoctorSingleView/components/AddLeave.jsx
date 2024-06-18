import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import NetworkHandler from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";

const AddLeave = ({
  open,
  closeModal,
  buttonLoading,
  clinicId,
  doctorId,
  fetchLeaveData
}) => {
  const [leaveType, setLeaveType] = useState("Full Day");
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);

 
  // Function to reset the form
  const resetForm = () => {
    setSelectedDate("");
    setStartDate("");
    setEndDate("");
    setErrorMessage("");
    setTimeSlots([]);
  };

  
  // Handle date change to fetch time slots
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setErrorMessage("");
    setTimeSlots([]);
    console.log("Selected Date:", date);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/doctor/getTimeSlot/${doctorId}`, 
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

  // Handle leave submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (leaveType === "Full Day") {
        const leaveData = {
          leaveslots: timeSlots.map((slot) => ({
            clinic_id: clinicId,
            DoctorTimeSlot_id: slot.DoctorTimeSlot_id,
            leave_date: selectedDate,
          })),
        };
        console.log(leaveData);
        const response = await NetworkHandler.makePostRequest(
          `/v1/doctor/createLeaveSlots/${doctorId}`, 
          leaveData
        );
        showMessage("Leave added successfully.");
      }else if (leaveType === "Multiple") {
        const leaveData = {
          startDate: startDate,
          endDate: endDate,
          clinic_id: clinicId,
        };
        console.log(leaveData);
        const response = await NetworkHandler.makePostRequest(
          `/v1/doctor/createBlukLeave/${doctorId}`,
          leaveData
        );
        console.log(response);
        showMessage("Bulk leave added successfully.");
      }
      closeModal();
      fetchLeaveData();
      resetForm();
    } catch (error) {
      console.error("Error creating leave slots:", error);
      if (error.response && error.response.status === 404) {
        showMessage("Leave already taken on the date","error");
      } else {
        showMessage("An error occurred while creating leave slots","error");
      }
    }
  };



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

                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit" // Change to type="submit" to trigger handleSubmit
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

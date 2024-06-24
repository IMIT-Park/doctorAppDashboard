import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import { formatTime } from "../../../utils/formatTime";
import NetworkHandler from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";

const DeleteLeaveModal = ({
  open,
  closeModal,
  buttonLoading,
  fetchLeaveData,
  leave,
  selectedTimeSlots,
  setSelectedTimeSlots,
}) => {
  const [timeSlots, setTimeSlots] = useState([]);

  const days = [
    { name: "Sunday", id: "0" },
    { name: "Monday", id: "1" },
    { name: "Tuesday", id: "2" },
    { name: "Wednesday", id: "3" },
    { name: "Thursday", id: "4" },
    { name: "Friday", id: "5" },
    { name: "Saturday", id: "6" },
  ];

  useEffect(() => {
    if (open && leave && leave.doctors) {
      const extractedTimeSlots = leave.doctors.flatMap((doctor) =>
        doctor.leaves.map((leaveItem) => ({
          ...leaveItem.DoctorTimeSlot,
          leave_id: leaveItem.leave_id,
          leave_date: leaveItem.leave_date,
        }))
      );
      setTimeSlots(extractedTimeSlots);
      setSelectedTimeSlots([]);
    } else {
      setTimeSlots([]);
    }
  }, [open, leave]);

  const handleTimeSlotChange = (e) => {
    const { value, checked } = e.target;
    const leaveId = parseInt(value);

    if (checked) {
      setSelectedTimeSlots((prevSelected) => [...prevSelected, leaveId]);
    } else {
      setSelectedTimeSlots((prevSelected) =>
        prevSelected.filter((id) => id !== leaveId)
      );
    }
  };

  const getDayName = (dayId) => {
    const day = days.find((d) => d.id === String(dayId));
    return day ? day.name : "";
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (selectedTimeSlots.length === 0) {
        showMessage("No time slots selected for deletion","error");
      return;
    }

    console.log("Time slots to delete:", selectedTimeSlots);

    try {
      const response = await NetworkHandler.makeDeleteRequest(
        "/v1/leave/deleteLeaveSlot",
        {
          leave_ids: selectedTimeSlots,
        }
      );
      showMessage("Delete successful");

      console.log("Delete successful:", response.data);
      closeModal();
      fetchLeaveData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  console.log("selectedTimeSlots", selectedTimeSlots);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        open={open}
        onClose={closeModal}
        className="fixed inset-0 z-50 overflow-y-auto"
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
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className="relative bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600"
              >
                <IconX />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Delete Leave</h2>

              <div className="mb-4">
                <div className="w-full">
                  {timeSlots.length > 0 && (
                    <div className="mt-5 w-full">
                      <label className="block mb-2">Select Time Slots:</label>
                      <div className="flex flex-wrap mt-2">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot.leave_id}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              id={`slot-${slot.leave_id}`}
                              value={slot.leave_id}
                              className="form-checkbox mr-2 ml-2"
                              onChange={handleTimeSlotChange}
                            />
                            <label
                              htmlFor={`slot-${slot.leave_id}`}
                              className="badge badge-outline-dark text-gray-500 p-2 text-lg"
                            >
                              {getDayName(slot.day_id)}:{" "}
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

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-green"
                  onClick={handleDelete}
                  disabled={buttonLoading}
                >
                  {buttonLoading ? (
                    <IconLoader className="animate-spin inline-block h-5 w-5 mr-3" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default DeleteLeaveModal;

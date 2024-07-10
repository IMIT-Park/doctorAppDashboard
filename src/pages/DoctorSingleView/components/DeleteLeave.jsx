import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import { formatTime } from "../../../utils/formatTime";
import NetworkHandler from "../../../utils/NetworkHandler";
import { formatDate } from "../../../utils/formatDate";
import { showMessage } from "../../../utils/showMessage";

const DeleteLeave = ({
  open,
  closeModal,
  fetchLeaveData,
  leaveData,
  selectedTimeSlots,
  setSelectedTimeSlots,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (slotId) => {
    setSelectedTimeSlots((prevSelected) => {
      if (prevSelected.includes(slotId)) {
        return prevSelected.filter((id) => id !== slotId);
      } else {
        return [...prevSelected, slotId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTimeSlots(leaveData?.leaves?.map((slot) => slot?.leave_id));
    } else {
      setSelectedTimeSlots([]);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (selectedTimeSlots.length === 0) {
      showMessage("Please select at least one time slot to delete.", "warning");
      return;
    }
    setLoading(true);

    try {
      const response = await NetworkHandler.makeDeleteRequest(
        "/v1/leave/deleteLeaveSlot",
        {
          leave_ids: selectedTimeSlots,
        }
      );
      closeModal();
      fetchLeaveData();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

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
                  <div className="mt-5 w-full">
                    <div className="flex items-center gap-5 justify-between flex-wrap">
                      <label className="text-slate-600 dark:text-slate-300">
                        Select Time Slots of "
                        {formatDate(leaveData?.leave_date)}" to Delete:
                      </label>
                      <div className="flex items-start">
                        <input
                          id="select-all"
                          type="checkbox"
                          className="form-checkbox"
                          onChange={handleSelectAll}
                          checked={
                            selectedTimeSlots?.length ===
                            leaveData?.leaves?.length
                          }
                        />
                        <label
                          htmlFor="select-all"
                          className="text-primary text-base mb-1"
                        >
                          Select All
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 mb-10">
                      {leaveData?.leaves?.map((slot) => (
                        <div
                          key={slot?.leave_id}
                          className="flex items-center border border-gray-500 rounded px-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            id={`slot-${slot?.leave_id}`}
                            className="form-checkbox"
                            checked={selectedTimeSlots?.includes(
                              slot?.leave_id
                            )}
                            onChange={() =>
                              handleCheckboxChange(slot?.leave_id)
                            }
                          />
                          <label
                            htmlFor={`slot-${slot?.leave_id}`}
                            className="text-gray-500 mt-2 cursor-pointer"
                          >
                            {formatTime(slot?.DoctorTimeSlot?.startTime)} -{" "}
                            {formatTime(slot?.DoctorTimeSlot?.endTime)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  disabled={loading}
                >
                  {loading ? (
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

export default DeleteLeave;

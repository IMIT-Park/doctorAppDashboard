import React, { useState } from "react";
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

const RescheduleModal = ({
  addRescheduleModal,
  setAddRescheduleModal,
  closeAddRescheduleModal,
  bookingId,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReschedule = async (event) => {
    event.preventDefault();
    console.log("Selected Date:", selectedDate);
    console.log("Booking ID:", bookingId);

    if (!selectedDate) {
      showMessage("Please select a date.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/Reschedule/${bookingId}`,
        {
          new_schedule_date: reverseformatDate(selectedDate),
        }
      );

      console.log("Response:", response);

      if (response.status === 200) {
        showMessage("Rescheduled successfully!", "success");
        closeAddRescheduleModal();
      } else {
        showMessage("Failed to reschedule. Please try again.", "error");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        showMessage(
          `Doctor is on leave on ${formatDate(selectedDate)}`,
          "warning"
        );
      } else if (error.response && error.response.status === 403) {
        showMessage(
          `Pick the date that corresponds to the day of the week`,
          "warning"
        );
      } else {
        showMessage("An error occurred. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl text-black dark:text-white-dark">
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
                  <div className="panel">
                    <h1 className="text-center font-bold text-2xl text-black m-8 dark:text-[#fbfbfb]">
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

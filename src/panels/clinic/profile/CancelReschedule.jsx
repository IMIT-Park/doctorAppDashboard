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
import "flatpickr/dist/flatpickr.css";

const CancelReschedule = ({
  cancelRescheduleModal,
  closeCancelRescheduleModal,
  bookingId,
  selectedDoctorId,
  fetchAppointments,
  cancelAll,
  clinicId,
  selectedDate,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCancelReschedule = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/cancel/${bookingId}`
      );

      if (response.status === 200) {
        showMessage("Appointment canceled successfully!", "success");
        closeCancelRescheduleModal();
        fetchAppointments();
      } else {
        showMessage(
          "Failed to cancel the appointment. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const CancelAllAppoinments = async (event) => {
    event.preventDefault();

    if (!selectedDate) {
        showMessage("Please select a doctor and date.", "warning");
        return;
    }
    setLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/cancelBooking/${selectedDoctorId}`,
        {
          clinic_id: clinicId,
          schedule_date: reverseformatDate(selectedDate),
        }
      );

      if (response.status === 200) {
        showMessage("All Appointments canceled successfully!", "success");
        closeCancelRescheduleModal();
        fetchAppointments();
      } else {
        showMessage(
          "Failed to cancel all appointments. Please try again.",
          "error"
        );
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={cancelRescheduleModal} as={Fragment}>
      <Dialog
        as="div"
        open={cancelRescheduleModal}
        onClose={() => {
          closeCancelRescheduleModal();
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
                    closeCancelRescheduleModal();
                  }}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>

                <div className="p-5 ">
                  <div className="panel">
                    <h1 className="text-center font-bold text-2xl text-black m-8 dark:text-[#fbfbfb]">
                      {cancelAll
                        ? "Cancel All Appoinments"
                        : "Cancel Appoinment"}
                    </h1>
                    <h2 className="text-center font-bold text-md text-black m-8 dark:text-[#fbfbfb]">
                      {cancelAll
                        ? "Are you sure want to cancel all appointments ?"
                        : "Are you sure want to cancel this appointment ?"}
                    </h2>
                    <form
                      onSubmit={
                        cancelAll
                          ? CancelAllAppoinments
                          : handleCancelReschedule
                      }
                    >
                      <div className="flex justify-center items-center mt-8">
                        <button
                          type="button"
                          className="btn btn-outline-danger gap-2"
                          onClick={() => {
                            closeCancelRescheduleModal();
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

export default CancelReschedule;

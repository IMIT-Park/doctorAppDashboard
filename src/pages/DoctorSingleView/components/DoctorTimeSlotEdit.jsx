import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";

const DoctorTimeSlotEdit = ({
  open,
  closeModal,
  buttonLoading,
  formSubmit,
  timesInput,
  setTimesInput,
  days,
  isEdit,
  selectedDay,
  setSelectedDay,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    formSubmit();
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  {isEdit ? "Edit" : "Add"} Time Slot
                </div>
                <div className="p-5">
                  <form>
                    <div className="mb-6">
                      {!isEdit && (
                        <select
                          id="ctnSelect1"
                          className="form-select form-select-green text-white-dark"
                          required
                          value={selectedDay}
                          onChange={(e) => setSelectedDay(e.target.value)}
                        >
                          <option value="">Select Day</option>
                          {days?.map((day) => (
                            <option key={day?.id} value={day?.id}>
                              {day?.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <p className="text-sm font-small pb-3">
                      <span className="bg-[#f3f2f2] dark:bg-[#121c2c] pl-3 py-1 pr-[10px] ">
                        Select Time
                      </span>
                    </p>
                    <div className="grid grid-cols-1 sm:flex justify-between gap-1 sm:gap-4">
                      <div className="w-full">
                        <label className="text-white-dark">Start:</label>
                        <input
                          type="time"
                          className="form-input"
                          value={timesInput?.startTime}
                          onChange={(e) =>
                            setTimesInput({
                              ...timesInput,
                              startTime: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label className="text-white-dark">End:</label>
                        <input
                          type="time"
                          className="form-input"
                          value={timesInput?.endTime}
                          onChange={(e) =>
                            setTimesInput({
                              ...timesInput,
                              endTime: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex items-start gap-6">
                      <div className="w-full">
                        <label className="text-white-dark">
                          No. of Consultations:
                        </label>
                        <input
                          type="number"
                          className="form-input w-full"
                          value={timesInput?.noOfConsultationsPerDay}
                          onChange={(e) =>
                            setTimesInput({
                              ...timesInput,
                              noOfConsultationsPerDay: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label className="text-white-dark">
                          Time of Consultation:
                        </label>
                        <input
                          type="number"
                          className="form-input w-full"
                          value={timesInput?.time_slot}
                          onChange={(e) =>
                            setTimesInput({
                              ...timesInput,
                              time_slot: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={handleSubmit}
                        disabled={buttonLoading}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
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

export default DoctorTimeSlotEdit;

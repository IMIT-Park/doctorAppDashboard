import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";

const AddLeave = ({ open, closeModal, buttonLoading, formSubmit }) => {
  const [selectedDuration, setSelectedDuration] = useState("Full Day");

  const handleDurationChange = (e) => {
    setSelectedDuration(e.target.value);
  };

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
                  <form>
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
                          checked={selectedDuration === "Full Day"}
                          onChange={handleDurationChange}
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
                          checked={selectedDuration === "Multiple"}
                          onChange={handleDurationChange}
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
                          checked={selectedDuration === "By Shift"}
                          onChange={handleDurationChange}
                        />
                        <span className="peer-checked:text-[#006241]">
                          By Shift
                        </span>
                      </label>
                    </div>
                    <label htmlFor="date" className="text-white-dark mb-3">
                      Select Date
                    </label>
                    {selectedDuration !== "Multiple" && (
                      <div>
                        <label htmlFor="date" className="text-white-dark">
                          Date
                        </label>
                        <input
                          id="date"
                          type="date"
                          className="form-input form-input-green w-1/2"
                        />
                      </div>
                    )}
                    {selectedDuration === "Multiple" && (
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4">
                        <div>
                          <label
                            htmlFor="fromDate"
                            className="text-white-dark text-sm mb-0"
                          >
                            From
                          </label>
                          <input
                            id="fromDate"
                            type="date"
                            className="form-input form-input-green"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="toDate"
                            className="text-white-dark text-sm mb-0"
                          >
                            To
                          </label>
                          <input
                            id="toDate"
                            type="date"
                            className="form-input form-input-green"
                          />
                        </div>
                      </div>
                    )}
                    {selectedDuration === "By Shift" && (
                      <div className="flex items-center gap-3 flex-wrap mt-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="shift"
                            className="form-radio text-primary"
                          />
                          <span className="text-[#006241] text-sm font-bold border border-[#006241] px-3 py-1 rounded">
                            10.00 AM - 12.00 AM
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="shift"
                            className="form-radio text-primary"
                          />
                          <span className="text-[#006241] text-sm font-bold border border-[#006241] px-3 py-1 rounded">
                            1.00 PM - 2.00 PM
                          </span>
                        </label>
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
                        type="button"
                        className="btn btn-green ltr:ml-4 rtl:mr-4"
                        onClick={handleSubmit}
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

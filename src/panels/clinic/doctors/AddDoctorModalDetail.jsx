import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconCaretDown from "../../../components/Icon/IconCaretDown";

import AnimateHeight from "react-animate-height";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

const AddDoctorModalDetail = ({
  addDoctorModalDetail,
  closeAddDoctorModalDetail,
  handleDoctorPassword,
  buttonLoading,
}) => {
  const [active, setActive] = useState("");

  const days = [
    { name: "Sunday", id: "1" },
    { name: "Monday", id: "2" },
    { name: "Tuesday", id: "3" },
    { name: "Wednesday", id: "4" },
    { name: "Thursday", id: "5" },
    { name: "Friday", id: "6" },
    { name: "Saturday", id: "7" },
  ];

  const togglePara = (value) => {
    setActive((oldValue) => {
      return oldValue === value ? "" : value;
    });
  };

  return (
    <Transition appear show={addDoctorModalDetail} as={Fragment}>
      <Dialog
        as="div"
        open={addDoctorModalDetail}
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                <div className="mt-5">
                  <button
                    type="button"
                    className="btn btn-primary ml-4 px-2 py-1 h-8 w-8"
                    onClick={closeAddDoctorModalDetail}
                  >
                    <IconCaretDown className="rotate-90" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-lg font-bold pl-7 py-1 ltr:pr-[50px] rtl:pl-[50px]">
                    Select Days
                  </div>
                </div>

                <div>
                  <form>
                    <div className="p-8">
                      {days.map((day) => (
                        <div className="panel p-1" key={day.id}>
                          <div className="flex items-center justify-between">
                            <button
                              className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                              onClick={() => togglePara(day.id)}
                            ></button>
                          </div>
                          <div>
                            <div className="space-y-2 font-semibold">
                              <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                <button
                                  type="button"
                                  className={`p-3 w-full flex items-center justify-between text-white-dark dark:bg-[#1b2e4b] ${
                                    active === day.id ? "!text-primary" : ""
                                  }`}
                                  onClick={() => togglePara(day.id)}
                                >
                                  <span>{day.name}</span>
                                  <div
                                    className={`ml-2 w-4 h-4 rounded-full border ${
                                      active === day.id
                                        ? " bg-primary"
                                        : "border-gray-400"
                                    }`}
                                  ></div>
                                </button>

                                <div>
                                  <AnimateHeight
                                    duration={300}
                                    height={active === day.id ? "auto" : 0}
                                  >
                                    <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                      <p className="text-sm font-small pb-5">
                                        <span className="bg-[#f3f2f2] dark:bg-[#121c2c] pl-3 py-1 pr-[10px] ">
                                          Select Time
                                        </span>
                                      </p>
                                      <div className="pb-5">
                                        <div className="grid grid-cols-1 sm:flex justify-between gap-5">
                                          <p className="mt-2">Morning</p>
                                          <Flatpickr
                                            options={{
                                              noCalendar: true,
                                              enableTime: true,
                                              dateFormat: "h:i K",
                                              position: "auto left",
                                            }}
                                            className="form-input"
                                            placeholder="Select Time"
                                          />
                                          <p className="mt-2">To</p>
                                          <Flatpickr
                                            options={{
                                              noCalendar: true,
                                              enableTime: true,
                                              dateFormat: "h:i K",
                                              position: "auto left",
                                            }}
                                            className="form-input"
                                            placeholder="Select Time"
                                          />
                                        </div>
                                        <div className="grid grid-cols-1 sm:flex justify-between gap-5 mt-3">
                                          <p className="mt-2">Evening</p>
                                          <Flatpickr
                                            options={{
                                              noCalendar: true,
                                              enableTime: true,
                                              dateFormat: "h:i K",
                                              position: "auto left",
                                            }}
                                            className="form-input"
                                            placeholder="Select Time"
                                          />
                                          <p className="mt-2">To</p>
                                          <Flatpickr
                                            options={{
                                              noCalendar: true,
                                              enableTime: true,
                                              dateFormat: "h:i K",
                                              time_24hr: false,
                                              position: "auto left",
                                            }}
                                            className="form-input"
                                            placeholder="Select Time"
                                          />
                                        </div>
                                      </div>
                                      <div className="mb-5">
                                        <label className="inline-flex cursor-pointer">
                                          <input
                                            type="checkbox"
                                            className="form-checkbox"
                                          />
                                          <span className="text-white-dark relative checked:bg-none">
                                            Same for all selected days
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  </AnimateHeight>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end items-center p-8">
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={handleDoctorPassword}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />
                        ) : (
                          "Next"
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

export default AddDoctorModalDetail;

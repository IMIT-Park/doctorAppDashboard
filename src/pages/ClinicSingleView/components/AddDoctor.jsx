import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import IconX from "../../../components/Icon/IconX";
import BasicDetails from "./BasicDetails";
import SelectDays from "./SelectDays";
import Credentials from "./Credentials";
import IconLoader from "../../../components/Icon/IconLoader";

const AddDoctor = ({
  open,
  buttonLoading,
  closeAddDoctorModal,
  handleFileChange,
  input,
  setInput,
  activeTab,
  setActiveTab,
  timeSlotInput,
  clinicId,
  setTimeSlotInput,
  formSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmit();
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        open={open}
        onClose={closeAddDoctorModal}
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
                  onClick={closeAddDoctorModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  Add Doctor
                </div>

                <div className="inline-block w-full py-5 px-5 sm:px-10">
                  <ul className="mb-5 grid grid-cols-3 text-center">
                    <li>
                      <div
                        className={`${
                          activeTab === 1 ? "!bg-green-800 text-white" : ""
                        }
                                            block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`}
                        onClick={() => setActiveTab(1)}
                      >
                        Basic Details
                      </div>
                    </li>

                    <li>
                      <div
                        className={`${
                          activeTab === 2 ? "!bg-green-800 text-white" : ""
                        } block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`}
                        onClick={() => setActiveTab(2)}
                      >
                        Select Days
                      </div>
                    </li>

                    <li>
                      <div
                        className={`${
                          activeTab === 3 ? "!bg-green-800 text-white" : ""
                        } block rounded-full bg-[#f3f2ee] p-2.5 dark:bg-[#1b2e4b]`}
                        onClick={() => setActiveTab(3)}
                      >
                        Credentials
                      </div>
                    </li>
                  </ul>

                  <div>
                    <div className="mb-5">
                      {activeTab === 1 && (
                        <BasicDetails
                          input={input}
                          setInput={setInput}
                          handleFileChange={handleFileChange}
                        />
                      )}
                    </div>
                    <div className="mb-5">
                      {activeTab === 2 && (
                        <SelectDays
                          input={input}
                          setInput={setInput}
                          clinicId={clinicId}
                          timeSlotInput={timeSlotInput}
                          setTimeSlotInput={setTimeSlotInput}
                        />
                      )}
                    </div>
                    <div className="mb-5">
                      {activeTab === 3 && (
                        <Credentials input={input} setInput={setInput} />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className={`btn btn-green ${
                        activeTab === 1 ? "hidden" : ""
                      }`}
                      onClick={() => setActiveTab(activeTab === 3 ? 2 : 1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-green ltr:ml-auto rtl:mr-auto"
                      onClick={(e) =>
                        activeTab === 3
                          ? handleSubmit(e)
                          : setActiveTab(activeTab === 1 ? 2 : 3)
                      }
                    >
                      {buttonLoading ? (
                        <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-2 rtl:mr-2 shrink-0" />
                      ) : activeTab === 3 ? (
                        "Finish"
                      ) : (
                        "Next"
                      )}
                    </button>
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

export default AddDoctor;

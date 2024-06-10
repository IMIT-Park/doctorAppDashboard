import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconPlus from "../../../components/Icon/IconPlus";
import IconX from "../../../components/Icon/IconX";

const AddLeave = ({
  addLeaveModal,
  handleSaveLeave,
  saveDoctor,
  buttonLoading,
  closeAddLeaveModal,
}) => {
    
  const handleSubmit = () => {
    saveDoctor();
  };

  return (
    <Transition appear show={addLeaveModal} as={Fragment}>
      <Dialog
        as="div"
        open={addLeaveModal}
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-7xl text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={closeAddLeaveModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  New Leave
                </div>
                <div className="p-5">
                  <form>
                    <div className="mb-5">
                      <label htmlFor="ChooseDoctor">Choose Doctor</label>
                      <select
                        id="Choose Doctor"
                        className="form-select text-white-dark"
                        required
                        //   value={input.ChooseDoctor}
                        //   onChange={(e) => setInput({ ...input, ChooseDoctor: e.target.value })}
                      >
                        <option>Choose Doctor</option>
                        <option value="Male">Dr.Jasil</option>
                        <option value="Female">Dr.Allen</option>
                        <option value="Other">Dr.Simi</option>
                        <option value="Other">Dr.Jimlat</option>
                      </select>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="mds-name">Select Duration</label>

                      <div className="flex items-center flex-wrap gap-3 justify-stretch mb-5 mt-5">
                        <div>
                          <label className="inline-flex">
                            <input
                              type="radio"
                              name="default_radio"
                              className="form-radio"
                              defaultChecked
                            />
                            <span>Full Day</span>
                          </label>
                        </div>
                        <div>
                          <label className="inline-flex">
                            <input
                              type="radio"
                              name="default_radio"
                              className="form-radio text-success"
                            />
                            <span>Multiple</span>
                          </label>
                        </div>
                        <div>
                          <label className="inline-flex">
                            <input
                              type="radio"
                              name="default_radio"
                              className="form-radio text-secondary"
                            />
                            <span>By Shift</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="date">Date</label>
                      <Flatpickr
                        options={{
                          dateFormat: "d-m-Y",
                          position: "auto left",
                        }}
                        className="form-input"
                        placeholder="Select Date"
                        //   value={input.dateOfBirth}
                        //   onChange={([date]) => setInput({ ...input, dateOfBirth: date })}
                      />
                    </div>

                    <div className="mb-5">
                    <label htmlFor="date">You can select multiple dates.</label>
                    <Flatpickr
                        options={{
                          dateFormat: "d-m-Y",
                          position: "auto left",
                        }}
                        className="form-input"
                        placeholder="Select Date"
                        //   value={input.dateOfBirth}
                        //   onChange={([date]) => setInput({ ...input, dateOfBirth: date })}
                      />
                   <p className="mt-2">To</p>
                   <Flatpickr
                        options={{
                          dateFormat: "d-m-Y",
                          position: "auto left",
                        }}
                        className="form-input"
                        placeholder="Select Date"
                        //   value={input.dateOfBirth}
                        //   onChange={([date]) => setInput({ ...input, dateOfBirth: date })}
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="desc">Reason for absence</label>
                      <textarea
                        id="Remarks"
                        rows={3}
                        className="form-textarea resize-none min-h-[130px]"
                        placeholder="Enter Reason"
                        // value={data.remarks}
                        // onChange={(e) =>
                        //   setData({ ...data, Remarks: e.target.value })
                        // }
                      ></textarea>
                    </div>

                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger gap-2"
                        onClick={closeAddLeaveModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={handleSaveLeave}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />
                        ) : (
                          "Save"
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



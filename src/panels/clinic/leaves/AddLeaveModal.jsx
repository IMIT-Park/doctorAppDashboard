import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconPlus from "../../../components/Icon/IconPlus";
import IconX from "../../../components/Icon/IconX";
import axios from "axios";

const AddLeave = ({
  addLeaveModal,
  handleSaveLeave,
  saveDoctor,
  buttonLoading,
  closeAddLeaveModal,
  allDoctorNames,
}) => {

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);


  const [leaveType, setLeaveType] = useState("Full Day");
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = async ([date]) => {
    const clinicId = userData?.UserClinic[0]?.clinic_id;
    setSelectedDate(date); 
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
      const response = await axios.post(
        `https://36ee-2405-201-f018-10d6-8d1f-d396-2fe5-6909.ngrok-free.app/api/v1/doctor/getTimeSlot/${clinicId}`,
        { date: formattedDate }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };
  

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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={closeAddLeaveModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="text-lg font-bold bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  New Leave
                </div>
                <div className="p-5">
                  <form>
                  <div className="mb-8">
                      <label htmlFor="ChooseDoctor">Choose Doctor</label>
                      <select
                        id="ChooseDoctor"
                        className="form-select text-white-dark"
                        required
                      >
                        <option value="">Choose Doctor</option>
                        {allDoctorNames.map((doctor) => (
                          <option key={doctor.doctor_id} value={doctor.doctor_id}>
                            {doctor.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="mds-name">Select Duration</label>

                      <div className="flex items-center flex-wrap gap-3 justify-stretch mb-8 mt-3">
                        <div>
                          <label className="inline-flex">
                            <input
                              type="radio"
                              name="default_radio"
                              className="form-radio text-success"
                              value="Full Day"
                              checked={leaveType === "Full Day"}
                              onChange={() => setLeaveType("Full Day")}
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
                              value="Multiple"
                              checked={leaveType === "Multiple"}
                              onChange={() => setLeaveType("Multiple")}
                            />
                            <span>Multiple</span>
                          </label>
                        </div>
                        <div>
                          <label className="inline-flex">
                            <input
                              type="radio"
                              name="default_radio"
                              className="form-radio text-success"
                              value="By Shift"
                              checked={leaveType === "By Shift"}
                              onChange={() => setLeaveType("By Shift")}
                            />
                            <span>By Shift</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {leaveType == "Full Day" && (
                      <div className="mb-5">
                         <label htmlFor="gender">Date</label>
                         <div>
                            <Flatpickr
                              options={{
                                dateFormat: "d-m-Y",
                                position: "auto left",
                              }}
                              className="form-input mb-5"
                              placeholder="Select Date"
                              value={selectedDate}
                              onChange={handleDateChange}
                            />
                          </div>
                        {/* <div className="space-y-2">
                          {[
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ].map((day) => (
                            <div key={day}>
                              <label className="inline-flex">
                                <input
                                  type="checkbox"
                                  className="form-checkbox text-secondary"
                                />
                                <span>{day}</span>
                              </label>
                              <div className="flex items-center ml-5">
                                <p className="text-sm text-gray-500">
                                  Time slot
                                </p>
                                <span className="badge badge-outline-dark text-gray-500 ml-2">
                                  10AM-12PM
                                </span>
                                <span className="badge badge-outline-dark text-gray-500 ml-2">
                                  1PM-3PM
                                </span>
                              </div>
                              <hr className="my-4" />
                            </div>
                          ))}
                        </div> */}
                      </div>
                    )}

                    {leaveType === "Multiple" && (
                      <div className="mb-5">
                        <label htmlFor="date">
                          You can select multiple dates.
                        </label>
                        <div className="flex items-center flex-wrap gap-3 justify-self-start mb-12 mt-3">
                          <div>
                            <p className="mt-2">From</p>
                          </div>
                          <div>
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
                          <div>
                            <p className="mt-2">To</p>
                          </div>
                          <div>
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
                        </div>
                      </div>
                    )}

                    {leaveType === "By Shift" && (
                      <div className="mb-5">
                          <label htmlFor="gender">Date</label>
                         <div>
                            <Flatpickr
                              options={{
                                dateFormat: "d-m-Y",
                                position: "auto left",
                              }}
                              className="form-input mb-5"
                              placeholder="Select Date"
                              //   value={input.dateOfBirth}
                              //   onChange={([date]) => setInput({ ...input, dateOfBirth: date })}
                            />
                          </div>
                        {/* <label htmlFor="date">You can select Time slots.</label> */}
                        {/* {daysOfWeek.map(day => (
                          <div key={day}>
                            <p className="text-lg">{day}</p>
                            <div className="inline-flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox m-2"
                              />
                              <span className="badge badge-outline-dark text-gray-500 mr-2">
                                10AM-12PM
                              </span>
                              <input
                                type="checkbox"
                                className="form-checkbox m-2"
                              />
                              <span className="badge badge-outline-dark text-gray-500">
                                1PM-3PM
                              </span>
                            </div>
                            <hr className="my-4"/>
                          </div>
                        ))} */}
                      </div>
                    )}

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

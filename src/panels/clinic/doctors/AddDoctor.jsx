import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import IconPlus from "../../../components/Icon/IconPlus";
import IconX from "../../../components/Icon/IconX";

const AddDoctor = ({
  addDoctorModal,
  handleSelectDays,
  saveDoctor,
  buttonLoading,
  closeAddDoctorModal,
}) => {
  const [drProfilePic, setDrProfilePic] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDrProfilePic(file);
  };

  const handleSubmit = () => {
    saveDoctor();
  };

  return (
    <Transition appear show={addDoctorModal} as={Fragment}>
      <Dialog
        as="div"
        open={addDoctorModal}
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
                <div className="p-5">
                  <form>
                    <div className="flex flex-col justify-center items-center">
                      <div className="relative w-36 h-36 rounded-full dark:bg-[#121c2c] bg-gray-200 mb-5 flex justify-center items-center">
                        <label
                          htmlFor="fileInput"
                          className="cursor-pointer"
                          title="Upload profile picture"
                        >
                          {drProfilePic ? (
                            <img
                              src={URL.createObjectURL(drProfilePic)}
                              alt="Selected"
                              className=" w-36 h-36 rounded-full object-cover"
                            />
                          ) : (
                            <IconPlus className="text-slate-600 w-24 h-24" />
                          )}
                          <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="mds-name">Doctor Name</label>
                      <input
                        id="dr-name"
                        type="text"
                        placeholder="Enter Doctor Name"
                        className="form-input"
                        // value={data.dr_name}
                        // onChange={(e) =>
                        //   setData({ ...data, dr_name: e.target.value })
                        // }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="mds-name">Phone</label>
                      <input
                        id="dr-phone"
                        type="number"
                        placeholder="Enter Phone Number"
                        className="form-input"
                        // value={data.dr_phone}
                        // onChange={(e) =>
                        //   setData({ ...data, dr_phone: e.target.value })
                        // }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="mds-name">Email</label>
                      <input
                        id="dr-email"
                        type="text"
                        placeholder="Enter Email"
                        className="form-input"
                        // value={data.dr_email}
                        // onChange={(e) =>
                        //   setData({ ...data,dr_email: e.target.value })
                        // }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="mds-name">Experience</label>
                      <input
                        id="dr-experience"
                        type="text"
                        placeholder="Enter Experience"
                        className="form-input"
                        // value={data.dr_experience}
                        // onChange={(e) =>
                        //   setData({ ...data, dr_experience: e.target.value })
                        // }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="mds-name">Specialization</label>
                      <input
                        id="dr-specialization"
                        type="text"
                        placeholder="Enter Doctor Specialization"
                        className="form-input"
                        // value={data.dr_specialization}
                        // onChange={(e) =>
                        //   setData({ ...data, dr_specialization: e.target.value })
                        // }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="desc">Re</label>
                      <textarea
                        id="Remarks"
                        rows={3}
                        className="form-textarea resize-none min-h-[130px]"
                        placeholder="Enter Remarks"
                        // value={data.remarks}
                        // onChange={(e) =>
                        //   setData({ ...data, Remarks: e.target.value })
                        // }
                      ></textarea>
                    </div>

                    <div className="mb-5">
                      <label className="inline-flex cursor-pointer">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="text-white-dark relative checked:bg-none">
                          Hide your Profile in Website
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger gap-2"
                        onClick={closeAddDoctorModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={handleSelectDays}
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

export default AddDoctor;

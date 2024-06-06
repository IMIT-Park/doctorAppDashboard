import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconCaretDown from "../../../../components/Icon/IconCaretDown";

import AnimateHeight from "react-animate-height";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconLockDots from "../../../../components/Icon/IconLockDots";
import IconEye from "../../../../components/Icon/IconEye";
import IconCloseEye from "../../../../components/Icon/IconCloseEye";

const DoctorPassword = ({
  addDoctorPasswordModal,
  closeDoctorPasswordModal,
  buttonLoading,
  showPassword,
  setShowPassword,
  data,
  setData,
}) => {
  return (
    <Transition appear show={addDoctorPasswordModal} as={Fragment}>
      <Dialog
        as="div"
        open={addDoctorPasswordModal}
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
                    onClick={closeDoctorPasswordModal}
                  >
                    <IconCaretDown className="rotate-90" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-lg font-bold pl-7 py-1 ltr:pr-[50px] rtl:pl-[50px]">
                    Set Password
                  </div>
                </div>

                <div>
                  <form>
                    <div className="p-8">
                      <div>
                        <label htmlFor="Email">Password</label>
                        <div className="relative text-white-dark">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="form-input ps-10 pr-9 placeholder:text-white-dark"
                            value={data.password}
                            onChange={(e) =>
                              setData({ ...data, password: e.target.value })
                            }
                            // onKeyDown={handleNewPasswordKeyDown}
                          />
                          <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconLockDots fill={true} />
                          </span>
                          <span
                            title={
                              showPassword ? "hide password" : "show password"
                            }
                            className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <IconEye /> : <IconCloseEye />}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <label htmlFor="Email">Confirm Password</label>
                        <div className="relative text-white-dark">
                          <input
                            id="Confirm Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="confirmPassword"
                            className="form-input ps-10 pr-9 placeholder:text-white-dark"
                            value={data.confirmPassword}
                            onChange={(e) =>
                              setData({
                                ...data,
                                confirmPassword: e.target.value,
                              })
                            }
                            // onKeyDown={handleNewPasswordKeyDown}
                          />
                          <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconLockDots fill={true} />
                          </span>
                          <span
                            title={
                              showPassword ? "hide password" : "show password"
                            }
                            className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <IconEye /> : <IconCloseEye />}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end items-center p-8">
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        // onClick={handleSubmit}
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

export default DoctorPassword;

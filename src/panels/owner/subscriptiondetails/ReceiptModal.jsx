import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import IconX from "../../../components/Icon/IconX";
import { useParams } from "react-router-dom";
import IconLoader from "../../../components/Icon/IconLoader";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import noProfile from "/assets/images/empty-user.png";
import Swal from "sweetalert2";

const ReceiptModal = ({ open, close }) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        open={open}
        onClose={() => {
          close();
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-4xl text-black dark:text-white-dark">
                <div className="p-3">
                  <div className="p-3 flex items-center relative">
                    <div className="text-2xl text-black font-bold dark:text-green-700 flex-grow">
                      Receipt
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        close();
                      }}
                      className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    >
                      <IconX />
                    </button>
                  </div>
                  <div className="border dark:border-gray-600"></div>
                  <div className="mt-2 p-3">
                    <div className="flex flex-col md:flex-row mt-3 md:mb-3">
                      <div className="flex md:flex-col md:w-7/12 sm:gap-2 md:gap-0">
                        <div>
                          <div className="text-[#AAAAAA] dark:text-green-700 sm:w-36">
                            Bill Date:
                          </div>
                        </div>
                        <div className="dark:text-gray-300"> 24/06/2024 </div>
                      </div>
                      <div className="flex md:flex-col md:w-8/12 sm:gap-2 md:gap-0">
                        <div className="md:ml-3 text-[#AAAAAA] dark:text-green-700 sm:w-36">
                          Payment Date:
                        </div>
                        <div className="md:ml-3 dark:text-gray-300">
                          24/06/2024
                        </div>
                      </div>
                      <div className="flex md:flex-col md:w-2/12 sm:gap-2 md:gap-0">
                        <div className="flex justify-start text-[#AAAAAA] dark:text-green-700 sm:w-36">
                          Invoice No:
                        </div>
                        <div className="flex justify-start dark:text-gray-300">
                          dfbnrn3r50
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-slate-800 rounded">
                    <div className="mt-3 flex flex-col md:flex-row justify-between gap-7">
                      <div className="md:w-5/12">
                        <div className="text-[#AAAAAA] dark:text-green-700">
                          Bill To:
                        </div>
                        <div className="mt-2 dark:text-gray-300">
                          Ann Dental Clinic LF Tower, Tana,
                        </div>
                        <div className="dark:text-gray-300">Irinjalakuda,</div>
                        <div className="dark:text-gray-300">Kerala</div>
                        <div className="dark:text-gray-300">680 683</div>
                        <div className="mt-3 dark:text-gray-300">
                          +91 7559 XXXXXX
                        </div>
                      </div>
                      <div className="md:w-8/12">
                        <div className="font-bold text-lg dark:text-green-700">
                          Payment:
                        </div>
                        <div className="mt-2 flex flex-row min-h-16">
                          <div className="w-8/12 text-[#6E6E6E] dark:text-gray-300">
                            Visa...
                          </div>
                          <div className="w-4/12 flex justify-end text-[#6E6E6E] dark:text-gray-300">
                            ₹ 200
                          </div>
                        </div>
                        <div className="border dark:border-gray-600"></div>
                        <div className="flex flex-row">
                          <div className="mt-2 w-8/12 text-[#6E6E6E] dark:text-gray-300">
                            Received Payment
                          </div>
                          <div className="mt-2 w-4/12 flex justify-end text-[#6E6E6E] dark:text-gray-300">
                            ₹ 200
                          </div>
                        </div>
                        <div className="border mt-3 border-gray-600"></div>
                        <div className="flex flex-row">
                          <div className="mt-2 w-8/12 font-semibold text-xl dark:text-green-700">
                            Total
                          </div>
                          <div className="mt-2 w-4/12 flex justify-end font-semibold text-xl dark:text-gray-300">
                            ₹ 200
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-7 mb-5 flex flex-col md:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      className="btn gap-2 md:w-3/12 border-green-800 text-green-800 dark:text-gray-300 shadow-none"
                    >
                      Download Receipt
                    </button>
                    <button
                      type="button"
                      className="btn btn-green gap-2 md:w-3/12"
                    >
                      Pay Now
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

export default ReceiptModal;

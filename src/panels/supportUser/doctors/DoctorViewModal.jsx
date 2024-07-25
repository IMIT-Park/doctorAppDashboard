import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import IconX from "../../../components/Icon/IconX";
import { useParams } from "react-router-dom";
import IconLoader from "../../../components/Icon/IconLoader";
import { imageBaseUrl } from "../../../utils/NetworkHandler";
import noProfile from "/assets/images/empty-user.png";

const DoctorViewModal = ({ openModal, CloseDoctorModal, SingleDoctor }) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  return (
    <Transition appear show={openModal} as={Fragment}>
      <Dialog
        as="div"
        open={openModal}
        onClose={() => {
          CloseDoctorModal();
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-xl text-black dark:text-white-dark">
              <button
                  type="button"
                  onClick={() => {
                    CloseDoctorModal();
                  }}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="p-5 pt-10">
                    <div className="mb-8 flex items-center flex-col md:flex-row justify-between gap-8">
                      <div className="w-full">
                        <div className="w-full">
                          {doctorsLoading ? (
                            <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />
                          ) : SingleDoctor ? (
                            <div className="">
                              <div className="relative flex justify-center">
                                <img
                                  src={
                                    SingleDoctor?.photo
                                      ? imageBaseUrl + SingleDoctor?.photo
                                      : noProfile
                                  }
                                  alt={SingleDoctor.name || ""}
                                  className="w-40 h-40 rounded-full object-cover mb-2 mt-2"
                                />
                              </div>
                              <div className="mt-2 text-center">
                                <div className="font-semibold text-xl">
                                  {SingleDoctor.name}
                                </div>
                                <div className="text-lg p-2 text-gray-600">
                                  {SingleDoctor.email}
                                </div>
                                <div className="text-lg p-2 text-gray-600">
                                  {SingleDoctor.phone}
                                </div>
                                <div className="text-lg p-2 text-gray-600">
                                  {SingleDoctor.gender}
                                </div>
                                <div className="text-lg p-2 text-gray-600">
                                  {SingleDoctor.qualification}
                                </div>
                                <div className="text-lg p-2 text-gray-600">
                                  {SingleDoctor.specialization}
                                </div>
                                <div className="text-lg p-2 text-gray-600">
                                  {SingleDoctor.address}
                                </div>
                                <div className="text-lg p-2 text-gray-600">
                                  {SingleDoctor.fees}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500">
                              No doctor selected
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-danger gap-2"
                        onClick={() => {
                          CloseDoctorModal();
                        }}
                      >
                        Reject
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

export default DoctorViewModal;

import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import IconX from "../../../components/Icon/IconX";
import { useParams } from "react-router-dom";
import IconLoader from "../../../components/Icon/IconLoader";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import noProfile from "/assets/images/empty-user.png";
import Swal from "sweetalert2";
import ConfirmationModal from "./ConfirmationModal";

const DoctorViewModal = ({ openModal, CloseDoctorModal, SingleDoctor }) => {
  const { doctorId } = useParams();
  const [rejectButtonLoading, setRejectButtonLoading] = useState(false);
  const [verifyButtonLoading, setVerifyButtonLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAction = (status) => {
    setActionStatus(status);
    setShowConfirmation(true);
  };

  const updateDoctorStatus = async (status) => {
    if (!SingleDoctor?.doctor_id) {
      console.error("Doctor ID is undefined");
      return;
    }

    if (status === 0) setRejectButtonLoading(true);
    if (status === 1) setVerifyButtonLoading(true);

    try {
      await NetworkHandler.makePutRequest(
        `/v1/supportuser/verifyDoctor/${SingleDoctor.doctor_id}`,
        { status }
      );
      Swal.fire({
        icon: status === 0 ? "success" : "success",
        title: `Doctor ${status === 0 ? "rejected" : "verified"} successfully!`,
        padding: "2em",
        customClass: "sweet-alerts",
      });
    } catch (e) {
      console.error("Error:", e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the doctor's status.",
        padding: "2em",
        customClass: "sweet-alerts",
      });
    } finally {
      if (status === 0) setRejectButtonLoading(false);
      if (status === 1) setVerifyButtonLoading(false);
      CloseDoctorModal();
    }
  };

  const confirmAction = () => {
    updateDoctorStatus(actionStatus);
    setShowConfirmation(false);
  };

  const cancelAction = () => {
    setShowConfirmation(false);
  };

  ConfirmationModal({
    show: showConfirmation,
    status: actionStatus,
    onConfirm: confirmAction,
    onClose: cancelAction,
  });

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
                            <div className="flex flex-col relative justify-center items-center">
                              <img
                                src={
                                  SingleDoctor?.photo
                                    ? imageBaseUrl + SingleDoctor?.photo
                                    : noProfile
                                }
                                alt={SingleDoctor.name || ""}
                                className="w-36 h-36 rounded-full object-cover mb-2 mt-2"
                              />
                              <div className="font-semibold text-3xl dark:text-green-600">
                                {SingleDoctor.name}
                              </div>
                            </div>
                            <div className="mt-2 flex flex-col md:flex-row gap-2">
                              <div className="w-full md:w-4/5 flex flex-row justify-center bg-gray-100 dark:bg-slate-800">
                                <div className="text-md p-1 font-bold text-black dark:text-gray-400">
                                  Email:
                                </div>
                                <div className="text-md p-1 text-gray-600 dark:text-gray-300">
                                  {SingleDoctor.email}
                                </div>
                              </div>
                              <div className="w-full md:w-1/2 flex flex-row justify-center bg-gray-100 dark:bg-slate-800">
                                <div className="text-md p-1 font-bold text-black dark:text-gray-400">
                                  Fees:
                                </div>
                                <div className="text-md p-1 text-gray-600 dark:text-gray-300">
                                  ₹{SingleDoctor.fees}
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 flex flex-col md:flex-row gap-2">
                              <div className="w-full md:w-1/2 flex flex-row justify-center bg-gray-100 dark:bg-slate-800">
                                <div className="text-md p-1 font-bold text-black dark:text-gray-400">
                                  Phone:
                                </div>
                                <div className="text-md p-1 text-gray-600 dark:text-gray-300">
                                  {SingleDoctor.phone}
                                </div>
                              </div>
                              <div className="w-full md:w-1/2 flex flex-row justify-center bg-gray-100 dark:bg-slate-800">
                                <div className="text-md p-1 font-bold text-black dark:text-gray-400">
                                  Gender:
                                </div>
                                <div className="text-md p-1 text-gray-600 dark:text-gray-300">
                                  {SingleDoctor.gender}
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 flex flex-col md:flex-row gap-2">
                              <div className="w-full md:w-1/2 flex flex-row justify-center bg-gray-100 dark:bg-slate-800">
                                <div className="text-md p-1 font-bold text-black dark:text-gray-400">
                                  Qualification:
                                </div>
                                <div className="text-md p-1 text-gray-600 dark:text-gray-300">
                                  {SingleDoctor.qualification}
                                </div>
                              </div>
                              <div className="w-full md:w-4/5 flex flex-row justify-center bg-gray-100 dark:bg-slate-800">
                                <div className="text-md p-1 font-bold text-black dark:text-gray-400">
                                  Specialization:
                                </div>
                                <div className="text-md p-1 text-gray-600 dark:text-gray-300">
                                  {SingleDoctor.specialization}
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 flex flex-row justify-center bg-gray-100 dark:bg-slate-800">
                              <div className="text-md p-1 font-bold text-black dark:text-gray-400">
                                Address:
                              </div>
                              <div className="text-md p-1 text-gray-600 dark:text-gray-300 min-h-14">
                                {SingleDoctor.address}
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
                  <div className="mt-8 flex flex-row gap-3">
                    <button
                      type="button"
                      className="btn btn-danger gap-2 w-1/2"
                      onClick={() => handleAction(0)}
                    >
                      {rejectButtonLoading ? (
                        <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />
                      ) : (
                        "Reject"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-success gap-2 w-1/2"
                      onClick={() => handleAction(1)}
                    >
                      {verifyButtonLoading ? (
                        <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />
                      ) : (
                        "Verify"
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

export default DoctorViewModal;

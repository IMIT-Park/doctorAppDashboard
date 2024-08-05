import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import tick from "/assets/images/tick.svg";
import close from "/assets/images/redclose.svg";
import CustomSwitch from "../../../components/CustomSwitch";
import useBlockUnblock from "../../../utils/useBlockUnblock";


const ShowSupportUser = ({ open, closeModal , userDetails , fetchdata }) => {
  const { showAlert: showSupportAlert, loading: blockUnblockSalesLoading } =
  useBlockUnblock(fetchdata);
  const handleSwitchToggle = () => {
    const action = userDetails?.User?.status ? "block" : "activate";
    showSupportAlert(userDetails?.user_id, action, "support user");
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>

                <div className="flex items-center flex-wrap gap-2 text-xl font-bold bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  <div className="ltr:mr-3 rtl:ml-3 capitalize">
                    {userDetails.name}
                  </div>
                </div>

                <ul className="flex flex-col space-y-4 font-semibold text-black dark:text-gray-500 p-5">
                  <div className="flex  justify-end">
                  <CustomSwitch
                        checked={userDetails?.User?.status}
                        onChange={
                          handleSwitchToggle
                        }
                        tooltipText={
                          userDetails?.User?.status ? "Block" : "Unblock"
                        }
                        uniqueId={`support${userDetails?.supportuser_id}`}
                        size="normal"
                      />
                  </div>
                 
                  <div className="flex items-center gap-4">
                    <li className="w-20 text-black dark:text-gray-500">Email :</li>
                    <li className="flex items-center gap-2 border border-gray-800 rounded w-10/12 p-2">
                      <span
                        className="whitespace-nowrap text-black dark:text-green-500 "
                        dir="ltr"
                      >
                        {userDetails.email}
                      </span>
                    </li>
                  </div>
                  <div className="flex gap-4">
                    <li className="w-20">Phone no :</li>
                    <li className="flex items-center gap-2 border border-gray-800 rounded px-2 py-2 w-10/12">
                      <span className="whitespace-nowrap" dir="ltr">
                        {userDetails.phone}
                      </span>
                    </li>
                  </div>
                  <div className="flex items-start gap-4">
                    <li className="w-20">Address :</li>
                    <li className="flex items-center gap-2 border border-gray-800 rounded w-10/12 min-h-20 px-2 py-2">
                      <span
                        className=""
                        dir="ltr"
                      >
                        {userDetails.address}
                      </span>
                    </li>
                  </div>
                  <div className="flex items-start gap-4">
                    <li className="w-24">Permissions :</li>
                    <div className="flex flex-col gap-2">
                    <div className="flex gap-4"><img className="w-4" src={userDetails?.chat_access ? tick :close } alt="" /><li>Chat Access</li></div>
                   <div className="flex gap-4"><img className="w-4" src={userDetails?.website_leads_access ? tick : close} alt="" /><li>Website Lead Access</li></div>
                   <div className="flex gap-4"><img className="w-4" src={userDetails?.doctor_verify_access ? tick : close} alt="" /><li>Doctor Verify Access</li></div>
                    </div>
                  
                  </div>
                </ul>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShowSupportUser;

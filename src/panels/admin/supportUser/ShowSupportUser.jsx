import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconMail from "../../../components/Icon/IconMail";
import IconPhone from "../../../components/Icon/IconPhone";
import IconMapPin from "../../../components/Icon/IconMapPin";

const ShowSupportUser = ({open, closeModal, details }) => {
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
                <div className="flex flex-col items-center flex-wrap gap-2 text-lg font-bold  bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  <div className="ltr:mr-3 rtl:ml-3 capitalize">
                    {details.name}
                  </div>
                  <div className="flex flex-col">
                  <ul className="flex flex-col space-y-4 font-semibold text-white-dark">
                    <li>
                      <button className="flex items-center gap-2">
                        <IconMail className="w-5 h-5 shrink-0" />
                        <span className="text-[#006241] truncate">
                          {details.email}
                        </span>
                      </button>
                    </li>
                    <li className="flex items-center gap-2">
                      <IconPhone className="w-5 h-5 shrink-0" />
                      <span className="whitespace-nowrap" dir="ltr">
                        {details.phone}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <IconMapPin className="shrink-0" />
                      {details.address}
                    </li>
                  </ul>
                  </div>
                </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
  )
}

export default ShowSupportUser

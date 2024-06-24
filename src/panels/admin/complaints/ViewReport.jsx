import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import IconMail from "../../../components/Icon/IconMail";
import IconPhone from "../../../components/Icon/IconPhone";
import IconOpenBook from "../../../components/Icon/IconOpenBook";

const ViewReport = ({ open, closeModal,details }) => {
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
                <div className="p-5">
                  <ul className="flex flex-col space-y-4 font-semibold text-white-dark">
                    <li>
                      <button className="flex items-start gap-2">
                        {/* <IconMail className="w-5 h-5 shrink-0" /> */}
                        <div className="text-gray-500 flex justify-between min-w-16">Email <span>:</span></div>
                        <span className="text-gray-500 dark:text-slate-300">
                          {details.email}
                        </span>
                      </button>
                    </li>
                    <li className="flex items-start gap-2">
                      {/* <IconPhone className="w-5 h-5 shrink-0" /> */}
                      <div className="text-gray-500 flex justify-between min-w-16">Phone <span>:</span></div>
                      <span className="whitespace-nowrap text-gray-500 dark:text-slate-300" dir="ltr">
                        {details.phone}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      {/* <IconOpenBook className="w-5 h-5 shrink-0" /> */}
                      <div className="text-gray-500 flex justify-between min-w-16">Content <span>:</span></div>
                      <span className="text-gray-500 dark:text-slate-300" dir="ltr">
                        {details.content}
                      </span>
                    </li>
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewReport;

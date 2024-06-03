import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";

const ViewReport = ({ open, closeModal }) => {
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
                <div className="flex items-center flex-wrap gap-2 text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  <div className="ltr:mr-3 rtl:ml-3">Reporter</div>
                </div>
                <div className="p-5">
                  <p className="text-primary text-xs mb-1.5 font-bold">
                    25 Sep 2020
                  </p>
                  <h5 className="text-[#3b3f5c] text-[15px] font-bold mb-2 dark:text-white-light">
                    How to Start a Blog in 5 Easy Steps.
                  </h5>
                  <p className="text-white-dark ">
                    Vestibulum vestibulum tortor ut eros tincidunt, ut rutrum
                    elit volutpat.
                  </p>

                  <div className="ltr:text-right rtl:text-left mt-8">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={closeModal}
                    >
                      Close
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

export default ViewReport;

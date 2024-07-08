import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";

const ViewReport = ({ open, closeModal, details }) => {
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
                <div className="flex items-start justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <div>
                    <h5 className="text-base text-[#006241] mb-2">
                      {details?.email}
                    </h5>
                    <p>{details?.phone}</p>
                  </div>
                  <button
                    type="button"
                    className="text-white-dark hover:text-dark"
                    onClick={closeModal}
                  >
                    <IconX />
                  </button>
                </div>
                <div className="p-5">
                  {/* <p>{details?.phone}</p> */}
                  <p>{details?.content}</p>
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

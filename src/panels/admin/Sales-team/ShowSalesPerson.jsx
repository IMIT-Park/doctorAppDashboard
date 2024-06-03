import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";

const ShowSalesPerson = ({ open, closeModal }) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0"></div>
        </Transition.Child>
        <div
          id="profile_modal"
          className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60"
        >
          <div className="flex min-h-screen items-start justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel my-8 w-full max-w-[300px] overflow-hidden rounded-lg border-0">
                <div className="flex items-center justify-end text-white dark:text-white-light">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="text-white-dark hover:text-dark"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-5">
                  <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                    <div className="flex items-center">
                      <div className="flex-none ltr:mr-2 rtl:ml-2 text-white-dark">
                        Name :
                      </div>
                      <div className="truncate text-white-dark">
                        Paul Thomson
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-none ltr:mr-2 rtl:ml-2 text-white-dark">
                        Email :
                      </div>
                      <div className="truncate text-white-dark">
                        alan@mail.com
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-none ltr:mr-2 rtl:ml-2 text-white-dark">
                        Phone :
                      </div>
                      <div className="text-white-dark">+1 202 555 0197</div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-none ltr:mr-2 rtl:ml-2 text-white-dark">
                        Address :
                      </div>
                      <div className="text-white-dark">Boston, USA</div>
                    </div>
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

export default ShowSalesPerson;

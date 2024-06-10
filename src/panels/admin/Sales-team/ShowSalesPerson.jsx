import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import IconMapPin from "../../../components/Icon/IconMapPin";
import IconMail from "../../../components/Icon/IconMail";
import IconPhone from "../../../components/Icon/IconPhone";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCopy from "../../../components/Icon/IconCopy";
import Swal from "sweetalert2";

const ShowSalesPerson = ({ open, closeModal,details }) => {
  const [message1, setMessage1] = useState("");

  useEffect(() => {
    if (details) {
      setMessage1(`http://www.admin-dashboard.com/${details.salespersoncode}`);
    }
  }, [details]);

  const showMessage = (message = "") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
    });
    toast.fire({
      icon: "success",
      title: message || "Copied successfully.",
      padding: "10px 20px",
    });
  };

  if (!details) return null;


  console.log(details);
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
                  <div className="ltr:mr-3 rtl:ml-3">{details.name}</div>
                </div>
                <div className="p-5">
                  <ul className="flex flex-col space-y-4 font-semibold text-white-dark">
                    <li>
                      <button className="flex items-center gap-2">
                        <IconMail className="w-5 h-5 shrink-0" />
                        <span className="text-primary truncate">
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

                  <div className="bg-[#f1f2f3] p-2 rounded dark:bg-[#060818] mt-5">
                    <form>
                      <input
                        type="text"
                        value={message1}
                        className="form-input"
                        onChange={(e) => setMessage1(e.target.value)}
                      />
                      <div className="mt-1">
                        <CopyToClipboard
                          text={message1}
                          onCopy={(text, result) => {
                            if (result) {
                              showMessage();
                            }
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-primary px-2 ml-auto"
                          >
                            <IconCopy className="ltr:mr-2 rtl:ml-2" />
                            Copy
                          </button>
                        </CopyToClipboard>
                      </div>
                    </form>
                  </div>

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

export default ShowSalesPerson;

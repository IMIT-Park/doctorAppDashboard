import { useContext, useEffect, useState, Fragment } from "react";
import "tippy.js/dist/tippy.css";
import { Dialog, Transition } from "@headlessui/react";
import IconLoader from "../../../components/Icon/IconLoader";
import IconX from "../../../components/Icon/IconX";
import { UserContext } from "../../../contexts/UseContext";
import NetworkHandler from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";

const RequestToDoctor = ({
  open,
  closeModal,
  email,
  setEmail,
  fetchClinicData,
}) => {
  const { userDetails } = useContext(UserContext);
  const clinicId = userDetails?.UserClinic?.[0]?.clinic_id || "";

  const [message, setMessage] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequest = async (e) => {
    e.preventDefault();

    if(!email) {
      showMessage("Please enter email address.", "warning");
      return;
    }

    if (!validateEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      setIsValidEmail(false);
      return;
    }

    setButtonLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/clinic/createRequest`,
        {
          clinic_id: clinicId,
          email: email,
        }
      );

      if (response?.status === 201) {
        showMessage("Request sent successfully!", "success");
        setMessage("Request sent successfully!");
        closeModal();
        fetchClinicData();
      } else {
        showMessage("Failed to send request.", "error");
        setMessage("Failed to send request.");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        showMessage(
          error?.response?.data?.error ||
            "An error occurred. Please try again.",
          "error"
        );
      } else {
        showMessage("An error occurred. Please try again.", "error");
      }
    } finally {
      setButtonLoading(false);
    }
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
                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  Send Request to Doctor
                </div>
                <div className="p-5">
                  <form onSubmit={handleRequest}>
                    <div className="mb-5">
                      <label htmlFor="full-name">Email</label>
                      <input
                        id="full-name"
                        type="text"
                        placeholder="Enter Email"
                        className={`form-input form-input-green ${
                          isValidEmail ? "" : "border-red-500"
                        }`}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setIsValidEmail(true);
                        }}
                      />
                    </div>
                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="submit"
                        className="btn btn-green ltr:ml-4 rtl:mr-4"
                        disabled={buttonLoading}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
                        ) : (
                          "Send"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RequestToDoctor;

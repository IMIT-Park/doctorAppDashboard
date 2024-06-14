import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SearchPatientsModal = ({ open, closeModal, details }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (details) {
      setPhoneNumber("");
    }
  }, [details]);

  const navigate = useNavigate();

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const doctorId = details?.doctor_id; // Assuming `details` contains `doctor_id`
    if (doctorId) {
      navigate(`/clinic/bookings/${doctorId}/patients`);
    }
  };

  if (!details) return null;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={closeModal} className="relative z-[51]">
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
                  <div className="mb-5 mt-16">
                    <form onSubmit={handleSubmit}>
                      <input
                        type="tel"
                        placeholder="Enter Your Phone Number"
                        className="form-input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className="btn btn-primary mt-6 ml-auto mr-auto"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                  <div className="ltr:text-right rtl:text-left mt-8">
                    <button
                      type="button"
                      className="btn btn-outline-danger ml-auto"
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

export default SearchPatientsModal;

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import MaskedInput from "react-text-mask";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import IconLockDots from "../../../components/Icon/IconLockDots";
import IconEye from "../../../components/Icon/IconEye";
import IconCloseEye from "../../../components/Icon/IconCloseEye";

const ModalPage = () => {
  const { planId } = useParams(); // Extract planId from URL params
  const [selectedClinics, setSelectedClinics] = useState([]);

  // Simulated clinics data for demonstration
  const clinics = [
    { id: 1, name: "Clinic A" },
    { id: 2, name: "Clinic B" },
    { id: 3, name: "Clinic C" },
  ];

  const handleCheckboxChange = (clinicId) => {
    if (selectedClinics.includes(clinicId)) {
      setSelectedClinics((prev) => prev.filter((id) => id !== clinicId));
    } else {
      setSelectedClinics((prev) => [...prev, clinicId]);
    }
  };

  const handleConfirmPurchase = () => {
    // Implement purchase logic with selectedClinics and planId
    console.log("Confirming purchase for planId:", planId);
    console.log("Selected clinics:", selectedClinics);
    // Add your logic to finalize purchase
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
                  Add Clinic
                </div>
                <div className="p-5">
                  <form onSubmit={handleSubmitAdd}>
                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-0 rtl:mr-0 shrink-0" />
                        ) : (
                          "Add"
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
export default ModalPage;

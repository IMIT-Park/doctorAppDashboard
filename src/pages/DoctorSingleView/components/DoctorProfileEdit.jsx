import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";

const DoctorProfileEdit = ({
  open,
  closeModal,
  buttonLoading,
  profilePicture,
  setProfilePicture,
  formSubmit,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    formSubmit();
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
                  Edit Photo
                </div>
                <div className="p-5">
                  <form>
                    <label
                      htmlFor="fileInput"
                      className="relative cursor-pointer form-input bg-[#f1f2f3] dark:bg-[#121E32]"
                    >
                      <span className="z-10">Select the image</span>
                      <input
                        id="fileInput"
                        type="file"
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                      />
                    </label>
                    {profilePicture && (
                      <div className="mt-2 relative">
                        <img
                          src={URL.createObjectURL(profilePicture)}
                          alt="Selected"
                          className="max-w-full h-auto"
                        />
                        <button
                          type="button"
                          className="
                          absolute top-1 right-1 btn btn-dark w-9 h-9 p-0 rounded-full"
                          onClick={(e) => setProfilePicture(null)}
                        >
                          <IconX />
                        </button>
                      </div>
                    )}
                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={handleSubmit}
                        disabled={buttonLoading}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
                        ) : (
                          "Submit"
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

export default DoctorProfileEdit;

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import MaskedInput from "react-text-mask";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";

const AddClinic = ({
  open,
  closeModal,
  handleFileChange,
  saveUser,
  data,
  setData,
  handleRemoveImage,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear the error when password is changed
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    saveUser();
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
                  <form>
                    <div className="mb-5">
                      <label htmlFor="first-name">Name</label>
                      <input
                        id="first-name"
                        type="text"
                        placeholder="Enter First Name"
                        className="form-input"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter Email"
                        className="form-input"
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="number">Phone Number</label>
                      <MaskedInput
                        id="phoneMask"
                        type="text"
                        placeholder="Enter Phone Number"
                        className="form-input"
                        mask={[
                          "+",
                          "9",
                          "1",
                          " ",
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                          /[0-9]/,
                        ]}
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="title">Picture</label>
                      <label
                        htmlFor="fileInput"
                        className="relative cursor-pointer form-input bg-[#f1f2f3] dark:bg-[#121E32]"
                      >
                        <span className="z-10">Select the image</span>
                        <input
                          id="fileInput"
                          type="file"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                      {data?.picture && (
                        <div className="mt-2 relative">
                          <img
                            src={URL.createObjectURL(data?.picture)}
                            alt="Selected"
                            className="max-w-full h-auto"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 btn btn-dark w-9 h-9 p-0 rounded-full"
                            onClick={handleRemoveImage}
                          >
                            <IconX />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mb-5">
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter Password"
                        className="form-input"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="confirm-password">Confirm Password</label>
                      <input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm Password"
                        className="form-input"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-2">
                          {passwordError}
                        </p>
                      )}
                    </div>

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
                      >
                        Add
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

export default AddClinic;

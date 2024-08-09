import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import IconX from "../../../components/Icon/IconX";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
const OwnerProfileEditModal = ({
  open,
  closeModal,
  formSubmit,
  input,
  setInput,
  fetchdata,
  errors,
  setErrors,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    formSubmit();
  };

  const handlePhoneChange = (value) => {
    setInput({ ...input, phone: value });
    if (value.length === 10) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  Edit Profile
                </div>
                <div className="p-5">
                  <form>
                    <div className="mb-5">
                      <label htmlFor="Full-name">Name</label>
                      <input
                        id="Full-name"
                        type="text"
                        placeholder="Enter Full Name"
                        className="form-input form-input-green"
                        value={input?.name}
                        onChange={(e) =>
                          setInput({ ...input, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="user-name">Phone</label>
                      <PhoneNumberInput
                        value={input?.phone}
                        onChange={handlePhoneChange}
                        error={errors?.phone}
                        maxLength="10"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="address">Address</label>
                      <textarea
                        id="location"
                        rows={3}
                        placeholder="Enter Address"
                        className="form-textarea form-textarea-green resize-none min-h-[130px]"
                        value={input?.address}
                        onChange={(e) =>
                          setInput({ ...input, address: e.target.value })
                        }
                      ></textarea>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="user-name">City</label>
                      <input
                        id="user-name"
                        type="text"
                        placeholder="Enter Username"
                        className="form-input form-input-green"
                        value={input?.city}
                        onChange={(e) =>
                          setInput({ ...input, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="user-name">District</label>
                      <input
                        id="user-name"
                        type="text"
                        placeholder="Enter Username"
                        className="form-input form-input-green"
                        value={input?.district || ""}
                        onChange={(e) =>
                          setInput({ ...input, district: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="user-name">State</label>
                      <input
                        id="user-name"
                        type="text"
                        placeholder="Enter Username"
                        className="form-input form-input-green"
                        value={input?.state}
                        onChange={(e) =>
                          setInput({ ...input, state: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="user-name">Country</label>
                      <input
                        id="user-name"
                        type="text"
                        placeholder="Enter Username"
                        className="form-input form-input-green"
                        value={input?.country}
                        onChange={(e) =>
                          setInput({ ...input, country: e.target.value })
                        }
                      />
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
                        onClick={handleSubmit}
                        type="submit"
                        className="btn btn-green ltr:ml-4 rtl:mr-4"
                      >
                        Edit
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

export default OwnerProfileEditModal;

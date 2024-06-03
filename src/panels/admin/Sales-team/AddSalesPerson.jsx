import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import MaskedInput from "react-text-mask";
import IconLoader from "../../../components/Icon/IconLoader";

const AddSalesPerson = ({ open, closeModal, input, setInput, formSubmit }) => {
  const handleSubmit = (e) => {
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
                  Add Sales Person
                </div>
                <div className="p-5">
                  <form>
                    <div className="mb-5">
                      <label htmlFor="first-name">Full Name</label>
                      <input
                        id="full-name"
                        type="text"
                        placeholder="Enter Full Name"
                        className="form-input"
                        value={input?.name}
                        onChange={(e) =>
                          setInput({ ...input, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter Email"
                        className="form-input"
                        value={input?.email}
                        onChange={(e) =>
                          setInput({ ...input, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        type="number"
                        placeholder="Enter Phone Number"
                        className="form-input"
                        value={input?.phone}
                        onChange={(e) =>
                          setInput({ ...input, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="address">Address</label>
                      <textarea
                        id="location"
                        rows={3}
                        placeholder="Enter Address"
                        className="form-textarea resize-none min-h-[130px]"
                        value={input?.address}
                        onChange={(e) =>
                          setInput({ ...input, address: e.target.value })
                        }
                      ></textarea>
                    </div>
                    <div className="mb-5">
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        type="text"
                        placeholder="Enter Password"
                        className="form-input"
                        value={input?.password}
                        onChange={(e) =>
                          setInput({ ...input, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="confirm-password">Confirm Password</label>
                      <input
                        id="confirm-password"
                        type="text"
                        placeholder="Enter Confirm Password"
                        className="form-input"
                        value={input?.confirmPassword}
                        onChange={(e) =>
                          setInput({
                            ...input,
                            confirmPassword: e.target.value,
                          })
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

export default AddSalesPerson;

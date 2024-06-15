import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import IconEye from "../../../components/Icon/IconEye"; // Ensure this path is correct
import IconCloseEye from "../../../components/Icon/IconCloseEye";
const AddSalesPerson = ({
  open,
  closeModal,
  input,
  setInput,
  formSubmit,
  isEditMode,
  emailError,
  setEmailError,
  buttonLoading,
  setButtonLoading,
  showPassword,
  setShowPassword,
  showComfirmPassword,
  setShowComfirmPassword,
}) => {
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setInput({ ...input, email, user_name: email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    await formSubmit();
    setButtonLoading(false);
  };

  useEffect(() => {
    // Check if input.email exists and set the username accordingly
    if (input.email) {
      setInput((prevInput) => ({
        ...prevInput,
        user_name: input.email, // Extract username from email
      }));
    }
  }, [input.email]);

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
                  {isEditMode ? "Edit Sales Person" : "Add Sales Person"}
                </div>
                <div className="p-5">
                  <form>
                    <div className="mb-5">
                      <label htmlFor="full-name">Full Name</label>
                      <input
                        id="full-name"
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
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter Email"
                        className="form-input form-input-green"
                        value={input?.email}
                        onChange={handleEmailChange}
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-1">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <div className="mb-5">
                      <label htmlFor="user-name">User Name</label>
                      <input
                        id="user-name"
                        type="text"
                        placeholder="Enter User Name"
                        className="form-input form-input-green"
                        value={input?.user_name}
                        onChange={(e) =>
                          setInput({ ...input, user_name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        type="number"
                        placeholder="Enter Phone Number"
                        className="form-input form-input-green"
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
                        className="form-textarea form-textarea-green resize-none min-h-[130px]"
                        value={input?.address}
                        onChange={(e) =>
                          setInput({ ...input, address: e.target.value })
                        }
                      ></textarea>
                    </div>

                    {!isEditMode && (
                      <>
                        <div className="mb-5 relative">
                          <label htmlFor="password">Password</label>
                          <div className="relative">
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter Password"
                              className="form-input form-input-green pr-10"
                              value={input?.password}
                              onChange={(e) =>
                                setInput({ ...input, password: e.target.value })
                              }
                            />
                            <span
                              title={
                                showPassword ? "hide password" : "show password"
                              }
                              className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <IconEye /> : <IconCloseEye />}
                            </span>
                          </div>
                        </div>

                        <div className="mb-5 relative">
                          <label htmlFor="confirm-password">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              id="confirm-password"
                              type={showComfirmPassword ? "text" : "password"}
                              placeholder="Enter Confirm Password"
                              className="form-input form-input-green pr-10"
                              value={input?.confirmPassword}
                              onChange={(e) =>
                                setInput({
                                  ...input,
                                  confirmPassword: e.target.value,
                                })
                              }
                            />
                            <span
                              title={
                                showComfirmPassword
                                  ? "hide confirm-password"
                                  : "show confirm-password"
                              }
                              className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                              onClick={() =>
                                setShowComfirmPassword(!showComfirmPassword)
                              }
                            >
                              {showComfirmPassword ? (
                                <IconEye />
                              ) : (
                                <IconCloseEye />
                              )}
                            </span>
                          </div>
                        </div>
                      </>
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
                        className="btn btn-green ltr:ml-4 rtl:mr-4"
                        onClick={handleSubmit}
                        disabled={buttonLoading}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
                        ) : isEditMode ? (
                          "Edit"
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

export default AddSalesPerson;

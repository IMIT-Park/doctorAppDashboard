import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import IconEye from "../../../components/Icon/IconEye";
import IconCloseEye from "../../../components/Icon/IconCloseEye";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import NetworkHandler from "../../../utils/NetworkHandler";

const AddDoctor = ({
  open,
  closeModal,
  input,
  setInput,
  formSubmit,
  isEditMode,
  errors,
  setErrors,
  buttonLoading,
  showPassword,
  setShowPassword,
  showComfirmPassword,
  setShowComfirmPassword,
}) => {
  const [specializations, setSpecializations] = useState([]);

  const fetchSpecializations = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        "/v1/doctor/specializations"
      );
      setSpecializations(response?.data?.specializations);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const handleSpecializationChange = (e) => {
    setInput({ ...input, specialization: e.target.value });
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setInput({ ...input, email, user_name: email });
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email)) {
      setErrors({ ...errors, email: "" });
    } else {
      setErrors({ ...errors, email: "Please enter a valid email address" });
    }
  };

  const handlePhoneChange = (value) => {
    setInput({ ...input, phone: value });
    if (value.length === 10) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setInput({ ...input, confirmPassword: value });
    if (value === input.password) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formSubmit();
  };
  const handleFeesChange = (e) => {
    setInput({ ...input, fees: e.target.value.replace(/\D/g, "") });
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
                  {isEditMode ? "Edit Sales Person" : "Add Sales Person"}
                </div>
                <div className="p-5">
                  <form>
                    <div className="mb-5">
                      {/* <label htmlFor="full-name">Full Name</label> */}
                      <input
                        id="full-name"
                        type="text"
                        placeholder="Enter Full Name"
                        className="form-input form-input-green h-10"
                        value={input?.name}
                        onChange={(e) =>
                          setInput({ ...input, name: e.target.value })
                        }
                      />
                    </div>

                    {!isEditMode && (
                      <div className={`mb-5 ${errors?.email && "has-error"}`}>
                        {/* <label htmlFor="email">Email</label> */}
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter Email"
                          className="form-input form-input-green h-10"
                          value={input?.email}
                          onChange={handleEmailChange}
                        />
                        {errors?.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors?.email}
                          </p>
                        )}
                      </div>
                    )}
                    {!isEditMode && (
                      <div className="mb-5">
                        {/* <label htmlFor="user-name">User Name</label> */}
                        <input
                          id="user-name"
                          type="text"
                          placeholder="Enter User Name"
                          className="form-input form-input-green h-10"
                          value={input?.email}
                          onChange={(e) =>
                            setInput({ ...input, email: e.target.value })
                          }
                          readOnly
                        />
                      </div>
                    )}

                    <div className="mb-5">
                      {/* <label htmlFor="phone">Phone Number</label> */}
                      <PhoneNumberInput
                        value={input?.phone}
                        onChange={handlePhoneChange}
                        error={errors?.phone}
                        maxLength="10"
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="dateOfBirth">Date of Birth</label>
                      <input
                        id="dob"
                        type="date"
                        className="form-input form-input-green h-10"
                        value={input?.dateOfBirth}
                        onChange={(e) =>
                          setInput({ ...input, dateOfBirth: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-5">
                      <label>Select Gender</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            className="form-radio peer text-[#006241]"
                            value="Male"
                            checked={input?.gender === "Male"}
                            onChange={(e) =>
                              setInput({ ...input, gender: e.target.value })
                            }
                          />
                          <span className="text-gray-500">Male</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            className="form-radio peer text-[#006241]"
                            value="Female"
                            checked={input?.gender === "Female"}
                            onChange={(e) =>
                              setInput({ ...input, gender: e.target.value })
                            }
                          />
                          <span className=" text-gray-500">Female</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            className="form-radio peer text-[#006241]"
                            value="Other"
                            checked={input?.gender === "Other"}
                            onChange={(e) =>
                              setInput({ ...input, gender: e.target.value })
                            }
                          />
                          <span className=" text-gray-500">Other</span>
                        </label>
                      </div>
                    </div>
                    <div className="mb-5">
                      {/* <label htmlFor="qualification">Qualification</label> */}
                      <input
                        id="qualification"
                        type="text"
                        placeholder="Enter Qualification"
                        className="form-input form-input-green h-10"
                        value={input?.qualification}
                        onChange={(e) =>
                          setInput({ ...input, qualification: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-5">
                      {/* <label htmlFor="fees">Fees</label> */}
                      <input
                        id="fees"
                        type="tel"
                        placeholder="Enter Fees"
                        className="form-input form-input-green h-10"
                        value={input?.fees}
                        onChange={handleFeesChange}
                      />
                    </div>

                    <div className="mb-5">
                      <select
                        id="specialization"
                        className="form-select form-select-green text-gray-500 h-10"
                        value={input?.specialization}
                        onChange={handleSpecializationChange}
                      >
                        <option value="">Select Specialization</option>
                        {specializations?.map((spec) => (
                          <option key={spec?.id} value={spec.name}>
                            {spec?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-5">
                      {/* <label htmlFor="address">Address</label> */}
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
                          {/* <label htmlFor="password">Password</label> */}
                          <div className="relative">
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter Password"
                              className="form-input form-input-green pr-10 h-10"
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
                          {/* <label htmlFor="confirm-password">
                            Confirm Password
                          </label> */}
                          <div
                            className={`relative ${
                              errors?.confirmPassword && "has-error"
                            }`}
                          >
                            <input
                              id="confirm-password"
                              type={showComfirmPassword ? "text" : "password"}
                              placeholder="Enter Confirm Password"
                              className="form-input form-input-green pr-10 h-10"
                              value={input?.confirmPassword}
                              onChange={handleConfirmPasswordChange}
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
                          {errors?.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors?.confirmPassword}
                            </p>
                          )}
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

export default AddDoctor;

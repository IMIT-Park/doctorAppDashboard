import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import NetworkHandler from "../../../utils/NetworkHandler";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import { reverseformatDate } from "../../../utils/formatDate";

const DoctorDetailsEdit = ({
  open,
  closeModal,
  input,
  setInput,
  buttonLoading,
  formSubmit,
  errors,
  setErrors,
}) => {
  const [specializations, setSpecializations] = useState([]);
  const currentDate = reverseformatDate(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    formSubmit();
  };

  const handleCheckboxChange = (e) => {
    setInput({ ...input, visibility: !e.target.checked });
  };

  const fetchSpecialization = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        "/v1/doctor/specializations"
      );
      setSpecializations(response?.data?.specializations);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch clinic details
  useEffect(() => {
    fetchSpecialization();
  }, []);

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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX />
                </button>
                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                  Edit Doctor
                </div>
                <div className="p-5">
                  <form>
                    <div>
                      <div className="mb-5">
                        <label htmlFor="dr-name">Doctor Name</label>
                        <input
                          id="dr-name"
                          type="text"
                          placeholder="Enter Doctor Name"
                          className="form-input form-input-green"
                          value={input.name}
                          onChange={(e) =>
                            setInput({ ...input, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="mb-5">
                        <label htmlFor="dr-phone">Phone</label>
                        <PhoneNumberInput
                          value={input?.phone}
                          onChange={handlePhoneChange}
                          error={errors?.phone}
                          maxLength="10"
                        />
                      </div>

                      <div className="mb-5">
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter Email"
                          className="form-input form-input-green"
                          value={input.email}
                          onChange={(e) =>
                            setInput({ ...input, email: e.target.value })
                          }
                          readOnly
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="gender">Gender</label>
                        <select
                          id="gender"
                          className="form-select form-input-green text-white-dark"
                          required
                          value={input.gender}
                          onChange={(e) =>
                            setInput({ ...input, gender: e.target.value })
                          }
                        >
                          <option>Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="mb-5">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                          id="dateOfBirth"
                          type="date"
                          className="form-input form-input-green"
                          value={input.dateOfBirth}
                          max={currentDate}
                          onChange={(e) =>
                            setInput({ ...input, dateOfBirth: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="dr-qualification">Qualification</label>
                        <input
                          id="dr-qualification"
                          type="text"
                          placeholder="Enter Qualification"
                          className="form-input form-input-green"
                          value={input.qualification}
                          onChange={(e) =>
                            setInput({
                              ...input,
                              qualification: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="dr-specialization">
                          Specialization
                        </label>
                        <select
                          id="dr-specialization"
                          className="form-select form-select-green text-white-dark"
                          required
                          value={input.specialization}
                          onChange={(e) =>
                            setInput({
                              ...input,
                              specialization: e.target.value,
                            })
                          }
                        >
                          <option>Select Specializtion</option>
                          {specializations?.map((specialization) => (
                            <option
                              key={specialization?.id}
                              value={specialization?.name}
                            >
                              {specialization?.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-5">
                        <label htmlFor="dr-fees">Fees</label>
                        <input
                          id="dr-fees"
                          type="number"
                          placeholder="Enter Fess"
                          className="form-input form-input-green"
                          value={input.fees}
                          onChange={(e) =>
                            setInput({ ...input, fees: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="address">Address</label>
                        <textarea
                          id="address"
                          rows={3}
                          className="form-textarea form-textarea-green resize-none min-h-[130px]"
                          placeholder="Enter Address"
                          value={input.address}
                          onChange={(e) =>
                            setInput({ ...input, address: e.target.value })
                          }
                        ></textarea>
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
                          className="btn btn-green ltr:ml-4 rtl:mr-4 min-w-24"
                          onClick={handleSubmit}
                          disabled={buttonLoading}
                        >
                          {buttonLoading ? (
                            <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
                          ) : (
                            "Edit"
                          )}
                        </button>
                      </div>
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

export default DoctorDetailsEdit;

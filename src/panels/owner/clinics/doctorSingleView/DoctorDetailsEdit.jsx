import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../../components/Icon/IconX";
import IconLoader from "../../../../components/Icon/IconLoader";
import NetworkHandler from "../../../../utils/NetworkHandler";

const DoctorDetailsEdit = ({
  open,
  closeModal,
  input,
  setInput,
  buttonLoading,
  formSubmit,
}) => {
  const [specializations, setSpecializations] = useState([]);

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
                          className="form-input"
                          value={input.name}
                          onChange={(e) =>
                            setInput({ ...input, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="mb-5">
                        <label htmlFor="dr-phone">Phone</label>
                        <input
                          id="dr-phone"
                          type="number"
                          placeholder="Enter Phone Number"
                          className="form-input"
                          value={input.phone}
                          onChange={(e) =>
                            setInput({ ...input, phone: e.target.value })
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
                          value={input.email}
                          onChange={(e) =>
                            setInput({ ...input, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="gender">Gender</label>
                        <select
                          id="gender"
                          className="form-select text-white-dark"
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
                          className="form-input"
                          value={input.dateOfBirth}
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
                          className="form-input"
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
                          className="form-select text-white-dark"
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
                          className="form-input"
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
                          className="form-textarea resize-none min-h-[130px]"
                          placeholder="Enter Address"
                          value={input.address}
                          onChange={(e) =>
                            setInput({ ...input, address: e.target.value })
                          }
                        ></textarea>
                      </div>

                      <div className="mb-5">
                        <label className="inline-flex cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={!input.visibility}
                            onChange={handleCheckboxChange}
                          />
                          <span className="text-white-dark relative checked:bg-none">
                            Hide Profile in Website
                          </span>
                        </label>
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

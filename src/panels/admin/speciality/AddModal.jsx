import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import NetworkHandler from "../../../utils/NetworkHandler";
import IconLoader from "../../../components/Icon/IconLoader";
import { showMessage } from "../../../utils/showMessage";

const AddModal = ({ open, close, selectedSpeciality, isEditmode, id, fetchData, specialization, setSpecialization }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && selectedSpeciality) {
      setSpecialization(selectedSpeciality.name);
    }
  }, [open, selectedSpeciality]);

  const handleInputChange = (e) => {
    setSpecialization(e.target.value);
  };

  //Post API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!specialization.trim()) {
      showMessage("Please fill in the specialization name", "warning");
      return;
    }
    setLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/specialization/create",
        {
          name: specialization,
        }
      );
      showMessage("Specialization added successfully", "success");
      console.log("Successfully added", response.data);
      close();
      setSpecialization("");
      fetchData();
    } catch (error) {
      console.error("Failed to add", error);
      showMessage("Adding specialization failed", "error");
    } finally {
      setLoading(false);
    }
  };

  //Put API
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!specialization.trim()) {
      showMessage("Please fill in the specialization name", "warning");
      return;
    }
    setLoading(true);
    try {
      const response = await NetworkHandler.makePutRequest(
        `v1/specialization/update/${id}`,
        {
          name: specialization,
        }
      );
      showMessage("Specialization Edited successfully", "success");
      console.log("Successfully Edited", response.data);
      close();
      setSpecialization("");
      fetchData();
    } catch (error) {
      console.error("Failed to add", error);
      showMessage("Specialization failed to edit", "error");
    } finally {
      setLoading(false);
    }
  };   

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" onClose={close} className="relative z-[51]">
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
                <div className="flex items-center justify-between px-3 py-5 border-b dark:border-slate-800">
                  <div className="text-lg font-semibold dark:text-slate-200">
                    Add Specialization
                  </div>
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={close}
                      className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    >
                      <IconX />
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={isEditmode ? handleEditSubmit : handleSubmit}
                  className="p-6 space-y-4"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="specializationName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Specialization Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={specialization}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:form-input-green sm:text-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={close}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-green w-20"
                      disabled={loading}
                    >
                      {loading ? (
                        <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
                      ) : (
                        isEditmode ? "Edit" : "Add"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddModal;

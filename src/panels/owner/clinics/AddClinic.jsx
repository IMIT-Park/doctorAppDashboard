import { Fragment, useEffect, useState } from "react";
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
  onSubmit,
  handleSubmit,
  handleRemoveImage,
  buttonLoading,
  isEdit,
}) => {
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handlePasswordChange = (e) => {
    setData({ ...data, password: e.target.value });
    // Clear the error when password is changed
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setData({ ...data, confirmPassword: e.target.value });
    if (e.target.value !== data.password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    handleSubmit();
  };

  useEffect(() => {
    // Parse googleLocation if it is a string
    if (typeof data.googleLocation === "string") {
      try {
        const parsedLocation = JSON.parse(data.googleLocation);
        setData((prevData) => ({
          ...prevData,
          googleLocation: parsedLocation,
        }));
      } catch (error) {
        console.error("Error parsing googleLocation", error);
      }
    }
  }, [data.googleLocation]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          setData((prevData) => ({
            ...prevData,
            googleLocation: { lat, long },
          }));
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Error getting location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
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
                  {isEdit ? "Edit Clinic" : "Add Clinic"}
                </div>
                <div className="p-5">
                  <form onSubmit={handleSubmitAdd}>
                    <div className="mb-5">
                      <label htmlFor="first-name">Name</label>
                      <input
                        id="first-name"
                        type="text"
                        placeholder="Enter First Name"
                        className="form-input"
                        value={data.name}
                        onChange={(e) =>
                          setData({ ...data, name: e.target.value })
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
                        value={data.email}
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="username">Username</label>
                      <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        className="form-input"
                        value={data.username}
                        onChange={(e) =>
                          setData({ ...data, username: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="number">Phone Number</label>
                      <input
                        id="phone"
                        type="number"
                        placeholder="Phone Number"
                        className="form-input"
                        value={data.phone}
                        onChange={(e) =>
                          setData({ ...data, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="address">Address</label>
                      <input
                        id="address"
                        type="text"
                        placeholder="Address"
                        className="form-input"
                        value={data.address}
                        onChange={(e) =>
                          setData({ ...data, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="place">Place</label>
                      <input
                        id="place"
                        type="text"
                        placeholder="Place"
                        className="form-input"
                        value={data.place}
                        onChange={(e) =>
                          setData({ ...data, place: e.target.value })
                        }
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
                          accept="image/*"
                          onChange={(e) =>
                            setData({ ...data, picture: e.target.files[0] })
                          }
                        />
                      </label>
                      {data.picture ?  (
                        <div className="mt-2 relative">
                        <img
                          src={URL.createObjectURL(data.picture)}
                          alt="Selected"
                          className="max-w-full h-auto"
                        />
                        <button
                          type="button"
                          className="
                          absolute top-1 right-1 btn btn-dark w-9 h-9 p-0 rounded-full"
                          onClick={handleRemoveImage}
                        >
                          <IconX />
                        </button>
                      </div>
                      )
                      : data.defaultPicture && (
                        <div className="mt-2 relative">
                          <img
                            src={data.defaultPicture}
                            alt="Selected"
                            className="max-w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                    {!isEdit && (
                      <>
                        <div className="mb-5">
                          <label htmlFor="password">Password</label>
                          <input
                            id="password"
                            type="password"
                            placeholder="Enter Password"
                            className="form-input"
                            value={data.password}
                            onChange={handlePasswordChange}
                          />
                        </div>

                        <div className="mb-5">
                          <label htmlFor="confirm-password">
                            Confirm Password
                          </label>
                          <input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm Password"
                            className="form-input"
                            value={data.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                          />
                          {passwordError && (
                            <p className="text-red-500 text-sm mt-2">
                              {passwordError}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                    <div className="mb-5">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={getLocation}
                      >
                        Get Current Location
                      </button>
                      {data.googleLocation.lat && data.googleLocation.long && (
                        <p className="mt-2">
                          Latitude: {data.googleLocation.lat}, Longitude:{" "}
                          {data.googleLocation.long}
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
                        type="submit"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-0 rtl:mr-0 shrink-0" />
                        ) : isEdit ? (
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

export default AddClinic;

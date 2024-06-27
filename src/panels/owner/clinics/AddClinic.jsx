import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import IconLockDots from "../../../components/Icon/IconLockDots";
import IconEye from "../../../components/Icon/IconEye";
import IconCloseEye from "../../../components/Icon/IconCloseEye";
import GoogleLocationPicker from "../../../components/GoogleLocationPicker/GoogleLocationPicker";

const AddClinic = ({
  open,
  closeModal,
  data,
  setData,
  handleSubmit,
  handleRemoveImage,
  buttonLoading,
  isEdit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    setData({ ...data, password: e.target.value });
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
    if (data.email) {
      setData((prevInput) => ({
        ...prevInput,
        user_name: data.email,
      }));
    }
  }, [data.email]);

  useEffect(() => {
    // Parse googleLocation if it is a string
    if (typeof data?.googleLocation === "string") {
      try {
        const parsedLocation = JSON.parse(data?.googleLocation);
        setData((prevData) => ({
          ...prevData,
          googleLocation: parsedLocation,
        }));
      } catch (error) {
        console.error("Error parsing googleLocation", error);
      }
    }
  }, [data?.googleLocation]);

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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl text-black dark:text-white-dark">
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
                    <div className="grid grid-cols-1 sm:flex justify-between gap-4 mb-5">
                      <div className="w-full">
                        <label htmlFor="first-name">Name</label>
                        <input
                          id="first-name"
                          type="text"
                          placeholder="Enter Name"
                          className="form-input form-input-green"
                          value={data.name}
                          onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                          }
                        />
                      </div>
                      {!isEdit && (
                        <div className="w-full">
                          <label htmlFor="email">Email</label>
                          <input
                            id="email"
                            type="email"
                            placeholder="Enter Email"
                            className="form-input form-input-green"
                            value={data.email}
                            onChange={(e) =>
                              setData({ ...data, email: e.target.value })
                            }
                            autoComplete="off"
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:flex justify-between gap-4 mb-5">
                      {!isEdit && (
                        <div className="w-full">
                          <label htmlFor="username">Username</label>
                          <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            className="form-input form-input-green"
                            value={data.user_name}
                            onChange={(e) =>
                              setData({ ...data, user_name: e.target.value })
                            }
                          />
                        </div>
                      )}
                      <div className="w-full">
                        <label htmlFor="number">Phone Number</label>
                        <input
                          id="phone"
                          type="number"
                          placeholder="Phone Number"
                          className="form-input form-input-green"
                          value={data.phone}
                          onChange={(e) =>
                            setData({ ...data, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div className="">
                        <label htmlFor="place">Place</label>
                        <input
                          id="place"
                          type="text"
                          placeholder="Place"
                          className="form-input form-input-green"
                          value={data.place}
                          onChange={(e) =>
                            setData({ ...data, place: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-5">
                      <label htmlFor="address">Address</label>
                      <textarea
                        id="address"
                        rows={3}
                        placeholder="Enter Address"
                        className="form-textarea form-textarea-green resize-none min-h-[130px]"
                        value={data.address}
                        onChange={(e) =>
                          setData({ ...data, address: e.target.value })
                        }
                      ></textarea>
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
                      {data.picture ? (
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
                      ) : (
                        data.defaultPicture && (
                          <div className="mt-2 relative">
                            <img
                              src={data.defaultPicture}
                              alt="Selected"
                              className="max-w-full h-auto"
                            />
                          </div>
                        )
                      )}
                    </div>
                    <label htmlFor="address">Select Location</label>
                    <div className="w-full border border-[#006241] rounded mb-12">
                      <GoogleLocationPicker data={data} setData={setData} />
                    </div>
                    <div className="grid grid-cols-1 sm:flex justify-between gap-4 mb-12">
                      {!isEdit && (
                        <>
                          <div className="w-full">
                            <label htmlFor="password">Password</label>
                            <div className="relative text-white-dark">
                              <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                className="form-input form-input-green ps-10 pr-9 placeholder:text-white-dark"
                                value={data.password}
                                onChange={handlePasswordChange}
                              />
                              <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <IconLockDots fill={true} />
                              </span>
                              <span
                                title={
                                  showPassword
                                    ? "hide password"
                                    : "show password"
                                }
                                className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <IconEye /> : <IconCloseEye />}
                              </span>
                            </div>
                          </div>

                          <div className="w-full">
                            <label htmlFor="confirm-password">
                              Confirm Password
                            </label>
                            <div className="relative text-white-dark">
                              <input
                                id="Confirm Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Confirm Password"
                                className="form-input form-input-green ps-10 pr-9 placeholder:text-white-dark"
                                value={data.confirmPassword}
                                onChange={handleConfirmPasswordChange}
                              />
                              <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <IconLockDots fill={true} />
                              </span>
                              <span
                                title={
                                  showPassword
                                    ? "hide password"
                                    : "show password"
                                }
                                className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <IconEye /> : <IconCloseEye />}
                              </span>
                            </div>
                            {passwordError && (
                              <p className="text-red-500 text-sm mt-2">
                                {passwordError}
                              </p>
                            )}
                          </div>
                        </>
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

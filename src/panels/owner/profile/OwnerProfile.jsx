import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../contexts/UseContext";
import { formatDate } from "../../../utils/formatDate";
import IconEdit from "../../../components/Icon/IconEdit";
import "tippy.js/dist/tippy.css";
import OwnerProfileEditModal from "./ownerProfileEditModal";
import NetworkHandler from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";

const OwnerProfile = () => {
  const { userDetails } = useContext(UserContext);

  const ownerId = userDetails?.UserOwner?.[0]?.owner_id || null;

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [profileData, setProfileData] = useState();
  const [input, setInput] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    district: "",
    state: "",
    country: "",
  });
  const [errors, setErrors] = useState({});

  const getProfileData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/owner/getowner/${ownerId}`
      );
      setProfileData(response?.data?.Owner);
    } catch (error) {}
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const convertFirstLetterCapital = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const validate = () => {
    const newErrors = {};

    if (input.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      showMessage("Phone number must be exactly 10 digits", "warning");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // profile edit
  const profileEdit = async (e) => {
    if (validate()) {
      const updatedData = {
        ...input,
        phone: `+91${input.phone}`,
      };

      try {
        const response = await NetworkHandler.makePutRequest(
          `/v1/owner/updateOwner/${ownerId}`,
          updatedData
        );

        console.log(response);
        if (response.status === 200) {
          showMessage("Profile updated successfully.");
        } else {
          showMessage("Failed to update profile. Please try again.", "error");
          setButtonLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          showMessage("Email already exists.", "error");
        } else {
          showMessage("An error occurred. Please try again.", "error");
        }
      }
    }
  };

  const handleEdit = () => {
    const phoneWithoutCountryCode = profileData.phone.replace(/^\+91/, "");

    setInput({
      name: profileData?.name || "",
      address: profileData?.address || "",
      phone: phoneWithoutCountryCode || "",
      city: profileData?.city || "",
      district: profileData?.district || "",
      state: profileData?.state || "",
      country: profileData?.country || "",
    });
    setEditModal(true);
    setIsEdit(true);
  };

  const closeOwnerProfileModal = () => {
    setEditModal(false);
    setErrors(null);
  };

  return (
    <div>
      <div className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-8 mb-5 bg-white dark:bg-black">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="text-2xl md:text-4xl text-green-800 font-semibold capitalize mb-4 flex sm:flex-col lg:flex-row justify-between w-full">
            <div className="w-full flex items-center justify-between gap-10 mt-2">
              <span>{profileData?.name}</span>
              <div className="flex gap-4 items-center w-max ml-auto">
                <button className="flex  hover:text-info" onClick={handleEdit}>
                  <IconEdit className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-row md:flex-col sm:flex-col flex-wrap gap-6 mb-2">
          <div className="w-full flex flex-col md:flex-row gap-3">
            <div className="flex flex-col md:w-1/2 mb-2">
              <div className="text-white-dark min-w-96 text-base mb-1">
                Address
              </div>
              <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800  rounded p-2 text-base h-full bg-gray-100">
                {profileData?.address}
              </div>
            </div>
            <div className="flex flex-col mb-2 md:w-1/2 gap-1">
              <div className="text-white-dark text-base">State</div>
              <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800  rounded p-2 text-base min-h-10 bg-gray-100">
                {profileData?.state
                  ? convertFirstLetterCapital(profileData?.state)
                  : "-----"}
              </div>
              <div className="text-white-dark text-base">District</div>
              <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800  rounded p-2 text-base min-h-10 bg-gray-100">
                {profileData?.district
                  ? convertFirstLetterCapital(profileData?.district)
                  : "-----"}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-3">
            <div className="lg:w-1/2 w-full flex flex-col gap-4">
              <div className="gap-1 mb-2 w-full">
                <div className="text-white-dark text-base mb-1">Country</div>
                <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800 rounded p-2 text-base bg-gray-100">
                  {profileData?.country || "-----"}
                </div>
              </div>
              <div className="gap-1 mb-2 w-full">
                <div className="text-white-dark text-base mb-1">Email</div>
                <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800 rounded p-2 text-base bg-gray-100">
                  {profileData?.email}
                </div>
              </div>
              <div className="gap-1 mb-2 w-full">
                <div className="text-white-dark text-base mb-1">
                  Phone Number
                </div>
                <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800 rounded p-2 text-base bg-gray-100">
                  {profileData?.phone}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full flex flex-col gap-4">
              <div className="gap-1 mb-2 w-full">
                <div className="text-white-dark text-base mb-1">City</div>
                <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800 rounded p-2 text-base bg-gray-100">
                  {profileData?.city || "-----"}
                </div>
              </div>
              <div className="gap-1 mb-2 w-full">
                <div className="text-white-dark text-base mb-1">
                  Account Creation Date
                </div>
                <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800 rounded p-2 text-base bg-gray-100">
                  {formatDate(profileData?.created_at)}
                </div>
              </div>
              <div className="gap-1 mb-2 w-full">
                <div className="text-white-dark text-base mb-1">Entered By</div>
                <div className="dark:text-slate-300 border dark:border-slate-800 dark:bg-gray-800 rounded p-2 text-base bg-gray-100">
                  {profileData?.salesperson_id ? "Salesperson" : "Application"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OwnerProfileEditModal
        open={editModal}
        closeModal={closeOwnerProfileModal}
        formSubmit={profileEdit}
        input={input}
        setInput={setInput}
        fetchdata={getProfileData}
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  );
};

export default OwnerProfile;

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

  const createUserData = (userDetails) => {
    const userData = {
      user_id: userDetails?.user_id,
      role_id: userDetails?.role_id,
      user_name: userDetails?.user_name,
      password: userDetails?.password,
      email: userDetails?.email,
      status: userDetails?.status,
      additionalDetails: {},
    };

    if (userDetails?.UserClinic?.length > 0) {
      userData.additionalDetails = userDetails?.UserClinic[0];
    }
    if (userDetails?.UserOwner?.length > 0) {
      userData.additionalDetails = userDetails?.UserOwner[0];
    }
    if (userDetails?.UserDoctor?.length > 0) {
      userData.additionalDetails = userDetails?.UserDoctor[0];
    }
    if (userDetails?.UserSalesperson?.length > 0) {
      userData.additionalDetails = userDetails?.UserSalesperson[0];
    }
    if (userDetails?.UserSupportuser?.length > 0) {
      userData.additionalDetails = userDetails?.UserSupportuser[0];
    }

    // console.log(userData);

    return userData;
  };

  const userData = createUserData(userDetails);
  const [data, setData] = useState({ oldpassword: "", newpassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
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

  const getProfileData = async () => {
    const ownerid = userData?.additionalDetails?.owner_id;

    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/owner/getowner/${ownerid}`
      );
      setProfileData(response?.data?.Owner);
    } catch (error) {}
  };

  useEffect(() => {
    getProfileData();
  }, []);

  // change password function
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!data.oldpassword || !data.newpassword) {
      showMessage("Please fill in all input fields.", "warning");
      setLoading(false);
      return;
    }

    const userId = userData?.user_id;

    if (!userId) {
      showMessage("User ID not found.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/auth/reset/${userId}`,
        data
      );

      if (response.status === 201) {
        setIsIncorrect(false);
        showMessage("Password changed successfully.", "success");
        setData({ oldpassword: "", newpassword: "" });
      } else {
        showMessage(response.data.message || "An error occurred.", "error");
        setIsIncorrect(true);
      }
    } catch (error) {
      console.error("Error response:", error);
      if (error.response?.status === 403) {
        showMessage("Current password is incorrect.", "error");
      } else {
        const message =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        showMessage(message, "error");
      }
      setIsIncorrect(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentPasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("newpassword").focus();
    }
  };

  const handleNewPasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChangePassword(e);
    }
  };

  const convertFirstLetterCapital = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // profile edit

  const profileEdit = async (e) => {
    const ownerid = userData?.additionalDetails?.owner_id;
    const updatedData = {
      ...input,
    };
    console.log(ownerid);
    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/owner/updateOwner/${ownerid}`,
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
  };

  const handleEdit = () => {
    setInput({
      name: profileData?.name || "",
      address: profileData?.address || "",
      phone: profileData?.phone || "",
      city: profileData?.city || "",
      district: profileData?.district || "",
      state: profileData?.state || "",
      country: profileData?.country || "",
    });
    openownerProfileEditModal();
    setIsEdit(true);
  };

  const openownerProfileEditModal = () => {
    setEditModal(true);
  };
  const closeOwnerProfileModal = () => {
    setEditModal(false);
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
                  {userData?.email}
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
      />
    </div>
  );
};

export default OwnerProfile;

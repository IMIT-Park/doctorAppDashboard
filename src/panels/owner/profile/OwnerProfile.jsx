import { useContext, useState } from "react";
import IconLockDots from "../../../components/Icon/IconLockDots";
import IconCloseEye from "../../../components/Icon/IconCloseEye";
import { UserContext } from "../../../contexts/UseContext";

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

    return userData;
  };

  const userData = createUserData(userDetails);
  const [data, setData] = useState({ oldpassword: "", newpassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <div className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-8 mb-5 bg-white dark:bg-black">
        <div className="flex flex-col items-start">
          <div className="text-2xl md:text-4xl text-green-800 font-semibold capitalize mb-4 flex sm:flex-col lg:flex-row justify-between">
            <div className="w-full flex items-start justify-between gap-2 mt-2">
              {userData?.additionalDetails?.name}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="flex flex-col items-start w-full">
              <div className="text-base font-medium text-gray-500">Address:</div>
              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2 min-h-20">
                {userData?.additionalDetails?.address}
              </div>
            </div>
            <div className="flex flex-col items-start w-full">
              <div className="text-base font-medium text-gray-500">Email:</div>
              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                {userData?.email}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-5">
          
            <div className="flex flex-col items-start w-full">
              <div className="text-base font-medium text-gray-500">Username:</div>
              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                {userData?.user_name}
              </div>
            </div>
            <div className="flex flex-col items-start w-full">
              <div className="text-base font-medium text-gray-500">Phone:</div>
              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                {userData?.additionalDetails?.phone}
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;

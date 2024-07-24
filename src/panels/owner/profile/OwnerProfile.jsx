import { useContext, useEffect, useState } from "react";
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

  console.log(userData)
  return (
    <div>
      <div className="p-4 bg-white shadow-md rounded-lg pb-8">
        <h2 className="text-xl font-semibold mb-4">Sajna</h2>
        <div className="space-y-4">
          <div className="flex flex-col items-start">
            <div className="text-base font-medium text-gray-500">Address:</div>
            <div className="border dark:border-slate-800 dark:text-slat-00 rounded w-full text-base p-2 min-h-20">
            {userData?.additionalDetails?.address}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="flex flex-col items-start w-full">
              <div className="text-base font-medium text-gray-500 ">Place:</div>
              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
              {userData?.additionalDetails?.place}
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
              <div className="text-base font-medium text-gray-500 ">
                Username:
              </div>
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
      <div className="pt-8 lg:col-span-2 xl:col-span-3 max-w-[70rem]">
        <form
          className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
          onSubmit={handleChangePassword}
        >
          <h6 className="text-lg font-bold mb-5">Change Password</h6>
          <div className="flex flex-col sm:flex-row">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="Password">Current Password</label>
                <div
                  className={`relative text-white-dark ${
                    isIncorrect && "has-error"
                  }`}
                >
                  <input
                    id="oldpassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Current Password"
                    className="form-input form-input-green ps-10 pr-9 placeholder:text-white-dark"
                    value={data.oldpassword}
                    onChange={(e) =>
                      setData({ ...data, oldpassword: e.target.value })
                    }
                    onKeyDown={handleCurrentPasswordKeyDown}
                  />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconLockDots fill={true} />
                  </span>
                  <span
                    title={showPassword ? "hide password" : "show password"}
                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEye /> : <IconCloseEye />}
                  </span>
                </div>
                {isIncorrect && (
                  <div className="text-danger mt-0.5 ml-1">
                    Current Password is incorrect !
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="Password">New Password</label>
                <div className="relative text-white-dark">
                  <input
                    id="newpassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="form-input form-input-green ps-10 pr-9 placeholder:text-white-dark"
                    value={data.newpassword}
                    onChange={(e) =>
                      setData({ ...data, newpassword: e.target.value })
                    }
                    onKeyDown={handleNewPasswordKeyDown}
                  />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconLockDots fill={true} />
                  </span>
                  <span
                    title={showPassword ? "hide password" : "show password"}
                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEye /> : <IconCloseEye />}
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2 mt-3 ml-auto">
                <button type="submit" className="btn btn-green">
                  {loading ? (
                    <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle shrink-0" />
                  ) : (
                    "Change"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerProfile;

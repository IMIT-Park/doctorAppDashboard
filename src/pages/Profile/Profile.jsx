import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useContext, useEffect, useState } from "react";
import IconEye from "../../components/Icon/IconEye";
import IconCloseEye from "../../components/Icon/IconCloseEye";
import IconLockDots from "../../components/Icon/IconLockDots";
import NetworkHandler from "../../utils/NetworkHandler";
import IconLoader from "../../components/Icon/IconLoader";
import { UserContext } from "../../contexts/UseContext";
import { showMessage } from "../../utils/showMessage";

const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Profile"));
  });


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

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ oldpassword: "", newpassword: "" });
  const [loading, setLoading] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);

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
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li className="">
          <span>Profile Details</span>
        </li>
      </ul>
      <div className="pt-2">
        <div className="flex flex-col gap-3">
          <div className="panel">
            <div className="mb-2">
              <div className="flex flex-col items-start gap-2">
                {userData?.additionalDetails?.name && (
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center justify-between min-w-[72px] text-sm text-gray-500">
                      Name <span>:</span>
                    </div>
                    <p className="font-semibold text-[#006241] text-base capitalize">
                      {userData?.additionalDetails?.name}
                    </p>
                  </div>
                )}
                {userData?.email && (
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center justify-between min-w-[72px] text-sm text-gray-500">
                      Email <span>:</span>
                    </div>
                    <p className="text-sm text-black dark:text-slate-300">
                      {userData?.email}
                    </p>
                  </div>
                )}
                {userData?.user_name && (
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center justify-between min-w-[72px] text-sm text-gray-500">
                      Username <span>:</span>
                    </div>
                    <p className="text-sm text-black dark:text-slate-300">
                      {userData?.user_name}
                    </p>
                  </div>
                )}
                {userData?.additionalDetails?.phone && (
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center justify-between min-w-[72px] text-sm text-gray-500">
                      Phone <span>:</span>
                    </div>
                    <p className="text-sm text-black dark:text-slate-300">
                      {userData?.additionalDetails?.phone}
                    </p>
                  </div>
                )}
                {userData?.additionalDetails?.address && (
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center justify-between min-w-[72px] text-sm text-gray-500">
                      Address <span>:</span>
                    </div>
                    <p className="text-sm text-black dark:text-slate-300">
                      {userData?.additionalDetails?.address}
                    </p>
                  </div>
                )}
                {userData?.additionalDetails?.place && (
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex items-center justify-between min-w-[72px] text-sm text-gray-500">
                      Place <span>:</span>
                    </div>
                    <p className="text-sm text-black dark:text-slate-300">
                      {userData?.additionalDetails?.place}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 xl:col-span-3 max-w-[70rem]">
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
      </div>
    </div>
  );
};

export default Profile;

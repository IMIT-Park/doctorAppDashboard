import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPageTitle } from "../../store/themeConfigSlice";
import IconMail from "../../components/Icon/IconMail";
import IconLockDots from "../../components/Icon/IconLockDots";
import IconSun from "../../components/Icon/IconSun";
import IconMoon from "../../components/Icon/IconMoon";
import IconLaptop from "../../components/Icon/IconLaptop";
import IconEye from "../../components/Icon/IconEye";
import IconCloseEye from "../../components/Icon/IconCloseEye";
import { toggleTheme } from "../../store/themeConfigSlice";
import IconX from "../../components/Icon/IconX";
import IconLoader from "../../components/Icon/IconLoader";

const LoginBoxed = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Confirm Password"));
  });
  const navigate = useNavigate();
  const themeConfig = useSelector((state) => state.themeConfig);

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ newPassword: "", confirmPassword: "" });
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [loading, setLoading] = useState(false);
  const [notMatch, setNotMatch] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // const currentUrl = window.location.href;
    // const url = new URL(currentUrl);
    // const tokenFromUrl = url.searchParams.get("token");
    const tokenFromUrl =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJqaW1sYXRpbWl0QGdtYWlsLmNvbSIsImlhdCI6MTcxNzU3Mjc5MywiZXhwIjoxNzE3NTc2MzkzfQ.oJHTRE6LCz98sKn7BBScgxLm9KT8-6T6i4zeaX7LdZk";
    setToken(tokenFromUrl);
    // console.log("Token:", tokenFromUrl);
  }, []);

  // warning alert closer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert({ show: false, message: "", type: "info" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [showAlert.show]);

  const handleCloseAlert = () => {
    setShowAlert({ show: false, message: "", type: "info" });
  };

  //login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!data.newPassword || !data.confirmPassword) {
      setShowAlert({
        show: true,
        message: "Please fill in all input fields.",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setShowAlert({
        show: true,
        message: "Passwords do not match!",
        type: "warning",
      });
      setLoading(false);
      setNotMatch(true);
      return;
    } else {
      setNotMatch(false);
    }

    if (!data.newPassword && !data.confirmPassword) {
      setShowAlert({
        show: true,
        message: "Please enter your email and password.",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://doctorbackend.gitdr.com/api/v1/auth/updatePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newpassword: data.newPassword,
            token: token,
          }),
        }
      );
      console.log(response);
      if (response.status === 201) {
        setShowAlert({
          show: true,
          message: "Password updated successfully!",
          type: "info",
        });
        navigate("/");
      } else {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      setShowAlert({
        show: true,
        message: "Failed to update password. Please try again later.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleNewPasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("ConfirmPassword").focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="image"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
        <img
          src="/assets/images/auth/coming-soon-object1.png"
          alt="image"
          className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
        />
        <img
          src="/assets/images/auth/coming-soon-object2.png"
          alt="image"
          className="absolute left-24 top-0 h-40 md:left-[30%]"
        />
        <img
          src="/assets/images/auth/coming-soon-object3.png"
          alt="image"
          className="absolute right-0 top-0 h-[300px]"
        />
        <img
          src="/assets/images/auth/polygon-object.svg"
          alt="image"
          className="absolute bottom-0 end-[28%]"
        />
        <div className="relative w-full max-w-[570px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[500px] py-14">
            {/* dark & light mode button */}
            <div className="absolute top-2 right-2">
              <div>
                {themeConfig.theme === "light" ? (
                  <button
                    className={`${
                      themeConfig.theme === "light" &&
                      "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                    }`}
                    onClick={() => {
                      dispatch(toggleTheme("dark"));
                    }}
                  >
                    <IconSun />
                  </button>
                ) : (
                  ""
                )}
                {themeConfig.theme === "dark" && (
                  <button
                    className={`${
                      themeConfig.theme === "dark" &&
                      "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                    }`}
                    onClick={() => {
                      dispatch(toggleTheme("system"));
                    }}
                  >
                    <IconMoon />
                  </button>
                )}
                {themeConfig.theme === "system" && (
                  <button
                    className={`${
                      themeConfig.theme === "system" &&
                      "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                    }`}
                    onClick={() => {
                      dispatch(toggleTheme("light"));
                    }}
                  >
                    <IconLaptop />
                  </button>
                )}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-7">
                <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">
                  Confirm Password
                </h1>
                <p>Enter your new password</p>
              </div>
              <form
                className="space-y-5 dark:text-white"
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="Email">New Password</label>
                  <div className="relative text-white-dark">
                    <input
                      id="NewPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      className="form-input ps-10 pr-9 placeholder:text-white-dark"
                      value={data.newPassword}
                      onChange={(e) =>
                        setData({ ...data, newPassword: e.target.value })
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
                <div>
                  <label htmlFor="Password">Confirm Password</label>
                  <div
                    className={`relative text-white-dark ${
                      notMatch && "has-error"
                    }`}
                  >
                    <input
                      id="ConfirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="form-input ps-10 pr-9 placeholder:text-white-dark"
                      value={data.confirmPassword}
                      onChange={(e) =>
                        setData({ ...data, confirmPassword: e.target.value })
                      }
                      onKeyDown={handlePasswordKeyDown}
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
                  {notMatch && (
                    <div className="text-danger mt-0.5 ml-1">
                      Passwords do not match!
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-gradient !mt-8 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                >
                  {loading ? (
                    <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-2 rtl:mr-2 shrink-0" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showAlert.show && (
        <div
          className={`fixed top-4 right-4 flex items-center p-3.5 rounded text-white ${
            showAlert.type === "warning"
              ? "bg-warning"
              : showAlert.type === "danger"
              ? "bg-danger"
              : "bg-info"
          }`}
        >
          <span className="ltr:pr-2 rtl:pl-2">
            <strong>{showAlert?.message}</strong>
          </span>
          <button
            type="button"
            className="ltr:ml-auto rtl:mr-auto hover:opacity-80"
            onClick={handleCloseAlert}
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginBoxed;

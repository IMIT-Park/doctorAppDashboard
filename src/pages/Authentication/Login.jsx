import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
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
import { baseUrl } from "../../utils/NetworkHandler";
import { UserContext } from "../../contexts/UseContext";
import { showMessage } from "../../utils/showMessage";

const LoginBoxed = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Login"));
  });
  const navigate = useNavigate();
  const isDark = useSelector(
    (state) =>
      state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
  );
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
  const themeConfig = useSelector((state) => state.themeConfig);

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [loading, setLoading] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);

  const { userDetails, setUserDetails } = useContext(UserContext);

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

  // login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!data.email && !data.password) {
      setShowAlert({
        show: true,
        message: "Please enter your username and password.",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    if (!data.email) {
      setShowAlert({
        show: true,
        message: "Please enter your Username.",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    if (!data.password) {
      setShowAlert({
        show: true,
        message: "Please enter your Password.",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    const auth = btoa(`${data.email}:${data.password}`);

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `${auth}`,
    });

    try {
      const response = await fetch(`${baseUrl}/v1/auth/login`, {
        method: "POST",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        const { accessToken, refreshToken, user } = data;

        // Store data in sessionStorage
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("userData", JSON.stringify(user));

        // Update the user details in context
        setUserDetails(user);

        setLoading(false);
        setIsIncorrect(false);
        if (user?.role_id === 2) {
          navigate("/owner/dashboard");
        } else if (user?.role_id === 3) {
          navigate("/clinic/dashboard");
        } else if (user?.role_id === 4) {
          navigate("/doctor/dashboard");
        } else if (user?.role_id === 5) {
          navigate("/sales/dashboard");
        } else if (user?.role_id === 6) {
          navigate("/supportuser/dashboard");
        } else {
          navigate("/admin/dashboard");
        }

        setData({ ...data, email: "", password: "" });
      } else if (response.status === 401) {
        setShowAlert({
          show: true,
          message: "Incorrect password. Please try again.",
          type: "danger",
        });
        setIsIncorrect(true);
      } else {
        setShowAlert({
          show: true,
          message: "Incorrect username or password. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      setShowAlert({
        show: true,
        message: "An error occurred during login. Please try again later.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("Password").focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin(e);
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
                      "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-[#3f9679] hover:bg-white-light/90 dark:hover:bg-dark/60"
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
                      "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-[#3f9679] hover:bg-white-light/90 dark:hover:bg-dark/60"
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
                      "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-[#3f9679] hover:bg-white-light/90 dark:hover:bg-dark/60"
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
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-[#006241] md:text-4xl">
                  Sign in
                </h1>
                <p className="text-base font-bold leading-normal text-white-dark">
                  Enter your username and password to login
                </p>
              </div>
              <form
                className="space-y-5 dark:text-white"
                onSubmit={handleLogin}
              >
                <div>
                  <label htmlFor="Email">Username</label>
                  <div className="relative text-white-dark">
                    <input
                      id="Email"
                      type="email"
                      placeholder="Enter Username"
                      className="form-input form-input-green ps-10 placeholder:text-white-dark"
                      value={data.email}
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                      onKeyDown={handleEmailKeyDown}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <IconMail fill={true} />
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="Password">Password</label>
                  <div
                    className={`relative text-white-dark ${
                      isIncorrect && "has-error"
                    }`}
                  >
                    <input
                      id="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className="form-input form-input-green ps-10 pr-9 placeholder:text-white-dark"
                      value={data.password}
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
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
                  {isIncorrect && (
                    <div className="text-danger mt-0.5 ml-1">
                      Password is incorrect !
                    </div>
                  )}
                </div>
                <label
                  className="flex cursor-pointer items-center w-fit"
                  onClick={() => navigate("/forgot-password")}
                >
                  <span className="text-white-dark hover:text-[#006241]">
                    Forgot Password ?
                  </span>
                </label>
                <button
                  type="submit"
                  className="btn btn-gradient !mt-8 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                >
                  {loading ? (
                    <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-2 rtl:mr-2 shrink-0" />
                  ) : (
                    "Sign in"
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

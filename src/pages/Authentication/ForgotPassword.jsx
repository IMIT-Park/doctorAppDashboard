import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPageTitle } from "../../store/themeConfigSlice";
import IconMail from "../../components/Icon/IconMail";
import IconSun from "../../components/Icon/IconSun";
import IconMoon from "../../components/Icon/IconMoon";
import IconLaptop from "../../components/Icon/IconLaptop";
import { toggleTheme } from "../../store/themeConfigSlice";
import IconX from "../../components/Icon/IconX";
import IconLoader from "../../components/Icon/IconLoader";
import NetworkHandler from "../../utils/NetworkHandler";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Forgot Password"));
  });
  const navigate = useNavigate();
  const themeConfig = useSelector((state) => state.themeConfig);

  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [loading, setLoading] = useState(false);

  //Submit Email
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await fetch("https://doctorbackend.gitdr.com/api/v1/auth/forgotPasword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({user_name:email}),
      });

      console.log(response);

      if (response.status === 201) {
        setLoading(false);
        showMessage("Email sent successfully.", "success");
      }
      navigate("/confirm-password");
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

    //  show message function
    const showMessage = (msg = "", type = "") => {
      const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: "toast" },
        showCloseButton: true,
      });
      toast.fire({
        icon: type,
        title: msg,
        padding: "10px 20px",
      });
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
                  Password Reset
                </h1>
                <p>Enter your email to recover your password</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="Email" className="dark:text-white">
                    Email
                  </label>
                  <div className="relative text-white-dark">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      className="form-input ps-10 placeholder:text-white-dark"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <IconMail fill={true} />
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                  disabled={loading}
                >
                  {loading ? (
                    <IconLoader className="animate-spin mr-2" />
                  ) : (
                    "RECOVER"
                  )}
                </button>
                <label className="flex items-center justify-center">
                  <span
                    className="text-white-dark hover:text-blue-600 cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    Back to Login
                  </span>
                </label>
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
          {/* <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80" onClick={handleCloseAlert}>
                        <IconX className="w-5 h-5" />
                    </button> */}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

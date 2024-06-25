import { useContext, useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import ScrollToTop from "../../../components/ScrollToTop";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";
import { UserContext } from "../../../contexts/UseContext";

const RequestToDoctor = () => {
  const { userDetails } = useContext(UserContext);
  const clinicId = userDetails?.UserClinic?.[0]?.clinic_id || "";
  console.log(clinicId);

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const validateEmail = (email) => {
    // Regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequest = async (e) => {
    e.preventDefault(); // Prevent form submission for validation check

    if (!validateEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      setIsValidEmail(false);
      return;
    }

    setButtonLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/clinic/createRequest`,
        {
          clinic_id: clinicId,
          email: email,
        }
      );

      console.log(response);
      if (response?.status === 201) {
        showMessage("Request sent successfully!", "success");
        setMessage("Request sent successfully!");
        setEmail("");
      } else {
        showMessage("Failed to send request.", "error");
        setMessage("Failed to send request.");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      showMessage("An error occurred. Please try again.", "error");
      setMessage("Error: " + error.message);
    } finally {
      setButtonLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div>
      <ScrollToTop />
      <div className="panel max-w-[500px] mx-auto mt-10">
        <div className=" items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center justify-center gap-1 mb-4">
            <h5 className="font-semibold text-lg dark:text-white-light mx-auto">
              Send Request to Doctor
            </h5>
          </div>

          <form action="" onSubmit={handleRequest}>
            <div className="mb-5 flex items-center justify-center">
              <label htmlFor="mds-name" className="mr-3">
                Email :
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsValidEmail(true); // Reset validation state on input change
                }}
                placeholder="Enter Email"
                className={`form-input ${isValidEmail ? "" : "border-red-500"}`}
                style={{ width: "300px" }}
                required
              />
            </div>

            <div className="container flex items-center justify-center">
              <button
                type="submit"
                className={`btn btn-green ${
                  buttonLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={buttonLoading}
              >
                {buttonLoading ? "Sending..." : "Request"}
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 text-center">
              <p
                className={
                  message.startsWith("Error")
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {message}
              </p>
            </div>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default RequestToDoctor;

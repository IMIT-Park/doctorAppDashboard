import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import NetworkHandler from "../../../utils/NetworkHandler";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../../utils/showMessage";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import IconLoader from "../../../components/Icon/IconLoader";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import { UserContext } from "../../../contexts/UseContext";
import { reverseformatDate } from "../../../utils/formatDate";

const ClinicBookingDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bookingDetails, setBookingDetails, patientDetails } =
    useContext(UserContext);

  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  }, [dispatch]);

  console.log(patientDetails);

  useEffect(() => {
    if (patientDetails) {
      const phoneWithoutCountryCode = patientDetails.phone.replace(/^\+91/, "");
      setInput({
        phone: phoneWithoutCountryCode || "",
        name: patientDetails.name || "",
        gender: patientDetails.gender || "",
        dateOfBirth: reverseformatDate(patientDetails?.dateOfBirth) || "",
        Remarks: patientDetails.Remarks || "",
        Particulars: patientDetails.Particulars || "",
      });
    }
  }, [patientDetails]);

  const [errors, setErrors] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const [input, setInput] = useState({
    phone: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    Remarks: "",
    Particulars: "",
  });

  const validate = () => {
    const newErrors = {};

    if (input?.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      showMessage("Phone number must be exactly 10 digits", "warning");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setInput({
      phone: "",
      name: "",
      gender: "",
      dateOfBirth: "",
      email: "",
      Remarks: "",
      Particulars: "",
    });
  };

  // Post Method
  const addPatients = async (e) => {
    e.preventDefault();

    if (!input.name || !input.phone || !input.dateOfBirth || !input.gender) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    if (validate()) {
      setButtonLoading(true);

      const prepareInput = (input) => {
        return {
          ...input,
          phone: `+91${input.phone}`,
          Remarks: input.Remarks || null,
          Particulars: input.Particulars || null,
        };
      };

      const preparedInput = prepareInput(input);

      try {
        const response = await NetworkHandler.makePostRequest(
          "/v1/patient/createpatient",
          preparedInput
        );
        if (response.status === 201) {
          setBookingDetails({
            ...bookingDetails,
            patient_id: response?.data?.Patient?.patient_id || null,
            type: "walkin",
          });
          resetForm();
          navigate("/clinic/bookings/select-doctor");
        } else {
          showMessage("adding patient failed", "error");
        }
      } catch (error) {
        console.error(error?.response?.data?.error);
      } finally {
        setButtonLoading(false);
      }
    }
  };

  const handleNext = () => {
    if (patientDetails) {
      setBookingDetails({
        ...bookingDetails,
        patient_id: patientDetails?.patient_id || null,
      });
      navigate("/clinic/bookings/select-doctor");
    }
  };

  const handlePhoneChange = (value) => {
    setInput({ ...input, phone: value });
    if (value.length === 10) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
    }
  };

  return (
    <div>
      <ScrollToTop />
      <button
        onClick={() => navigate(-1)}
        type="button"
        className="btn btn-green btn-sm -mt-4 mb-2"
      >
        <IconCaretDown className="w-4 h-4 rotate-90" />
      </button>
      <div className="panel flex justify-center items-center min-h-screen">
        <div className="w-full max-w-lg p-6 bg-[#fbfbfb] dark:bg-[#121c2c] rounded-lg shadow-lg">
          <h1 className="text-center font-bold text-2xl text-black mb-4 dark:text-[#fbfbfb]">
            Patient Details
          </h1>
          <form onSubmit={addPatients}>
            <input
              type="text"
              placeholder="Name"
              value={input?.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              className="form-input form-input-green mb-4 px-3"
              required
              disabled={!!patientDetails}
            />

            <PhoneNumberInput
              value={input?.phone}
              onChange={handlePhoneChange}
              error={errors?.phone}
              maxLength="10"
              disabled={!!patientDetails}
            />

            <div className="flex flex-col md:flex-row md:space-x-4 mb-4 mt-4">
              <div className="w-full mb-4 md:mb-0">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  placeholder="Date of Birth"
                  value={input?.dateOfBirth}
                  onChange={(e) =>
                    setInput({ ...input, dateOfBirth: e.target.value })
                  }
                  className="form-input form-input-green px-3"
                  required
                  disabled={!!patientDetails}
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  placeholder="Gender"
                  value={input?.gender}
                  onChange={(e) =>
                    setInput({ ...input, gender: e.target.value })
                  }
                  className="form-select form-select-green px-3"
                  required
                  disabled={!!patientDetails}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <textarea
              placeholder="Remarks"
              value={input?.Remarks}
              onChange={(e) => setInput({ ...input, Remarks: e.target.value })}
              className="form-input form-input-green mb-4 px-3 h-20"
              disabled={!!patientDetails}
            ></textarea>

            <textarea
              placeholder="Particulars"
              value={input?.Particulars}
              onChange={(e) =>
                setInput({ ...input, Particulars: e.target.value })
              }
              className="form-input form-input-green mb-4 px-3 h-20"
              disabled={!!patientDetails}
            ></textarea>

            <div className="flex justify-center">
              {patientDetails ? (
                <button
                  type="button"
                  className="btn btn-green inline-flex justify-center w-40 px-4 py-2 border border-transparent text-base font-medium rounded-md"
                  onClick={handleNext}
                >
                    Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-green inline-flex justify-center w-40 px-4 py-2 border border-transparent text-base font-medium rounded-md"
                >
                  {buttonLoading ? (
                    <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />
                  ) : (
                    "Next"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicBookingDoctor;

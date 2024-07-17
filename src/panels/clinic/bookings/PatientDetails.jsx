import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import NetworkHandler from "../../../utils/NetworkHandler";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../../utils/showMessage";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import IconLoader from "../../../components/Icon/IconLoader";

const ClinicBookingDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  }, [dispatch]);

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
  
  const addPatients = async (e) => {
    e.preventDefault();

    if (
      !input.name ||
      !input.phone ||
      !input.dateOfBirth ||
      !input.gender
    ) {
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
        console.log(response);
        if(response.status === 201){
          showMessage("Registration successful", "success");
          resetForm();
          navigate("/clinic/bookings/SelectorDoctor");
        }
        else{
          showMessage("Registration Failed", "error");
        }
      } catch (error) {
        console.error(error?.response?.data?.error);
      } finally {
        setButtonLoading(false);
      }
    }
  };

  const handlePhoneChange = (value) => {
    setInput({ ...input, phone: value });
    if (value.length === 10) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
    } else{
      setErrors((prevErrors) => ({...prevErrors, phone: "Invalid Phone Number. Phone Number should be 10 digit number"}))
    }
  };

  return (
    <div>
      <ScrollToTop />
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
            />

            <PhoneNumberInput
              value={input?.phone}
              onChange={handlePhoneChange}
              error={errors?.phone}
              maxLength="10"
            />

            <div className="flex flex-col md:flex-row md:space-x-4 mb-4 mt-2">
              <div className="w-full mb-4 md:mb-0">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="form-input form-input-green px-3"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <textarea
              placeholder="Remarks"
              value={input?.Remarks}
              onChange={(e) => setInput({ ...input, Remarks: e.target.value })}
              className="form-input form-input-green mb-4 px-3 h-20"
            ></textarea>

            <textarea
              placeholder="Particulars"
              value={input?.Particulars}
              onChange={(e) =>
                setInput({ ...input, Particulars: e.target.value })
              }
              className="form-input form-input-green mb-4 px-3 h-20"
            ></textarea>

            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-green inline-flex justify-center w-40 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style={{ fontSize: "19px" }}
              >
              {buttonLoading ? 
              (<IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-3 rtl:mr-3 shrink-0" />) :
              ("Next")}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicBookingDoctor;

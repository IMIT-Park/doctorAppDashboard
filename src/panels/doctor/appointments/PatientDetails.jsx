import React, { Fragment, useContext, useEffect, useState } from "react";
import ScrollToTop from "../../../components/ScrollToTop";
import CustomButton from "../../../components/CustomButton";
import { Tab } from "@headlessui/react";
import NetworkHandler from "../../../utils/NetworkHandler";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { formatDate, reverseformatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import { UserContext } from "../../../contexts/UseContext";
import IconLoader from "../../../components/Icon/IconLoader";
import { showMessage } from "../../../utils/showMessage";
import emptyBox from "/assets/images/empty-box.svg";
import IconCaretDown from "../../../components/Icon/IconCaretDown";

const PatientDetails = () => {
  const { bookingId } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [viewPatientDetails, setViewPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { userDetails, doctorReportId, setDoctorReportId } =
    useContext(UserContext);

  console.log(doctorReportId);

  const doctorId = doctorReportId || userDetails?.UserDoctor?.[0]?.doctor_id;
  const isSuperAdmin = userDetails?.role_id === 1;
  const navigate = useNavigate();

  const initialInputState = {
    symptoms: "",
    diagnosis: "",
    prescription: "",
    medicalTests: "",
    notes: "",
  };

  const [input, setInput] = useState(initialInputState);
  const [scheduleDate, setScheduleDate] = useState(null);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/consultation/takeConsultation/${bookingId}`
      );
      console.log(response);
      setPatientData(response?.data?.Consultation);
      setScheduleDate(response?.data?.Consultation?.schedule_date);
      setPatientId(response?.data?.Consultation?.patient_id);
      setViewPatientDetails(response?.data?.Consultation?.Patient);
      setMedicalRecords(response?.data?.medicalrecords);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPatientDetails();
  }, [bookingId]);

  useEffect(() => {
    const medicalReportData = localStorage.getItem("medicalReport");
    const medicalReport = medicalReportData
      ? JSON.parse(medicalReportData)
      : null;
    const currentDate = formatDate(new Date());

    if (
      medicalReport &&
      medicalReport.currentDate === currentDate &&
      medicalReport.patientId === patientId
    ) {
      setInput({
        symptoms: medicalReport.symptoms || "",
        diagnosis: medicalReport.diagnosis || "",
        prescription: medicalReport.prescription || "",
        medicalTests: medicalReport.medicalTests || "",
        notes: medicalReport.notes || "",
      });
    }
  }, [patientId]);

  // Function to calculate age
  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    let years = currentDate.getFullYear() - dob.getFullYear();
    let months = currentDate.getMonth() - dob.getMonth();

    if (months < 0 || (months === 0 && currentDate.getDate() < dob.getDate())) {
      years--;
      months = 12 + months;
    }

    if (months === 12) {
      years++;
      months = 0;
    }
    return months > 0 ? `${years} years ${months} months` : `${years} years`;
  };

  // const handleInputChange = (e) => {
  //   const { id, value } = e.target;
  //   setInput((prevInput) => ({
  //     ...prevInput,
  //     [id]: value,
  //   }));
  // };

  //Add addMedicalReport function
  const addMedicalReport = async (e) => {
    e.preventDefault();

    const currentDate = reverseformatDate(new Date());
    if (currentDate !== reverseformatDate(scheduleDate)) {
      showMessage("Medical reports can be added only for today's bookings..", "warning");
      return;
    }

    if (
      !input.symptoms ||
      !input.diagnosis ||
      !input.prescription ||
      !input.medicalTests ||
      !input.notes
    ) {
      showMessage("Please fill in all required fields", "warning");
      return;
    }

    const updatedInput = {
      ...input,
      booking_id: bookingId,
      doctor_id: doctorId,
    };
    setButtonLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/takePrescription/${patientId}`,
        updatedInput
      );
      if (response.status === 201) {
        showMessage("Report added successfully.");
        localStorage.setItem(
          "medicalReport",
          JSON.stringify({
            ...updatedInput,
            currentDate: formatDate(new Date()),
            patientId: patientId,
          })
        );
        fetchPatientDetails();
        setButtonLoading(false);
      } else {
        showMessage("Failed to add Report. Please try again.", "error");
        setButtonLoading(false);
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };
  // console.log(medicalRecords);

  const handleComplete = async () => {
    const currentDate = reverseformatDate(new Date());
    if (currentDate !== reverseformatDate(scheduleDate)){
      showMessage("Only today's booking can be marked as complete.", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/consultation/MarkComplete/${bookingId}`
      );
      if (response.status === 200) {
        showMessage("Marked as completed successfully.");
        navigate("/doctor/appointments");
      } else {
        showMessage("Failed to mark as completed. Please try again.", "error");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showMessage(
          "Only today's booking can be marked as complete.",
          "warning"
        );
      } else {
        showMessage("An error occurred. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ScrollToTop />
      <button
        onClick={() => navigate(-1)}
        type="button"
        className="btn btn-green btn-sm -mt-4 mb-4"
      >
        <IconCaretDown className="w-4 h-4 rotate-90" />
      </button>
      <div className="panel mt-1">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-8">
          <div className="flex items-center gap-1 flex-grow">
            <h5 className="font-bold text-lg dark:text-white-light">
              Patient Details
            </h5>
            <div className="border-t border-gray-300 dark:border-gray-600 flex-grow ml-2"></div>
          </div>
          <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <button className="btn btn-outline-primary mr-3 cursor-default hover:bg-transparent hover:text-primary ">
              {patientData?.type}
            </button>
            {!isSuperAdmin && (
            <CustomButton onClick={handleComplete} disabled={loading}>
              Completed
            </CustomButton>
            )}
          </div>
        </div>

        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:flex justify-between gap-4 mb-5">
              <div className="flex flex-col items-start w-full">
                <div className="text-base font-medium text-gray-500 mb-1">
                  Name{" "}
                </div>
                <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                  {viewPatientDetails?.name || ""}
                </div>
              </div>

              <div className="flex flex-col items-start w-full">
                <div className="text-base font-medium text-gray-500 mb-1">
                  Age
                </div>
                <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                  {viewPatientDetails
                    ? calculateAge(viewPatientDetails?.dateOfBirth)
                    : ""}
                </div>
              </div>

              <div className="flex flex-col items-start w-full">
                <div className="text-base font-medium text-gray-500 mb-1">
                  Date of Birth
                </div>
                <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                  {viewPatientDetails
                    ? formatDate(new Date(viewPatientDetails?.dateOfBirth))
                    : ""}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:flex justify-between gap-5 mb-5">
              <div className="flex flex-col items-start w-full">
                <div className="text-base font-medium text-gray-500 mb-1">
                  Gender
                </div>
                <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                  {viewPatientDetails?.gender}
                </div>
              </div>

              <div className="flex flex-col items-start w-full">
                <div className="text-base font-medium text-gray-500 mb-1">
                  Phone Number
                </div>
                <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                  {viewPatientDetails?.phone}
                </div>
              </div>

              <div className="flex flex-col items-start w-full">
                <div className="text-base font-medium text-gray-500 mb-1">
                  Token ID
                </div>
                <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                  {patientData?.token}
                </div>
                <label htmlFor="email"></label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:flex justify-between gap-4 mb-5">
              <div className="w-full md:w-[calc(33.3333%-19px)] flex flex-col items-start">
                <div className="text-base font-medium text-gray-500 mb-1">
                  Time
                </div>
                <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                  {patientData ? formatTime(patientData?.schedule_time) : ""}
                </div>
                <label htmlFor="email"></label>
              </div>
            </div>
          </>
        )}
        <Tab.Group>
          <Tab.List className="mt-3 flex flex-wrap font-bold">
            {!isSuperAdmin && (
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${
                    selected
                      ? "text-success !outline-none before:!w-full before:bg-success"
                      : "before:w-full before:bg-gray-100 dark:before:bg-gray-600"
                  } relative -mb-[1px] p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[2px] before:transition-all before:duration-700 hover:text-success mt-5`}
                >
                  Medical Report
                </button>
              )}
            </Tab>
            )}
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${
                    selected
                      ? "text-success !outline-none before:!w-full before:bg-success"
                      : "before:w-full before:bg-dark-light dark:before:bg-gray-600 "
                  } relative -mb-[1px] p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[2px] before:transition-all before:duration-700 hover:text-success mt-5`}
                >
                  History
                </button>
              )}
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {!isSuperAdmin && (
            <Tab.Panel>
              <div className="active pt-5">
                <form onSubmit={addMedicalReport}>
                  <div className="prose bg-[#f7f9fa] px-4 py-9 sm:px-8 sm:py-16 rounded max-w-full dark:bg-[#1d2c43] dark:text-white-light w-full mb-5">
                    <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5">
                      <div className="w-full">
                        <label htmlFor="first-name">Symptoms</label>
                        <input
                          id="symptoms"
                          type="text"
                          placeholder=""
                          value={input?.symptoms}
                          onChange={(e) =>
                            setInput({ ...input, symptoms: e.target.value })
                          }
                          className="form-input form-input-green bg-transparent"
                         
                        />
                      </div>

                      <div className="w-full">
                        <label htmlFor="email">Diagnosis</label>
                        <input
                          id="diagnosis"
                          type="text"
                          placeholder=""
                          value={input?.diagnosis}
                          onChange={(e) =>
                            setInput({ ...input, diagnosis: e.target.value })
                          }
                          className="form-input form-input-green bg-transparent"
                          autoComplete="off"
                         
                        />
                      </div>

                      <div className="w-full">
                        <label htmlFor="email">Medical Test</label>
                        <input
                          id="medicalTests"
                          type="text"
                          placeholder=""
                          value={input?.medicalTests}
                          onChange={(e) =>
                            setInput({ ...input, medicalTests: e.target.value })
                          }
                          className="form-input form-input-green bg-transparent"
                          autoComplete="off"
                          
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5 ">
                      <div className="w-full">
                        <label htmlFor="first-name">Prescription</label>
                        <textarea
                          id="prescription"
                          type="text"
                          placeholder=""
                          value={input?.prescription}
                          onChange={(e) =>
                            setInput({ ...input, prescription: e.target.value })
                          }
                          className="form-input form-input-green bg-transparent"
                         
                          rows={10}
                        />
                      </div>

                      <div className="w-full">
                        <label htmlFor="email">Notes</label>
                        <textarea
                          id="notes"
                          type="text"
                          placeholder=""
                          value={input?.notes}
                          onChange={(e) =>
                            setInput({ ...input, notes: e.target.value })
                          }
                          className="form-input form-input-green bg-transparent"
                          autoComplete="off"
                         
                          rows={10}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end   text-gray-500 font-bold dark:text-white-dark">
                      <CustomButton type="submit" disabled={buttonLoading}>
                        {" "}
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle" />
                        ) : (
                          "Submit "
                        )}
                      </CustomButton>
                    </div>
                  </div>
                </form>
              </div>
            </Tab.Panel>
            )}

            <Tab.Panel>
              {medicalRecords && medicalRecords?.length > 0 ? (
                <div>
                  {medicalRecords?.[0]?.records?.map((record, index) => (
                    <div
                      key={index}
                      className="prose bg-[#f7f9fa] px-4 py-9 sm:px-8 sm:py-16 rounded max-w-full dark:bg-[#1d2c43] dark:text-white-light w-full mb-5 mt-5 "
                    >
                      <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark">
                        <CustomButton>
                          {formatDate(new Date(record?.created_at))}
                        </CustomButton>
                      </div>
                      <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5 mt-6">
                        <div className="w-full">
                          <label htmlFor="first-name">Symptoms</label>
                          <input
                            id="gender"
                            type="text"
                            value={record?.symptoms}
                            className="form-input form-input-green bg-transparent"
                            readOnly
                          />
                        </div>
                        <div className="w-full">
                          <label htmlFor="email">Diagnosis</label>
                          <input
                            id="diagnosis"
                            type="text"
                            value={record?.diagnosis}
                            rows={8}
                            className="form-input form-input-green bg-transparent"
                            autoComplete="off"
                            readOnly
                          />
                        </div>
                        <div className="w-full">
                          <label htmlFor="email">Medical Test</label>
                          <input
                            id="token-id"
                            type="text"
                            value={record?.medicalTests}
                            className="form-input form-input-green bg-transparent"
                            autoComplete="off"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5">
                        <div className="w-full">
                          <label htmlFor="first-name">Prescription</label>
                          <textarea
                            id="prescription"
                            type="text"
                            value={record?.prescription}
                            className="form-input form-input-green bg-transparent"
                            readOnly
                            rows={10}
                          />
                        </div>
                        <div className="w-full">
                          <label htmlFor="email">Notes</label>
                          <textarea
                            id="Notes"
                            type="text"
                            value={record?.notes}
                            className="form-input form-input-green bg-transparent"
                            autoComplete="off"
                            readOnly
                            rows={10}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-600 text-center mt-10">
                  <span className="mb-2 flex justify-center">
                    <img src={emptyBox} alt="" className="w-10" />
                  </span>
                  No Medical Records Found
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default PatientDetails;

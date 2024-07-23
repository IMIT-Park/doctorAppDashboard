import { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import IconSearch from "../../../components/Icon/IconSearch";
import IconLoader from "../../../components/Icon/IconLoader";
import bookingDirection from "/assets/images/booking-direction.png";
import NetworkHandler from "../../../utils/NetworkHandler";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UseContext";
import IconCaretDown from "../../../components/Icon/IconCaretDown";

const ClinicBookingDoctor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  }, [dispatch]);

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic[0]?.clinic_id;

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setPatientDetails, bookingDetails, setBookingDetails } =
    useContext(UserContext);

  //Search Patients fetch
  const fetchPatients = async () => {
    if (!search) {
      setPatients([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/patient/getpatientdata",
        { keyword: search }
      );
      if (response.status === 200) {
        setPatients(response.data.patients);
      } else {
        setPatients([]);
        setError("No data found for the search query.");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("No Patients found.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const handleSuggestionClick = (patient) => {
    setPatientDetails(patient);
    sessionStorage.setItem("patientDetails", JSON.stringify(patient));
    navigate("/clinic/bookings/patient-details");
  };

  useEffect(() => {
    setPatientDetails(null);
    sessionStorage.setItem("patientDetails", null);
  }, []);

  const handleNewUserClick = () => {
    navigate("/clinic/bookings/patient-details");
  };

  return (
    <div>
      <ScrollToTop />
      {bookingDetails?.whoIsBooking === "owner" ? (
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="btn btn-green btn-sm -mt-4 mb-2"
        >
          <IconCaretDown className="w-4 h-4 rotate-90" />
        </button>
      ) : (
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <label
            className="bg-white dark:bg-slate-900 text-[#006241] py-2 px-4 rounded"
            style={{ boxShadow: "0 0 4px 2px #00000026" }}
          >
            Direct Booking
          </label>
        </div>
      )}

      <div className="panel">
        <div className="flex justify-center items-center">
          <img
            src={bookingDirection}
            alt=""
            className="w-full max-w-52 sm:max-w-64 md:max-w-80"
          />
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchPatients();
            }}
            className="mx-auto w-full mb-2"
          >
            <div className="flex flex-col items-center mt-10 md:mt-20">
              <div className="relative mb-4 w-full max-w-md">
                <input
                  type="text"
                  value={search}
                  placeholder="Search by Name, Email, Phone no"
                  className="form-input form-input-green shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] rounded-full h-11 pr-10 pl-5 w-full"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />
                <button
                  type="button"
                  className="btn-grey absolute right-0 top-0 bottom-0 rounded-full w-9 h-full p-0 flex items-center justify-center"
                  style={{ color: "#AAAAAA", right: "10px" }}
                >
                  <IconSearch className="mx-auto" style={{ fill: "#AAAAAA" }} />
                </button>
                {showSuggestions && patients?.length > 0 && (
                  <ul className="z-10 absolute top-11 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-800 rounded-md w-full p-2 max-h-60 overflow-y-auto">
                    {error && search ? (
                      <li className="px-4 py-2 text-red-500 text-center">
                        {error}
                      </li>
                    ) : (
                      patients?.length > 0 &&
                      patients?.map((patient) => (
                        <li
                          key={patient.patient_id}
                          className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                          onMouseDown={() => handleSuggestionClick(patient)}
                        >
                          {patient?.name}{" "}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              {loading && (
                <div className="text-center mb-4">
                  <IconLoader />
                </div>
              )}

              <div className="flex text-gray-500 font-semibold dark:text-white-dark gap-y-4 w-full max-w-md">
                <button
                  type="button"
                  className="btn btn-green w-full text-base"
                  onClick={handleNewUserClick}
                >
                  New User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicBookingDoctor;

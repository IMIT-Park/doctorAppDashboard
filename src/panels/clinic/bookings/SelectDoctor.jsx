import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import noProfile from "/assets/images/empty-user.png";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import IconLoader from "../../../components/Icon/IconLoader";
import { UserContext } from "../../../contexts/UseContext";
import { showMessage } from "../../../utils/showMessage";

const SelectDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookingDetails, setBookingDetails } = useContext(UserContext);

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId =
    bookingDetails?.clinic_id || userData?.UserClinic[0]?.clinic_id;

  useEffect(() => {
    dispatch(setPageTitle("Booking"));
  }, [dispatch]);

  const [loading, setLoading] = useState(false);
  const [allDoctors, setAlldoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(
    bookingDetails?.doctor_id || null
  );

  const handleDoctorClick = (doctorId) => {
    setSelectedDoctor(doctorId);
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getDoctorbyId/${clinicId}`
      );

      setAlldoctors(response?.data?.doctors);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleNextPage = () => {
    if (!selectedDoctor) {
      showMessage("Please select a doctor", "warning");
      return;
    }

    setBookingDetails({
      ...bookingDetails,
      doctor_id: selectedDoctor,
      clinic_id: clinicId,
      type: "walkin",
    });
    navigate("/clinic/bookings/select-time");
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
      <div className="panel">
        <h1 className="text-center font-semibold text-2xl text-slate-700 m-8 dark:text-slate-300">
          Select Doctor
        </h1>
        {loading ? (
          <div className="w-full h-20 grid place-items-center">
            <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
          </div>
        ) : (
          <>
            {allDoctors && allDoctors.length > 0 ? (
              <div className="flex items-start flex-wrap gap-5 justify-center mb-12">
                {allDoctors?.map((doctor) => (
                  <div
                    key={doctor?.doctor_id}
                    className={`w-full max-w-52 text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer ${
                      selectedDoctor === doctor?.doctor_id
                        ? "border-2 border-[#006241]"
                        : ""
                    }`}
                    onClick={() => handleDoctorClick(doctor?.doctor_id)}
                  >
                    <img
                      src={
                        doctor?.photo ? imageBaseUrl + doctor?.photo : noProfile
                      }
                      alt={doctor?.name}
                      className="rounded w-full aspect-square object-cover"
                    />
                    <p className="font-semibold text-lg mt-2 dark:text-white">
                      {doctor?.name}
                    </p>
                    <p className="text-sm text-gray-700 font-normal dark:text-slate-300">
                      {doctor?.specialization}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-32 grid place-items-center text-gray-500">
                No Doctors found
              </div>
            )}
          </>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-green text-base inline-flex justify-center w-40 px-4 py-2 border border-transparent font-medium rounded-md text-white"
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDoctor;

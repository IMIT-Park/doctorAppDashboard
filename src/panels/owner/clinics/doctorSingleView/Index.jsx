import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../../store/themeConfigSlice";
import Swal from "sweetalert2";
import IconLoader from "../../../../components/Icon/IconLoader";
import ScrollToTop from "../../../../components/ScrollToTop";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import IconCaretDown from "../../../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";
import NetworkHandler, { imageBaseUrl } from "../../../../utils/NetworkHandler";
import { formatDate } from "../../../../utils/formatDate";
import { formatTime } from "../../../../utils/formatTime";

const SinglePage = () => {
  const { clinicId, doctorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(setPageTitle("Doctor"));
  });

  const [doctorDetails, setDoctorDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null);

  const togglePara = (value) => {
    setActive((oldValue) => (oldValue === value ? null : value));
  };

  const days = [
    { name: "Sunday", id: 0 },
    { name: "Monday", id: 1 },
    { name: "Tuesday", id: 2 },
    { name: "Wednesday", id: 3 },
    { name: "Thursday", id: 4 },
    { name: "Friday", id: 5 },
    { name: "Saturday", id: 6 },
  ];

  // fetch doctor data function
  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getbyId/${doctorId}`
      );

      setDoctorDetails(response?.data?.Doctor);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching doctor data
  useEffect(() => {
    fetchDoctorData();
  }, []);

  //  block or unblock handler
  const handleActiveUser = async (userId) => {
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/auth/activate/${userId}`
      );
      fetchDoctorData();
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    }
  };

  const showDoctorBlockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to block this Doctor!",
      showCancelButton: true,
      confirmButtonText: "Block",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleActiveUser(id);
        Swal.fire({
          title: "Blocked!",
          text: "The Doctor has been blocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  const showDoctorUnblockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to unblock this Doctor!",
      showCancelButton: true,
      confirmButtonText: "Unblock",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleActiveUser(id);
        Swal.fire({
          title: "Unblocked!",
          text: "The Doctor has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  // Group time slots by day
  const timeSlotsByDay = {};
  doctorDetails?.timeslots?.forEach((timeslot) => {
    if (!timeSlotsByDay[timeslot.day_id]) {
      timeSlotsByDay[timeslot.day_id] = [];
    }
    timeSlotsByDay[timeslot.day_id].push(timeslot);
  });

  console.log(doctorDetails);
  return (
    <div>
      <ScrollToTop />
      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
        <ul className="flex space-x-2 rtl:space-x-reverse mb-2">
          <li>
            <Link to="/owner/clinics" className="text-primary hover:underline">
              Clinics
            </Link>
          </li>
          <li className="before:content-['/'] before:mr-2">
            <Link
              to={`/owner/clinics/${clinicId}/doctors`}
              className="text-primary hover:underline"
            >
              Doctors
            </Link>
          </li>
          <li className="before:content-['/'] before:mr-2">
            <span>{clinicId}</span>
          </li>
        </ul>
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-start gap-1">
            <h5 className="text-base font-semibold dark:text-white-light">
              Active
            </h5>
            <label className="w-11 h-5 relative">
              <input
                type="checkbox"
                className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                id="custom_switch_checkbox_active"
                checked
                readOnly
              />
              <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
            </label>
          </div>
          <div className="flex items-start gap-1">
            <h5 className="text-base font-semibold dark:text-white-light">
              Blocked
            </h5>
            <label className="w-11 h-5 relative">
              <input
                type="checkbox"
                className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                id="custom_switch_checkbox_active"
                checked={false}
                readOnly
              />
              <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="panel mb-1">
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="flex justify-between flex-wrap gap-4 sm:px-4">
              <div>
                {doctorDetails?.photo && (
                  <img
                    src={imageBaseUrl + doctorDetails?.photo}
                    alt="img"
                    className="w-36 h-36 rounded-full object-cover mb-2"
                  />
                )}
                <div className="text-2xl font-semibold capitalize">
                  {doctorDetails?.name || ""}
                </div>
              </div>
              <label
                className="w-12 h-6 relative"
                onClick={(e) => {
                  e.stopPropagation();
                  if (doctorDetails?.status) {
                    showDoctorBlockAlert(doctorDetails?.user_id);
                  } else {
                    showDoctorUnblockAlert(doctorDetails?.user_id);
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                  id={`custom_switch_checkbox${doctorDetails?.clinic_id}`}
                  checked={doctorDetails?.status}
                  readOnly
                />
                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
              </label>
            </div>
            <div className="text-left sm:px-4">
              <div className="mt-3">
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Address :</div>
                  <div>{doctorDetails?.address || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Email :</div>
                  <div>{doctorDetails?.email || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Phone :</div>
                  <div>{doctorDetails?.phone || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Date of Birth :</div>
                  <div>{formatDate(doctorDetails?.dateOfBirth)}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Fees :</div>
                  <div> {` ₹${doctorDetails?.fees}` || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Gender :</div>
                  <div>{doctorDetails?.gender || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Qualification :</div>
                  <div>{doctorDetails?.qualification || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Specialization :</div>
                  <div>{doctorDetails?.specialization || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Specialization :</div>
                  <div>{doctorDetails?.specialization || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Profie Visibility :</div>
                  <div>
                    {doctorDetails?.visibility ? "Visible" : "Hidden" || ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="my-6">
              <h5 className="text-base font-semibold mb-1 dark:text-white-light">
                Available Days & Time Slots:
              </h5>
              <div className="space-y-2 font-semibold">
                {days.map((day) => (
                  <div key={day.id}>
                    {timeSlotsByDay[day.id] && (
                      <div>
                        <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
                          <button
                            type="button"
                            className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${
                              active === day.id ? "!text-primary" : ""
                            }`}
                            onClick={() => togglePara(day.id)}
                          >
                            {day.name}
                            <div
                              className={`ltr:ml-auto rtl:mr-auto ${
                                active === day.id ? "rotate-180" : ""
                              }`}
                            >
                              <IconCaretDown />
                            </div>
                          </button>
                          <div>
                            <AnimateHeight
                              duration={300}
                              height={active === day.id ? "auto" : 0}
                            >
                              <div className="p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b] flex items-center justify-start flex-wrap gap-3 sm:gap-4">
                                {timeSlotsByDay[day.id].map((timeslot) => (
                                  <span
                                    key={timeslot.DoctorTimeSlot_id}
                                    className="text-slate-900 dark:text-slate-50 font-normal border border-primary px-2 py-0.5 rounded-md"
                                  >
                                    {formatTime(timeslot.startTime)} -{" "}
                                    {formatTime(timeslot.endTime)}
                                  </span>
                                ))}
                              </div>
                            </AnimateHeight>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-base font-semibold mb-1 dark:text-white-light">
                Leaves:
              </h5>
              <div className="w-full border border-blue-500 rounded pt-2 pb-3 px-3">
                {doctorDetails?.Drleave?.map((leave,index) => {
                  const timeSlot =
                    timeSlotsByDay[leave?.DoctorTimeSlot_id]?.[0];
                  return (
                    <div
                      key={leave.leave_id}
                      className="flex flex-col items-start gap-1"
                    >
                      <span className="badge bg-secondary rounded-none">
                        {formatDate(leave?.leave_date)}
                      </span>
                      <div className="w-full flex items-start gap-2 flex-wrap">
                        {timeSlot && (
                          <span
                            key={timeSlot.DoctorTimeSlot_id}
                            className="text-slate-900 dark:text-slate-50 font-normal text-xs border border-primary px-2 py-0.5 rounded-md"
                          >
                            {formatTime(timeSlot.startTime)} -{" "}
                            {formatTime(timeSlot.endTime)}
                          </span>
                        )}
                      </div>
                      {doctorDetails?.Drleave?.length > 1 && index !== doctorDetails?.Drleave?.length - 1 && (
            <div className="w-full h-[1px] bg-blue-500  my-4" />
          )}
                    </div>
                    
                  );
                })}

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SinglePage;

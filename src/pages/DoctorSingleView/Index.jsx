import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import IconLoader from "../../components/Icon/IconLoader";
import ScrollToTop from "../../components/ScrollToTop";
import { useNavigate, useParams } from "react-router-dom";
import IconCaretDown from "../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";
import NetworkHandler, { imageBaseUrl } from "../../utils/NetworkHandler";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { showMessage } from "../../utils/showMessage";
import IconPlus from "../../components/Icon/IconPlus";
import DeleteTimeslot from "./components/DeleteTimeslot";
import DoctorTimeSlotEdit from "./components/DoctorTimeSlotEdit";
import AddLeave from "./components/AddLeave";
import useBlockUnblock from "../../utils/useBlockUnblock";
import useFetchData from "../../customHooks/useFetchData";
import IconTrashLines from "../../components/Icon/IconTrashLines";
import DeleteLeave from "./components/DeleteLeave";
import CustomSwitch from "../../components/CustomSwitch";
import { UserContext } from "../../contexts/UseContext";
import CustomButton from "../../components/CustomButton";
import noProfile from "/assets/images/empty-user.png";
import RemoveDoctor from "./components/RemoveDoctor";
import Swal from "sweetalert2";

const SinglePage = () => {
  const { doctorId, clinicId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userDetails } = useContext(UserContext);

  const isSuperAdmin = userDetails?.role_id === 1;

  useEffect(() => {
    dispatch(setPageTitle("Doctor"));
  });

  const [buttonLoading, setButtonLoading] = useState(false);
  const [timeslotsLoading, setTimeslotsLoading] = useState(false);
  const [leavesLoading, setLeavesLoading] = useState(false);
  const [active, setActive] = useState(null);
  const [addTimeSlotModal, setAddTimeSlotModal] = useState(false);
  const [editTimeSlotModal, setEditTimeSlotModal] = useState(false);
  const [deleteTimeSlotModal, setDeleteTimeSlotModal] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState("");

  const [timesInput, setTimesInput] = useState({
    timeslotId: "",
    startTime: "",
    endTime: "",
    noOfConsultationsPerDay: "",
    time_slot: "",
    clinic_id: clinicId,
    day_id: "",
  });
  const [timeSlotId, setTimeSlotId] = useState("");
  const [doctorTimeSlots, setDoctorTimeSlots] = useState([]);
  const [doctorLeaves, setDoctorLeaves] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [deleteLeaveModal, setDeleteLeaveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [clinicsLoading, setClinicsLoading] = useState(false);
  const [doctorClinics, setDoctorClinics] = useState([]);
  const [removeModal, setRemoveModal] = useState(false);

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
  const {
    data: doctorData,
    loading: detailsLoading,
    refetch: fetchDoctorData,
  } = useFetchData(`/v1/doctor/getbyId/${doctorId}`, {}, [doctorId]);
  const doctorDetails = doctorData?.Doctor;

  // fetch doctor's clinics function
  const fetchDoctorClinics = async () => {
    setClinicsLoading(true);

    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getClincbydr/${doctorId}`
      );
      setDoctorClinics(response?.data?.allclinics);
    } catch (error) {
      setClinicsLoading(false);
    } finally {
      setClinicsLoading(false);
    }
  };

  useEffect(() => {
    if (!clinicId) {
      console.log("iam working");
      fetchDoctorClinics();
    }
  }, [doctorId]);

  // set the first clinic's id from the clinics list into the selectedClinicId state
  useEffect(() => {
    if (doctorClinics && doctorClinics.length > 0) {
      setSelectedClinicId(doctorClinics[0]?.clinic_id);
    }
  }, [doctorClinics]);

  // fetch timeslots data function
  const getDoctorTimeslots = async () => {
    setTimeslotsLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/doctor/gettimeslots",
        { doctor_id: doctorId, clinic_id: clinicId || selectedClinicId }
      );

      if (response.status === 201) {
        setTimeslotsLoading(false);
        setDoctorTimeSlots(response?.data?.timeslots?.rows);
      }
    } catch (error) {
      setTimeslotsLoading(false);
      console.log(error);
    } finally {
      setTimeslotsLoading(false);
    }
  };

  // fetch Leaves data function
  const getDoctorLeaves = async () => {
    setLeavesLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/leave/getdrleave",
        { doctor_id: doctorId, clinic_id: clinicId || selectedClinicId }
      );
      if (response.status === 201) {
        setLeavesLoading(false);
        setDoctorLeaves(response?.data?.leaveDetails);
      }
    } catch (error) {
      setLeavesLoading(false);
      console.log(error);
    } finally {
      setTimeslotsLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId || selectedClinicId) {
      getDoctorTimeslots();
      getDoctorLeaves();
    }
  }, [clinicId, selectedClinicId]);

  // clinic select funtion
  const handleClinicSelect = (clinic) => {
    setSelectedClinicId(clinic?.clinic_id);
  };

  // add timeslot modal handler
  const openAddTimeSlotModal = () => {
    setAddTimeSlotModal(true);
  };

  const closeAddTimeSlotModal = () => {
    setSelectedDay("");
    setTimesInput({
      ...timesInput,
      timeslotId: "",
      startTime: "",
      endTime: "",
      noOfConsultationsPerDay: "",
      time_slot: "",
      clinic_id: clinicId || selectedClinicId,
      day_id: "",
    });
    setAddTimeSlotModal(false);
  };

  //  Add Doctor Timeslot function
  const addDoctorTimeSlot = async () => {
    const ensureTimeFormat = (time) => {
      return time.endsWith(":00") ? time : `${time}:00`;
    };

    const updatedTimesInput = {
      ...timesInput,
      startTime: ensureTimeFormat(timesInput.startTime),
      endTime: ensureTimeFormat(timesInput.endTime),
      day_id: selectedDay,
      clinic_id: clinicId || selectedClinicId,
    };

    if (
      !selectedDay ||
      !timesInput.startTime ||
      !timesInput.endTime ||
      !timesInput.noOfConsultationsPerDay ||
      !timesInput.time_slot
    ) {
      showMessage("Please fill in all fields", "warning");
      return true;
    }

    setButtonLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/doctor/createtimeSlots/${doctorId}`,
        { timeslots: [updatedTimesInput] }
      );

      if (response.status === 201) {
        getDoctorTimeslots();
        showMessage("Timeslot Added successfully.", "success");
        closeAddTimeSlotModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // edit timeslot modal handler
  const openEditTimeSlotModal = (timeslot) => {
    setTimesInput({
      ...timesInput,
      timeslotId: timeslot?.DoctorTimeSlot_id || "",
      startTime: timeslot?.startTime || "",
      endTime: timeslot?.endTime || "",
      noOfConsultationsPerDay: timeslot?.noOfConsultationsPerDay || "",
      time_slot: timeslot?.time_slot || "",
      day_id:
        timeslot?.day_id !== undefined && timeslot?.day_id !== null
          ? String(timeslot.day_id)
          : "",
      clinic_id: clinicId || selectedClinicId,
    });
    setEditTimeSlotModal(true);
  };

  const closeEditTimeSlotModal = () => {
    setEditTimeSlotModal(false);
    setTimesInput({
      ...timesInput,
      timeslotId: "",
      startTime: "",
      endTime: "",
      noOfConsultationsPerDay: "",
      time_slot: "",
      clinic_id: clinicId || selectedClinicId,
      day_id: "",
    });
  };

  //  Edit Doctor Timeslot function
  const editDoctorTimeSlot = async () => {
    const ensureTimeFormat = (time) => {
      return time.endsWith(":00") ? time : `${time}:00`;
    };

    const updatedTimesInput = {
      ...timesInput,
      startTime: ensureTimeFormat(timesInput.startTime),
      endTime: ensureTimeFormat(timesInput.endTime),
      clinic_id: clinicId || selectedClinicId,
    };

    if (
      !timesInput.startTime ||
      !timesInput.endTime ||
      !timesInput.noOfConsultationsPerDay ||
      !timesInput.time_slot
    ) {
      showMessage("Please fill in all fields", "warning");
      return true;
    }

    setButtonLoading(true);

    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/doctor/edittimeSlots/${timesInput?.timeslotId}`,
        updatedTimesInput
      );

      if (response.status === 200) {
        getDoctorTimeslots();
        showMessage("Timeslot Updated successfully.", "success");
        closeEditTimeSlotModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // delete timeslot modal handler
  const openDeletTimeSlotModal = (timeSlotId) => {
    setTimeSlotId(timeSlotId);
    setDeleteTimeSlotModal(true);
  };

  const closeDeletTimeSlotModal = () => {
    setTimeSlotId("");
    setDeleteTimeSlotModal(false);
  };

  const deleteDoctorTimeSlot = async () => {
    setButtonLoading(true);

    try {
      const response = await NetworkHandler.makeDeleteRequest(
        `/v1/doctor/deletebyId/${timeSlotId}`
      );

      if (response.status === 201) {
        getDoctorTimeslots();
        showMessage("Timeslot Deleted successfully.", "success");
        closeDeletTimeSlotModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // Group time slots by day
  const timeSlotsByDay = {};
  doctorTimeSlots?.forEach((timeslot) => {
    if (!timeSlotsByDay[timeslot.day_id]) {
      timeSlotsByDay[timeslot.day_id] = [];
    }
    timeSlotsByDay[timeslot.day_id].push(timeslot);
  });

  const openAddLeaveModal = () => {
    setAddLeaveModal(true);
  };

  const closeAddLeaveModal = () => {
    setAddLeaveModal(false);
  };

  const openDeleteLeaveModal = (leave) => {
    setSelectedLeave(leave);
    setDeleteLeaveModal(true);
    console.log(leave);
  };

  const closeDeleteLeaveModal = () => {
    setDeleteLeaveModal(false);
    setSelectedTimeSlots([]);
    setSelectedLeave(null);
  };

  // block and unblock handler
  const { showAlert: showDoctorAlert, loading: blockUnblockDoctorLoading } =
    useBlockUnblock(fetchDoctorData);

  // dr remove actions
  const openRemoveModal = () => {
    setRemoveModal(true);
  };
  const closeRemoveModal = () => {
    setRemoveModal(false);
  };

  const removeDoctor = async () => {
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/clinic/removeDR/${clinicId}`,
        { doctor_id: doctorId }
      );
      if (response.status === 201) {
        Swal.fire({
          title: "Removed!",
          text: "Doctor has been removed.",
          icon: "success",
          customClass: "sweet-alerts",
          confirmButtonColor: "#006241",
        });
        closeRemoveModal();
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <ScrollToTop />
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="btn btn-green btn-sm mt-1 mb-4"
        >
          <IconCaretDown className="w-4 h-4 rotate-90" />
        </button>
        <CustomSwitch
          checked={doctorDetails?.status}
          onChange={() =>
            showDoctorAlert(
              doctorDetails?.user_id,
              doctorDetails?.status ? "block" : "activate",
              "doctor"
            )
          }
          tooltipText={doctorDetails?.status ? "Block" : "Unblock"}
          uniqueId={`doctor${doctorDetails?.clinic_id}`}
          size="large"
        />
      </div>
      <div className="panel mb-1">
        {detailsLoading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="flex flex-col items-start gap-4">
              {!isSuperAdmin && (
                <button
                  type="button"
                  className="absolute top-2 right-2 btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openRemoveModal();
                  }}
                >
                  Remove
                </button>
              )}
              <div className="relative">
                <img
                  src={
                    doctorDetails?.photo
                      ? imageBaseUrl + doctorDetails?.photo
                      : noProfile
                  }
                  alt={doctorDetails?.name || ""}
                  className="w-40 h-40 rounded-full object-cover mb-2"
                />
              </div>
              <div className="w-full flex items-start justify-between flex-wrap gap-2">
                <div className="text-2xl dark:text-slate-300 font-semibold capitalize">
                  {doctorDetails?.name || ""}
                </div>
              </div>
              <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="flex flex-col w-full xl:col-span-2">
                  <div className="flex flex-col gap-4 flex-wrap">
                    <div>
                      <div className="text-base text-gray-500">Address:</div>
                      <div className="text-base dark:text-slate-300 min-h-[124px] p-2 border dark:border-slate-800 rounded">
                        {doctorDetails?.address || ""}
                      </div>
                    </div>
                    <div className="w-full grid md:grid-cols-2 gap-4">
                      <div className="w-full">
                        <div className="text-base text-gray-500">Email</div>
                        <div className="text-base dark:text-slate-300 p-2 border dark:border-slate-800 rounded">
                          {doctorDetails?.email || ""}
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="text-base text-gray-500">Phone</div>
                        <div className="text-base dark:text-slate-300 p-2 border dark:border-slate-800 rounded">
                          {doctorDetails?.phone || ""}
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="text-base text-gray-500">Fees</div>
                        <div className="text-base dark:text-slate-300 p-2 border dark:border-slate-800 rounded">
                          ₹{doctorDetails?.fees || ""}
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="text-base text-gray-500">
                          Specialization
                        </div>
                        <div className="text-base dark:text-slate-300 p-2 border dark:border-slate-800 rounded">
                          {doctorDetails?.specialization || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full grid md:grid-cols-2 xl:grid-cols-1 gap-4 xl:col-span-1">
                  <div className="w-full">
                    <div className="text-base text-gray-500">Qualification</div>
                    <div className="text-base dark:text-slate-300 p-2 border dark:border-slate-800 rounded">
                      {doctorDetails?.qualification || ""}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="text-base text-gray-500">
                      Verification Status
                    </div>
                    <div className="text-base dark:text-slate-300 p-2 border dark:border-slate-800 rounded">
                      {doctorDetails?.verification_status}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="text-base text-gray-500">Gender</div>
                    <div className="capitalize text-base dark:text-slate-300 p-2 border dark:border-slate-800 rounded">
                      {doctorDetails?.gender || ""}
                    </div>
                  </div>
                  <div className="w-full ">
                    <div className="text-base text-gray-500">Date of Birth</div>
                    <div className="text-base dark:text-slate-300 p-2 border dark:border-slate-800 rounded">
                      {formatDate(doctorDetails?.dateOfBirth)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* clinics list starts here */}

            {selectedClinicId && (
              <>
                <h5 className="mt-14 mb-2 text-xl font-semibold text-dark dark:text-white-dark">
                  Clinics :
                </h5>
                {clinicsLoading ? (
                  <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
                ) : (
                  <>
                    {doctorClinics && doctorClinics?.length > 0 ? (
                      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                        {doctorClinics?.map((clinic) => (
                          <div
                            key={clinic?.clinic_id}
                            className={`Sm:min-w-[413px] border bg-[#F6F6F6] dark:bg-slate-900 ${
                              selectedClinicId === clinic?.clinic_id
                                ? "border-[#006241]"
                                : "border-slate-200 dark:border-slate-800"
                            } rounded flex gap-3 items-center p-1 cursor-pointer`}
                            onClick={() => handleClinicSelect(clinic)}
                          >
                            <img
                              src={imageBaseUrl + clinic?.banner_img_url}
                              alt="Clinic"
                              className="w-[85px] h-[62px] rounded-md object-cover"
                            />
                            <div>
                              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-300 capitalize">
                                {clinic?.name || ""}
                              </h4>
                              <p className="text-sm font-normal text-slate-500 capitalize">
                                {clinic?.place || ""}
                              </p>
                            </div>
                            <div
                              className={`ml-auto mr-2 w-4 h-4 rounded-full border ${
                                selectedClinicId === clinic?.clinic_id
                                  ? "border-[#006241] bg-slate-400"
                                  : "border-slate-200 dark:border-slate-800"
                              } p-[1px] bg-slate-200 dark:bg-slate-800`}
                            >
                              {selectedClinicId === clinic?.clinic_id && (
                                <div className="bg-[#006241] w-full h-full rounded-full" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">
                        No clinics Found
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {/* clinics list ends here */}
            <div className="my-10">
              <div className="flex items-end justify-between gap-2 flex-wrap mb-2 mt-2">
                <h5 className="text-lg font-semibold text-dark dark:text-white-dark">
                  Available Days & Time Slots:
                </h5>
                {!isSuperAdmin && (
                  <CustomButton onClick={openAddTimeSlotModal}>
                    <IconPlus className="ltr:mr-2 rtl:ml-2 " />
                    Add Time Slot
                  </CustomButton>
                )}
              </div>
              {doctorTimeSlots && doctorTimeSlots?.length ? (
                <>
                  {timeslotsLoading ? (
                    <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
                  ) : (
                    <div className="space-y-2 font-semibold">
                      {days.map((day) => (
                        <div key={day.id}>
                          {timeSlotsByDay[day.id] && (
                            <div>
                              <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
                                <button
                                  type="button"
                                  className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${
                                    active === day.id
                                      ? "!text-[#006241] dark:!text-[#4ec37bfb]"
                                      : ""
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
                                      {timeSlotsByDay[day.id].map(
                                        (timeslot) => (
                                          <div
                                            key={timeslot.DoctorTimeSlot_id}
                                            className="flex flex-col items-center gap-2 border border-slate-300 dark:border-slate-500 pt-4 px-3 pb-2 rounded"
                                          >
                                            <span className="text-[#006241] font-bold border border-[#006241] px-4 py-1 rounded">
                                              {formatTime(timeslot?.startTime)}{" "}
                                              - {formatTime(timeslot?.endTime)}
                                            </span>
                                            <div className="flex items-center gap-1">
                                              <p>No. of Consultations:</p>{" "}
                                              <div className="text-slate-700 dark:text-slate-300">
                                                {
                                                  timeslot?.noOfConsultationsPerDay
                                                }
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <p>Consultation Time: </p>
                                              <div className="text-slate-700 dark:text-slate-300">
                                                {timeslot?.time_slot} Min
                                              </div>
                                            </div>
                                            {!isSuperAdmin && (
                                              <div className="flex items-center gap-1 mt-1">
                                                <button
                                                  type="button"
                                                  className="btn btn-primary btn-sm rounded-sm py-1 min-w-20 sm:min-w-24"
                                                  onClick={() =>
                                                    openEditTimeSlotModal(
                                                      timeslot
                                                    )
                                                  }
                                                >
                                                  Edit
                                                </button>
                                                <button
                                                  type="button"
                                                  className="btn btn-danger btn-sm rounded-sm py-1 min-w-20 sm:min-w-24"
                                                  onClick={() =>
                                                    openDeletTimeSlotModal(
                                                      timeslot?.DoctorTimeSlot_id
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </AnimateHeight>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-600">No Timeslots Found</div>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-end justify-between gap-2 flex-wrap mb-2">
                <h5 className="text-lg font-semibold text-dark dark:text-white-dark">
                  Leaves:
                </h5>
                {!isSuperAdmin && (
                  <CustomButton onClick={openAddLeaveModal}>
                    <IconPlus className="ltr:mr-2 rtl:ml-2 " />
                    Add Leave
                  </CustomButton>
                )}
              </div>
              {doctorLeaves && doctorLeaves?.length > 0 ? (
                <>
                  {leavesLoading ? (
                    <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
                  ) : (
                    <div className="w-full border border-[#d3d3d3] dark:border-[#1b2e4b] rounded pt-2 pb-3 px-5">
                      {doctorLeaves?.map((leave, index) => (
                        <div
                          key={leave?.leave_date + index}
                          className={`w-full flex items-center justify-between flex-wrap gap-2 py-6 ${
                            index !== doctorLeaves.length - 1
                              ? "border-b border-[#d3d3d3] dark:border-[#1b2e4b]"
                              : ""
                          }`}
                        >
                          <span className="border border-[#006241] rounded py-1 px-5 text-[#006241] font-bold">
                            {leave?.fullday ? "Full Day Leave" : "Shift Leave"}
                          </span>
                          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-1 font-bold text-base text-slate-500  ">
                            <span className="w-24 sm:ml-28 md:ml-28 ml-28 sm:w-auto  ">
                              {formatDate(leave?.leave_date)}
                            </span>
                            {!leave?.fullday && (
                              <div className="flex items-center flex-wrap w-full sm:w-auto">
                                {leave?.leaves?.map((slot, slotIndex) => (
                                  <span
                                    key={slot?.DoctorTimeSlot_id}
                                    className="w-full sm:w-auto"
                                  >
                                    (Slot:{" "}
                                    {formatTime(
                                      slot?.DoctorTimeSlot?.startTime
                                    )}{" "}
                                    -{" "}
                                    {formatTime(slot?.DoctorTimeSlot?.endTime)})
                                    {slotIndex < leave.leaves.length - 1 &&
                                      ", "}
                                  </span>
                                ))}
                              </div>
                            )}
                            {!isSuperAdmin && (
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 mt-2 sm:mt-0 sm:ml-2 lg:w-auto sm:w-11 md:w-11 ml-44"
                                onClick={() => openDeleteLeaveModal(leave)}
                                title="Delete leave"
                              >
                                <IconTrashLines />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-600">No Leaves Found</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* doctor timeslot Add modal */}
      <DoctorTimeSlotEdit
        open={addTimeSlotModal}
        closeModal={closeAddTimeSlotModal}
        timesInput={timesInput}
        setTimesInput={setTimesInput}
        buttonLoading={buttonLoading}
        formSubmit={addDoctorTimeSlot}
        days={days}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      {/* doctor timeslot edit modal */}
      <DoctorTimeSlotEdit
        open={editTimeSlotModal}
        closeModal={closeEditTimeSlotModal}
        timesInput={timesInput}
        setTimesInput={setTimesInput}
        buttonLoading={buttonLoading}
        formSubmit={editDoctorTimeSlot}
        isEdit={true}
      />

      {/* timeslot delete modal */}
      <DeleteTimeslot
        open={deleteTimeSlotModal}
        closeModal={closeDeletTimeSlotModal}
        buttonLoading={buttonLoading}
        handleSubmit={deleteDoctorTimeSlot}
      />

      {/* add leave modal */}
      <AddLeave
        open={addLeaveModal}
        closeModal={closeAddLeaveModal}
        buttonLoading={buttonLoading}
        clinicId={Number(clinicId)}
        doctorId={doctorId}
        fetchLeaveData={getDoctorLeaves}
      />

      <DeleteLeave
        open={deleteLeaveModal}
        closeModal={closeDeleteLeaveModal}
        buttonLoading={buttonLoading}
        leave={selectedLeave}
        fetchLeaveData={getDoctorLeaves}
        selectedTimeSlots={selectedTimeSlots}
        setSelectedTimeSlots={setSelectedTimeSlots}
      />

      {/* dr remove modal */}
      <RemoveDoctor
        show={removeModal}
        onClose={closeRemoveModal}
        onConfirm={removeDoctor}
      />
    </div>
  );
};

export default SinglePage;

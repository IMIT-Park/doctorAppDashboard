import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import IconLoader from "../../components/Icon/IconLoader";
import ScrollToTop from "../../components/ScrollToTop";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconCaretDown from "../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";
import NetworkHandler, { imageBaseUrl } from "../../utils/NetworkHandler";
import { formatDate, reverseformatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import IconEdit from "../../components/Icon/IconEdit";
import { showMessage } from "../../utils/showMessage";
import IconPlus from "../../components/Icon/IconPlus";
import DeleteTimeslot from "./components/DeleteTimeslot";
import DoctorDetailsEdit from "./components/DoctorDetailsEdit";
import DoctorProfileEdit from "./components/DoctorProfileEdit";
import DoctorTimeSlotEdit from "./components/DoctorTimeSlotEdit";
import AddLeave from "./components/AddLeave";
import useBlockUnblock from "../../utils/useBlockUnblock";
import "tippy.js/dist/tippy.css";
import useFetchData from "../../customHooks/useFetchData";
import IconTrashLines from "../../components/Icon/IconTrashLines";
import DeleteLeave from "./components/DeleteLeave";
import CustomSwitch from "../../components/CustomSwitch";
import { UserContext } from "../../contexts/UseContext";
import CustomButton from "../../components/CustomButton";

const SinglePage = () => {
  const { clinicId, doctorId } = useParams();
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
  const [editDetailsModal, setEditDetailsModal] = useState(false);
  const [editPhotoModal, setEditPhotoModal] = useState(false);
  const [addTimeSlotModal, setAddTimeSlotModal] = useState(false);
  const [editTimeSlotModal, setEditTimeSlotModal] = useState(false);
  const [deleteTimeSlotModal, setDeleteTimeSlotModal] = useState(false);
  const [input, setInput] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    qualification: "",
    specialization: "",
    fees: "",
    visibility: true,
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [timesInput, setTimesInput] = useState({
    timeslotId: "",
    startTime: "",
    endTime: "",
    noOfConsultationsPerDay: 0,
    time_slot: 0,
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

  // fetch timeslots data function
  const getDoctorTimeslots = async () => {
    setTimeslotsLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/doctor/gettimeslots",
        { doctor_id: doctorId, clinic_id: clinicId }
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
        { doctor_id: doctorId, clinic_id: clinicId }
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
    if (clinicId) {
      getDoctorTimeslots();
      getDoctorLeaves();
    }
  }, [clinicId]);

  // edit details modal handler
  const openEditDetailsModal = () => {
    setInput({
      ...input,
      name: doctorDetails?.name || "",
      phone: doctorDetails?.phone || "",
      email: doctorDetails?.email || "",
      address: doctorDetails?.address || "",
      gender: doctorDetails?.gender || "",
      dateOfBirth: reverseformatDate(doctorDetails?.dateOfBirth) || "",
      qualification: doctorDetails?.qualification || "",
      specialization: doctorDetails?.specialization || "",
      fees: doctorDetails?.fees || "",
      visibility: doctorDetails?.visibility || true,
    });
    setEditDetailsModal(true);
  };

  const closeEditDetailsModal = () => {
    setInput({
      ...input,
      name: "",
      phone: "",
      email: "",
      address: "",
      gender: "",
      dateOfBirth: "",
      qualification: "",
      specialization: "",
      fees: "",
      visibility: true,
    });
    setEditDetailsModal(false);
  };

  //  Edit Doctor Details function
  const editDoctorDetails = async () => {
    if (
      !input.name ||
      !input.phone ||
      !input.email ||
      !input.address ||
      !input.gender ||
      !input.dateOfBirth ||
      !input.qualification ||
      !input.specialization ||
      !input.fees
    ) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    setButtonLoading(true);
    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/doctor/editDoctor/${doctorId}`,
        input
      );

      if (response.status === 200) {
        fetchDoctorData();
        showMessage("Details Updated successfully.", "success");
        closeEditDetailsModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // edit photo modal handler
  const openEditProfileModal = () => {
    setEditPhotoModal(true);
  };

  const closeEditProfileModal = () => {
    setProfilePicture(null);
    setEditPhotoModal(false);
  };

  //  Edit Doctor Profile function
  const editDoctorPhoto = async () => {
    if (!profilePicture) {
      showMessage("Please select a picture", "warning");
      return true;
    }

    setButtonLoading(true);

    const formData = new FormData();
    formData.append("image_url[]", profilePicture);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/doctor/upload/${doctorId}`,
        formData
      );

      if (response.status === 201) {
        fetchDoctorData();
        showMessage("Photo Updated successfully.", "success");
        closeEditProfileModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
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
      noOfConsultationsPerDay: 0,
      time_slot: 0,
      clinic_id: clinicId,
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
      noOfConsultationsPerDay: timeslot?.noOfConsultationsPerDay || 0,
      time_slot: timeslot?.time_slot || 0,
      day_id:
        timeslot?.day_id !== undefined && timeslot?.day_id !== null
          ? String(timeslot.day_id)
          : "",
      clinic_id: clinicId,
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
      noOfConsultationsPerDay: 0,
      time_slot: 0,
      clinic_id: clinicId,
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
      <div className="panel mb-1">
        {detailsLoading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="flex flex-wrap gap-6 min-[1159px]:gap-16 md:pr-20">
              <div className="relative">
                {doctorDetails?.photo ? (
                  <img
                    src={imageBaseUrl + doctorDetails?.photo}
                    alt={doctorDetails?.name || ""}
                    className="w-40 h-40 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full grid place-items-center bg-slate-300 dark:bg-slate-700 mb-2">
                    No photo
                  </div>
                )}
                {!isSuperAdmin && (
                  <button
                    type="button"
                    className="absolute top-0 right-0 btn btn-dark w-8 h-8 p-0 rounded-full"
                    onClick={openEditProfileModal}
                  >
                    <IconEdit className="w-4" />
                  </button>
                )}
                <div className="text-2xl dark:text-slate-300 font-semibold capitalize">
                  {doctorDetails?.name || ""}
                </div>
              </div>
              <div className="flex items-start flex-col md:flex-row flex-wrap md:gap-10 w-full md:w-auto">
                <div>
                  <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Address <span>:</span>
                    </div>
                    <div className="dark:text-slate-300 md:max-w-80">
                      {doctorDetails?.address || ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2 ">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Email <span>:</span>
                    </div>
                    <div className="dark:text-slate-300">
                      {doctorDetails?.email || ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2 ">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Phone <span>:</span>
                    </div>
                    <div className="dark:text-slate-300">
                      {doctorDetails?.phone || ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2 ">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Date of Birth <span>:</span>
                    </div>
                    <div className="dark:text-slate-300">
                      {formatDate(doctorDetails?.dateOfBirth)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2 ">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Fees <span>:</span>
                    </div>
                    <div className="dark:text-slate-300">
                      {" "}
                      {` ₹${doctorDetails?.fees}` || ""}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Gender <span>:</span>
                    </div>
                    <div className="dark:text-slate-300">
                      {doctorDetails?.gender || ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Qualification <span>:</span>
                    </div>
                    <div className="dark:text-slate-300">
                      {doctorDetails?.qualification || ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Specialization <span>:</span>
                    </div>
                    <div className="dark:text-slate-300">
                      {doctorDetails?.specialization || ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <div className="text-white-dark min-w-[105px] flex justify-between">
                      Profie Visibility <span>:</span>
                    </div>
                    <div className="dark:text-slate-300">
                      {doctorDetails?.visibility ? "Visible" : "Hidden" || ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-5 right-5 flex flex-col items-center gap-4">
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
                {!isSuperAdmin && (
                  <button
                    className="flex hover:text-info"
                    onClick={openEditDetailsModal}
                  >
                    <IconEdit className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            <div className="my-10">
              <div className="flex items-end justify-between gap-2 flex-wrap mb-2">
                <h5 className="text-base font-semibold text-white-dark">
                  Available Days & Time Slots:
                </h5>
                {!isSuperAdmin && (
                  <CustomButton onClick={openAddTimeSlotModal}>
                    <IconPlus className="ltr:mr-2 rtl:ml-2" />
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
                <h5 className="text-base font-semibold mb-1 text-white-dark">
                  Leaves:
                </h5>
                {!isSuperAdmin && (
                  <CustomButton onClick={openAddLeaveModal}>
                    <IconPlus className="ltr:mr-2 rtl:ml-2" />
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
                          className="w-full flex items-center justify-between flex-wrap gap-2 py-6 border-b border-[#d3d3d3] dark:border-[#1b2e4b]"
                        >
                          <span className="border border-[#006241] rounded py-1 px-5 text-[#006241] font-bold">
                            {leave?.fullday ? "Full Day Leave" : "Shift Leave"}
                          </span>
                          <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-1 font-bold text-base text-slate-500 ml-auto">
                            <span>{formatDate(leave?.leave_date)}</span>
                            {!leave?.fullday && (
                              <div className="flex items-center flex-wrap">
                                {leave?.leaves?.map((slot, slotIndex) => (
                                  <span key={slot?.DoctorTimeSlot_id}>
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
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 ml-2"
                              onClick={() => openDeleteLeaveModal(leave)}
                              title="Delete leave"
                            >
                              <IconTrashLines />
                            </button>
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
      {/* doctor details edit modal */}
      <DoctorDetailsEdit
        open={editDetailsModal}
        closeModal={closeEditDetailsModal}
        input={input}
        setInput={setInput}
        buttonLoading={buttonLoading}
        formSubmit={editDoctorDetails}
      />

      {/* doctor photo edit modal */}
      <DoctorProfileEdit
        open={editPhotoModal}
        closeModal={closeEditProfileModal}
        profilePicture={profilePicture}
        setProfilePicture={setProfilePicture}
        formSubmit={editDoctorPhoto}
        buttonLoading={buttonLoading}
      />

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
        clinicId={clinicId}
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
    </div>
  );
};

export default SinglePage;

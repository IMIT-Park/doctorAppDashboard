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
import { formatDate, reverseformatDate } from "../../../../utils/formatDate";
import { formatTime } from "../../../../utils/formatTime";
import IconEdit from "../../../../components/Icon/IconEdit";
import IconTrashLines from "../../../../components/Icon/IconTrashLines";
import DoctorDetailsEdit from "./DoctorDetailsEdit";
import { showMessage } from "../../../../utils/showMessage";
import DoctorProfileEdit from "./DoctorProfileEdit";
import DoctorTimeSlotEdit from "./DoctorTimeSlotEdit";
import IconPlus from "../../../../components/Icon/IconPlus";
import DeleteTimeslot from "./DeleteTimeslot";

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
  const [buttonLoading, setButtonLoading] = useState(false);
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
  const [selectedDay, setSelectedDay] = useState("");

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
        fetchDoctorData();
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
        fetchDoctorData();
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

      console.log(response);
      if (response.status === 201) {
        fetchDoctorData();
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
      </div>
      <div className="panel mb-1">
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="flex justify-between flex-wrap gap-4 sm:px-4">
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
                <button
                  type="button"
                  className="absolute top-0 right-0 btn btn-dark w-8 h-8 p-0 rounded-full"
                  onClick={openEditProfileModal}
                >
                  <IconEdit className="w-4" />
                </button>

                <div className="text-2xl font-semibold capitalize">
                  {doctorDetails?.name || ""}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
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
                <button
                  className="flex hover:text-info"
                  onClick={openEditDetailsModal}
                >
                  <IconEdit className="w-6 h-6" />
                </button>
              </div>
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
                  <div className="text-white-dark">Profie Visibility :</div>
                  <div>
                    {doctorDetails?.visibility ? "Visible" : "Hidden" || ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="my-6">
              <div className="flex items-end justify-between mb-2">
                <h5 className="text-base font-semibold dark:text-white-light">
                  Available Days & Time Slots:
                </h5>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openAddTimeSlotModal}
                >
                  <IconPlus className="ltr:mr-2 rtl:ml-2" />
                  Add Time Slot
                </button>
              </div>
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
                                  <div
                                    key={timeslot.DoctorTimeSlot_id}
                                    className="flex items-start flex-wrap gap-4 border border-slate-300 dark:border-slate-500 p-2"
                                  >
                                    <div>
                                      <span className="text-slate-900 dark:text-slate-50 font-normal border border-primary px-2 py-0.5 rounded-md">
                                        {formatTime(timeslot?.startTime)} -{" "}
                                        {formatTime(timeslot?.endTime)}
                                      </span>
                                      <div className="flex items-center gap-1 mt-2">
                                        <p>No. of consultations:</p>{" "}
                                        <div className="text-slate-700 dark:text-slate-300">
                                          {timeslot?.noOfConsultationsPerDay}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <p>Consultation Time: </p>
                                        <div className="text-slate-700 dark:text-slate-300">
                                          {timeslot?.time_slot}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        className="btn btn-primary w-7 h-7 p-0 rounded-full"
                                        onClick={() =>
                                          openEditTimeSlotModal(timeslot)
                                        }
                                      >
                                        <IconEdit className="w-4" />
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-danger w-7 h-7 p-0 rounded-full"
                                        onClick={() =>
                                          openDeletTimeSlotModal(
                                            timeslot?.DoctorTimeSlot_id
                                          )
                                        }
                                      >
                                        <IconTrashLines className="w-4" />
                                      </button>
                                    </div>
                                  </div>
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
              {doctorDetails?.Drleave && doctorDetails?.Drleave?.length > 0 ? (
                <div className="w-full border border-blue-500 rounded pt-2 pb-3 px-3">
                  {doctorDetails?.Drleave?.map((leave) => {
                    const timeSlot = doctorDetails?.timeslots.find(
                      (slot) =>
                        slot.DoctorTimeSlot_id === leave.DoctorTimeSlot_id
                    );
                    return (
                      <div
                        key={leave.leave_id}
                        className="flex flex-col items-start gap-1"
                      >
                        <span className="badge bg-secondary rounded-none">
                          {formatDate(leave.leave_date)}
                        </span>
                        {timeSlot && (
                          <div className="w-full flex items-start gap-2 flex-wrap">
                            <span className="text-slate-900 dark:text-slate-50 font-normal text-xs border border-primary px-2 py-0.5 rounded-md">
                              {formatTime(timeSlot.startTime)} -{" "}
                              {formatTime(timeSlot.endTime)}
                            </span>
                          </div>
                        )}
                        {doctorDetails?.Drleave.length > 1 &&
                          doctorDetails?.Drleave.indexOf(leave) !==
                            doctorDetails?.Drleave.length - 1 && (
                            <div className="w-full h-[1px] bg-blue-500 my-4" />
                          )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-1 text-gray-400">No leaves found</p>
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
    </div>
  );
};

export default SinglePage;

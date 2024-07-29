import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { formatDate, reverseformatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import IconEdit from "../../../components/Icon/IconEdit";
import { showMessage } from "../../../utils/showMessage";
import IconPlus from "../../../components/Icon/IconPlus";
import DeleteTimeslot from "../../../pages/DoctorSingleView/components/DeleteTimeslot";
import DoctorDetailsEdit from "../../../pages/DoctorSingleView/components/DoctorDetailsEdit";
import DoctorProfileEdit from "../../../pages/DoctorSingleView/components/DoctorProfileEdit";
import DoctorTimeSlotEdit from "../../../pages/DoctorSingleView/components/DoctorTimeSlotEdit";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import "tippy.js/dist/tippy.css";
import useFetchData from "../../../customHooks/useFetchData";
import CustomSwitch from "../../../components/CustomSwitch";
import { UserContext } from "../../../contexts/UseContext";
import CustomButton from "../../../components/CustomButton";
import noProfile from "/assets/images/empty-user.png";
import Swal from "sweetalert2";

const Profile = () => {
  const { userDetails } = useContext(UserContext);

  const doctorId = userDetails?.UserDoctor?.[0]?.doctor_id;
  const isSuperAdmin = userDetails?.role_id === 1;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Doctor"));
  });

  const [selectedClinic, setSelectedClinic] = useState(null);
  const [timeslotsLoading, setTimeslotsLoading] = useState(false);
  const [clinicId, setClinicId] = useState(null);
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
    noOfConsultationsPerDay: "",
    time_slot: "",
    clinic_id: null,
    day_id: "",
  });
  const [timeSlotId, setTimeSlotId] = useState("");
  const [doctorTimeSlots, setDoctorTimeSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (input.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      showMessage("Phone number must be exactly 10 digits", "warning");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
  const {
    data: clinicsData,
    loading: clinicsLoading,
    refetch: fetchDoctorClinics,
  } = useFetchData(`/v1/doctor/getClincbydr/${doctorId}`, {}, [doctorId]);
  const doctorClinics = clinicsData?.allclinics;

  // set the first clinic from the clinics list into the selectedClinic state
  useEffect(() => {
    if (doctorClinics && doctorClinics.length > 0) {
      setSelectedClinic(doctorClinics[0]);
      setClinicId(doctorClinics[0]?.clinic_id);
    }
  }, [doctorClinics]);

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
      setDoctorTimeSlots([]);
      setTimeslotsLoading(false);
      console.log(error);
    } finally {
      setTimeslotsLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId) {
      getDoctorTimeslots();
    }
  }, [clinicId]);

  // clinic select funtion
  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setClinicId(clinic?.clinic_id);
  };

  // edit details modal handler
  const openEditDetailsModal = () => {
    const phoneWithoutCountryCode = doctorDetails?.phone.replace(/^\+91/, "");

    const capitalizeGender = doctorDetails?.gender
      ? doctorDetails.gender.charAt(0).toUpperCase() +
        doctorDetails.gender.slice(1).toLowerCase()
      : "";

    setInput({
      ...input,
      name: doctorDetails?.name || "",
      phone: phoneWithoutCountryCode,
      email: doctorDetails?.email || "",
      address: doctorDetails?.address || "",
      gender: capitalizeGender,
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

    if (validate()) {
      setButtonLoading(true);

      const updatedData = {
        ...input,
        phone: `+91${input.phone}`,
      };

      try {
        const response = await NetworkHandler.makePutRequest(
          `/v1/doctor/editDoctor/${doctorId}`,
          updatedData
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
      noOfConsultationsPerDay: "",
      time_slot: "",
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
      clinic_id: clinicId,
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
      if (error?.response && error?.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Cannot add timeslot!",
          text: `${error?.response?.data?.error}`,
          padding: "2em",
          customClass: "sweet-alerts",
        });
      } else {
        showMessage("An error occurred. Please try again.", "error");
      }
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
      noOfConsultationsPerDay: "",
      time_slot: "",
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

  // block and unblock handler
  const { showAlert: showDoctorAlert, loading: blockUnblockDoctorLoading } =
    useBlockUnblock(fetchDoctorData);

  return (
    <div>
      <ScrollToTop />
      <div className="panel mb-1">
        {detailsLoading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="flex flex-col items-start gap-4">
              <div className="absolute top-3 right-3 sm:right-5">
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
                <button
                  type="button"
                  className="absolute top-0 right-0 btn btn-dark w-8 h-8 p-0 rounded-full"
                  onClick={openEditProfileModal}
                >
                  <IconEdit className="w-4" />
                </button>
              </div>
              <div className="w-full flex items-start justify-between flex-wrap gap-2">
                <div className="text-2xl dark:text-slate-300 font-semibold capitalize">
                  {doctorDetails?.name || ""}
                </div>
                <CustomButton
                  onClick={openEditDetailsModal}
                  className="min-w-32 py-1.5"
                >
                  Edit
                </CustomButton>
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

            <h5 className="mt-14 mb-2 text-xl font-semibold text-dark dark:text-white-dark">
              Clinics :
            </h5>
            {doctorClinics && doctorClinics?.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {doctorClinics?.map((clinic) => (
                  <div
                    key={clinic?.clinic_id}
                    className={`Sm:min-w-[413px] border bg-[#F6F6F6] dark:bg-slate-900 ${
                      selectedClinic?.clinic_id === clinic?.clinic_id
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
                        selectedClinic?.clinic_id === clinic?.clinic_id
                          ? "border-[#006241] bg-slate-400"
                          : "border-slate-200 dark:border-slate-800"
                      } p-[1px] bg-slate-200 dark:bg-slate-800`}
                    >
                      {selectedClinic?.clinic_id === clinic?.clinic_id && (
                        <div className="bg-[#006241] w-full h-full rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-600">No clinics Found</div>
            )}
            {/* clinics list ends here */}
            {doctorClinics && doctorClinics?.length > 0 && (
              <div className="my-10">
                <div className="flex items-end justify-between gap-2 flex-wrap mb-2">
                  <h5 className="text-lg font-semibold text-dark dark:text-white-dark">
                    Available Days & Time Slots:
                  </h5>
                  <CustomButton onClick={openAddTimeSlotModal}>
                    <IconPlus className="ltr:mr-2 rtl:ml-2" />
                    Add Time Slot
                  </CustomButton>
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
                                                {formatTime(
                                                  timeslot?.startTime
                                                )}{" "}
                                                -{" "}
                                                {formatTime(timeslot?.endTime)}
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
                  <div className="text-xs text-gray-600">
                    No Timeslots Found
                  </div>
                )}
              </div>
            )}
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
        errors={errors}
        setErrors={setErrors}
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

export default Profile;

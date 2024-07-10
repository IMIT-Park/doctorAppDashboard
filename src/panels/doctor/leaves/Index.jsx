import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import IconPlus from "../../../components/Icon/IconPlus";
import AddLeave from "../../../pages/DoctorSingleView/components/AddLeave";
import useFetchData from "../../../customHooks/useFetchData";
import DeleteLeave from "../../../pages/DoctorSingleView/components/DeleteLeave";
import { UserContext } from "../../../contexts/UseContext";
import CustomButton from "../../../components/CustomButton";
import emptyBox from "/assets/images/empty-box.svg";

const DoctorLeaves = () => {
  const { userDetails } = useContext(UserContext);

  const doctorId = userDetails?.UserDoctor?.[0]?.doctor_id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Doctor"));
  });

  const [selectedClinic, setSelectedClinic] = useState(null);
  const [leavesLoading, setLeavesLoading] = useState(false);
  const [clinicId, setClinicId] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [doctorTimeSlots, setDoctorTimeSlots] = useState([]);
  const [doctorLeaves, setDoctorLeaves] = useState([]);
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [deleteLeaveModal, setDeleteLeaveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

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
      setLeavesLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId) {
      getDoctorLeaves();
    }
  }, [clinicId]);

  // clinic select funtion
  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setClinicId(clinic?.clinic_id);
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
  };

  const closeDeleteLeaveModal = () => {
    setDeleteLeaveModal(false);
    setSelectedTimeSlots([]);
    setSelectedLeave(null);
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
      <div className="panel mb-1">
        {detailsLoading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            {/* clinics list starts here */}

            <h5 className="mt-5 mb-4 text-xl font-semibold text-dark dark:text-white-dark">
              Clinics:
            </h5>
            {doctorClinics && doctorClinics?.length ? (
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
                      className="w-[76px] h-[62px] rounded-md object-cover"
                    />
                    <div>
                      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-300 capitalize">
                        {clinic?.name || ""}
                      </h4>
                      <p className="text-xs font-normal text-slate-500 capitalize">
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

            <div className="mt-4">
              <div className="flex items-end justify-between gap-2 flex-wrap mb-2">
                <h5 className="mt-5 mb-5 text-xl font-semibold text-dark dark:text-white-dark">
                  Leaves:
                </h5>
                <CustomButton onClick={openAddLeaveModal}>
                  <IconPlus className="ltr:mr-2 rtl:ml-2" />
                  Add Leave
                </CustomButton>
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
                              ? "border-b border-[#D3D3D3] dark:border-[#1B2E4B]"
                              : ""
                          }`}
                        >
                          <span className="border border-[#006241] rounded py-1 px-5 text-[#006241] font-bold">
                            {leave?.fullday ? "Full Day Leave" : "Shift Leave"}
                          </span>
                          <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-5 font-bold text-base text-slate-500 ml-auto">
                            <span>{formatDate(leave?.leave_date)} </span>
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
                              className="btn btn-danger btn-sm rounded-sm py-1 min-w-10 sm:min-w-24"
                              title="Delete leave"
                              onClick={() => openDeleteLeaveModal(leave)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-600">
                  <span className="mb-2">
                    <img src={emptyBox} alt="" className="w-10" />
                  </span>
                  No Leaves Found
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* add leave modal */}
      <AddLeave
        open={addLeaveModal}
        closeModal={closeAddLeaveModal}
        clinicId={clinicId}
        doctorId={doctorId}
        fetchLeaveData={getDoctorLeaves}
      />

      <DeleteLeave
        open={deleteLeaveModal}
        closeModal={closeDeleteLeaveModal}
        leaveData={selectedLeave}
        fetchLeaveData={getDoctorLeaves}
        selectedTimeSlots={selectedTimeSlots}
        setSelectedTimeSlots={setSelectedTimeSlots}
      />
    </div>
  );
};

export default DoctorLeaves;

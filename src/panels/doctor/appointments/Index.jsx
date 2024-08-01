import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate } from "react-router-dom";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { UserContext } from "../../../contexts/UseContext";
import useFetchData from "../../../customHooks/useFetchData";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import Dropdown from "../../../components/Dropdown";
import IconHorizontalDots from "../../../components/Icon/IconHorizontalDots";
import RescheduleModal from "../../clinic/profile/RescheduleModal";
import CancelReschedule from "../../clinic/profile/CancelReschedule";

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Owners"));
  }, [dispatch]);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [clinicId, setClinicId] = useState(null);
  const [addRescheduleModal, setAddRescheduleModal] = useState(false);
  const [cancelRescheduleModal, setCancelRescheduleModal] = useState(false);
  const [cancelAllAppoinments, setCancelAllAppoinments] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");

  const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  const doctorId = userDetails?.UserDoctor?.[0]?.doctor_id;
  const isSuperAdmin = userDetails?.role_id === 1;

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  const {
    data: clinicsData,
    loading: clinicsLoading,
    refetch: fetchDoctorClinics,
  } = useFetchData(`/v1/doctor/getClincbydr/${doctorId}`, {}, [doctorId]);
  const doctorClinics = clinicsData?.allclinics;

  useEffect(() => {
    if (doctorClinics && doctorClinics.length > 0) {
      setSelectedClinic(doctorClinics[0]);
      setClinicId(doctorClinics[0]?.clinic_id);
    }
  }, [doctorClinics]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setClinicId(clinic?.clinic_id);
  };

  const getallConsultation = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/getallConsultation/${doctorId}?pageSize=${pageSize}&page=${page}`,
        {
          clinic_id: clinicId,
          schedule_date: selectedDate || null,
        }
      );
      setAllAppointments(response?.data?.Consultations?.rows || []);
      setTotalAppointments(response?.data?.Consultations?.count || 0);
      setLoading(false);
    } catch (error) {
      setAllAppointments([]);
      setTotalAppointments(0);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId) {
      getallConsultation();
    }
  }, [clinicId, selectedDate, page, pageSize]);

  const openAddRescheduleModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setAddRescheduleModal(true);
  };

  const openCancelRescheduleModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    console.log(bookingId);
    setCancelRescheduleModal(true);
  };

  const openCancelAllAppoimentsModal = (selectedDoctorId) => {
    console.log(selectedDoctorId);
    setCancelAllAppoinments(true);
  };

  const closeAddRescheduleModal = () => {
    setAddRescheduleModal(false);
  };

  const closeCancelAllAppoimentsModal = () => {
    setCancelAllAppoinments(false);
  };

  const closeCancelRescheduleModal = () => {
    setCancelRescheduleModal(false);
  };

  return (
    <div>
      <ScrollToTop />

      {/* Clinics List Starts Here */}
      <div className="flex items-center gap-1 flex-grow">
        <h5 className="mt-5 mb-4 text-xl font-bold text-dark dark:text-white-dark">
          Clinics:
        </h5>
      </div>
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
      {/* Clinics List Ends Here */}

      <div className="panel mt-5">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center  gap-1 mb-5 mt-5">
            <h5 className="font-semibold text-lg dark:text-white-light ">
              Appointments
            </h5>
            <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
              <CountUp
                start={0}
                end={totalAppointments}
                duration={3}
                redraw={true}
              ></CountUp>
            </span>
          </div>

          <div>
            <form className="mx-auto w-full mb-2">
              <div className="relative flex items-center flex-wrap gap-3 justify-between">
                <div>
                  <label
                    htmlFor="Date"
                    className="block text-gray-700 text-base dark:text-white-dark"
                  >
                    Select a date to view appointments
                  </label>
                </div>
                <div>
                  <input
                    id="Date"
                    type="date"
                    className="form-input form-input-green"
                    value={selectedDate || ""}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
            </form>
          </div>

          {allAppointments && totalAppointments > 0 ? (
            <div className="w-full  flex justify-end ">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:mt-5">
                <button
                  type="button"
                  className="btn btn-white text-green-600 border-green-600 md:text-sm sm:text-base max-w-60 md:w-72 lg:text-sm max-lg:text-base shadow-sm px-10 py-2 h-fit whitespace-nowrap"
                >
                  Reschedule Todays Appoinments
                </button>
                <button
                  type="button"
                  className="btn btn-green px-10 py-2 h-fit whitespace-nowrap"
                  onClick={() => openCancelAllAppoimentsModal(doctorId)}
                >
                  Cancel all Appoinments
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        {allAppointments && allAppointments.length > 0 ? (
          <>
            {loading ? (
              <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
            ) : (
              <div className="datatables">
                <DataTable
                  noRecordsText="Consultation not found"
                  noRecordsIcon={
                    <span className="mb-2">
                      <img src={emptyBox} alt="" className="w-10" />
                    </span>
                  }
                  mih={180}
                  highlightOnHover
                  className="whitespace-nowrap table-hover"
                  records={allAppointments}
                  idAccessor="booking_id"
                  onRowClick={(row) =>
                    navigate(`/patient-details/${row.booking_id}`)
                  }
                  columns={[
                    {
                      accessor: "booking_id",
                      title: "No.",
                      render: (row, rowIndex) => rowIndex + 1,
                    },
                    {
                      accessor: "Patient.name",
                      title: "Name",
                    },

                    {
                      accessor: "token",
                      title: "Token",
                    },

                    {
                      accessor: "Patient.phone",
                      title: "Phone",
                    },

                    {
                      accessor: "status",
                      title: "Status",
                    },
                    {
                      accessor: "schedule_date",
                      title: "Date",
                      render: (row) => formatDate(row?.schedule_date),
                    },
                    {
                      accessor: "schedule_time",
                      title: "Time",
                      render: (row) => formatTime(row?.schedule_time),
                    },

                    {
                      accessor: "actions",
                      title: "Actions",
                      textAlignment: "center",
                      render: (row) => (
                        <div className="dropdown grid place-items-center">
                          <Dropdown
                            placement="top-end"
                            btnClassName="bg-[#f4f4f4] dark:bg-[#1b2e4b] hover:bg-primary-light  w-8 h-8 rounded-full flex justify-center items-center"
                            button={
                              <IconHorizontalDots className="hover:text-primary rotate-90 opacity-70" />
                            }
                          >
                            <ul className="text-black dark:text-white-dark">
                              <li>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openAddRescheduleModal(row.booking_id)
                                  }
                                >
                                  Reschedule
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() =>
                                    openCancelRescheduleModal(row.booking_id)
                                  }
                                >
                                  Cancel
                                </button>
                              </li>
                            </ul>
                          </Dropdown>
                        </div>
                      ),
                    },
                  ]}
                  totalRecords={totalAppointments}
                  recordsPerPage={pageSize}
                  page={page}
                  onPageChange={(p) => setPage(p)}
                  recordsPerPageOptions={PAGE_SIZES}
                  onRecordsPerPageChange={setPageSize}
                  minHeight={200}
                  paginationText={({ from, to, totalRecords }) =>
                    `Showing  ${from} to ${to} of ${totalRecords} entries`
                  }
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-md text-gray-600 text-center mt-10">
            <span className="mb-2 flex justify-center">
              <img src={emptyBox} alt="" className="w-10" />
            </span>
            No Consultations Found
          </div>
        )}
      </div>

      <RescheduleModal
        addRescheduleModal={addRescheduleModal}
        closeAddRescheduleModal={closeAddRescheduleModal}
        bookingId={selectedBookingId}
        fetchAppointments={getallConsultation}
        clinicId={clinicId}
        doctorId={doctorId}
      />

      <CancelReschedule
        cancelRescheduleModal={cancelRescheduleModal}
        setCancelRescheduleModal={setCancelRescheduleModal}
        closeCancelRescheduleModal={closeCancelRescheduleModal}
        bookingId={selectedBookingId}
        fetchAppointments={getallConsultation}
      />

      <CancelReschedule
        cancelRescheduleModal={cancelAllAppoinments}
        closeCancelRescheduleModal={closeCancelAllAppoimentsModal}
        selectedDoctorId={doctorId}
        fetchAppointments={getallConsultation}
        cancelAll={true}
        clinicId={clinicId}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Appointments;

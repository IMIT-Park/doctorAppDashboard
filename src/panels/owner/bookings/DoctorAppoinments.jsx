import { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { useNavigate, useParams } from "react-router-dom";
import NetworkHandler, { websiteUrl } from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";
import CustomSwitch from "../../../components/CustomSwitch";
import { Tab } from "@headlessui/react";
import { DataTable } from "mantine-datatable";
import emptyBox from "/assets/images/empty-box.svg";
import CountUp from "react-countup";
import Dropdown from "../../../components/Dropdown";
import IconHorizontalDots from "../../../components/Icon/IconHorizontalDots";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import CancelReschedule from "../../clinic/profile/CancelReschedule";
import RescheduleModal from "../../clinic/profile/RescheduleModal";
import { UserContext } from "../../../contexts/UseContext";


const ClinicProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clinicId } = useParams();

  const userDetails = localStorage.getItem("userData");
  const userData = JSON.parse(userDetails);

  // const clinicId = userData?.UserClinic?.[0]?.clinic_id || 0;

  const ownerId = userDetails?.UserClinic?.[0]?.owner_id;

  const qrUrl = `${websiteUrl}clinic/${clinicId}`;
  const { doctorReportId, setDoctorReportId } = useContext(UserContext);

  useEffect(() => {
    dispatch(setPageTitle("Profile"));
  }, [dispatch]);

  const [loading, setLoading] = useState(true);
  const [currentClinicId, setCurrentClinicId] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [addRescheduleModal, setAddRescheduleModal] = useState(false);
  const [cancelRescheduleModal, setCancelRescheduleModal] = useState(false);
  const [cancelAllAppoinments, setCancelAllAppoinments] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");

  const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());


  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  useEffect(() => {
    console.log(clinicId);

    const fetchDoctors = async () => {
      try {
        const response = await NetworkHandler.makeGetRequest(
          `/v1/doctor/getDoctorbyId/${clinicId}`
        );
        if (response.status === 200) {
          setDoctors(response?.data?.doctors);
        } else {
          throw new Error("Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [clinicId]);

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    const selectedDoctorId = event.target.value;
    setSelectedDoctorId(selectedDoctorId);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const fetchAppointments = async () => {
    if (!selectedDoctor || !selectedDate) {
      return;
    }
    setAppointmentsLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/getallConsultation/${selectedDoctorId}`,
        {
          schedule_date: selectedDate,
          clinic_id: clinicId,
        }
      );
        console.log(response);
      if (response.status === 200) {
        setTotalAppointments(response.data?.Consultations?.count || 0);
        setAppointments(response?.data?.Consultations?.rows || []);
      } else if (response.status === 404) {
        setAppointmentsLoading(false);
        setTotalAppointments(0);
        setAppointments([]);
      } else {
        throw new Error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setTotalAppointments(0);
      setAppointments([]);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDoctorId, selectedDate]);

  const openAddRescheduleModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    console.log(bookingId);
    setAddRescheduleModal(true);
  };

  const closeAddRescheduleModal = () => {
    setAddRescheduleModal(false);
  };

  const openCancelRescheduleModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    console.log(bookingId);
    setCancelRescheduleModal(true);
  };

  const closeCancelRescheduleModal = () => {
    setCancelRescheduleModal(false);
  };

  const openCancelAllAppoimentsModal = (selectedDoctorId) => {
    setSelectedDoctorId(selectedDoctorId);
    console.log(selectedDoctorId);
    setCancelAllAppoinments(true);
  };

  const closeCancelAllAppoimentsModal = () => {
    setCancelAllAppoinments(false);
  };

  setCancelAllAppoinments;
 

  const handleRowClick = (bookingId) => {
    setDoctorReportId(selectedDoctorId);
    navigate(`/patient-details/${bookingId}`);
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        type="button"
        className="btn btn-green btn-sm -mt-4 mb-4"
      >
        <IconCaretDown className="w-4 h-4 rotate-90" />
      </button>

      <div className="panel mb-1">
        {/* {loading ? ( */}
        {/* <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" /> */}
        {/* ) : ( */}
        <>
          <h5 className="mt-8 mb-10 text-xl font-semibold text-dark dark:text-slate-400">
            Select a Doctor to View Appointments
          </h5>

          <div className="flex flex-col md:flex-row items-start justify-start gap-8">
            <div className="w-full md:w-96">
              <select
                id="ChooseDoctor"
                className="form-select text-white-dark bg-gray-200 rounded-full h-11 w-full capitalize"
                required
                onChange={handleDoctorChange}
              >
                <option value="">Select Doctors</option>
                {doctors?.map((doctor) => (
                  <option
                    key={doctor?.doctor_id}
                    value={doctor?.doctor_id}
                    className="capitalize"
                  >
                    {doctor?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto">
              <input
                id="Date"
                type="date"
                className="form-input form-input-green w-full md:w-auto min-w-52 pr-2"
                value={selectedDate}
                onChange={handleDateChange}
                placeholder="Select date"
              />
            </div>

            {/* <div className="w-full md:w-auto">
                <button
                  type="button"
                  className="btn btn-green btn-md mb-4 px-16 w-full md:w-auto whitespace-nowrap"
                >
                  Book Now
                </button>
              </div> */}
          </div>

          <Tab.Group>
            <Tab.List className="flex flex-wrap font-bold text-lg justify-between">
              <div className="flex gap-4 items-center ">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${
                        selected
                          ? "text-success !outline-none before:!w-full before:bg-success"
                          : "before:w-full before:bg-gray-100 dark:before:bg-gray-600"
                      } relative -mb-[1px] p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[2px] before:transition-all before:duration-700 hover:text-success mt-4`}
                    >
                      Patients Appointments{" "}
                      <span className="badge bg-[#006241] p-0.5 px-1 rounded-full ">
                        <CountUp
                          start={0}
                          end={totalAppointments}
                          duration={3}
                        />
                      </span>
                    </button>
                  )}
                </Tab>
              </div>
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
                  onClick={() => openCancelAllAppoimentsModal(selectedDoctorId)}
                >
                  Cancel all Appoinments
                </button>
              </div>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                {appointmentsLoading ? (
                  <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7  h-7 align-middle shrink-0 mt-4" />
                ) : (
                  <div className="datatables mt-8">
                    <DataTable
                      noRecordsText="No appointments to show"
                      noRecordsIcon={
                        <span className="mb-2">
                          <img src={emptyBox} alt="" className="w-10" />
                        </span>
                      }
                      mih={180}
                      highlightOnHover
                      className="whitespace-nowrap table-hover flex justify-evenly"
                      records={appointments}
                      idAccessor="booking_id"
                      onRowClick={(row) => handleRowClick(row.booking_id)}
                      columns={[
                        {
                          accessor: "No",
                          title: "No",
                          textAlignment: "center",
                          render: (row, rowIndex) => rowIndex + 1,
                        },
                        {
                          accessor: "Patient.name",
                          title: "Name",
                          textAlignment: "center",
                        },
                        {
                          accessor: "Patient.gender",
                          title: "Gender",
                          textAlignment: "center",
                        },
                        {
                          accessor: "schedule_time",
                          title: "Time",
                          textAlignment: "center",
                        },
                        {
                          accessor: "actions",
                          title: "Actions",
                          textAlignment: "center",
                          render: (row) => (
                            <div className="dropdown grid place-items-center">
                              <Dropdown
                                placement="middle"
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
                                        openCancelRescheduleModal(
                                          row.booking_id
                                        )
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
                        `Showing ${from} to ${to} of ${totalRecords} entries`
                      }
                    />
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
        {/* // )} */}
      </div>

      <RescheduleModal
        addRescheduleModal={addRescheduleModal}
        closeAddRescheduleModal={closeAddRescheduleModal}
        bookingId={selectedBookingId}
        fetchAppointments={fetchAppointments}
      />

      <CancelReschedule
        cancelRescheduleModal={cancelRescheduleModal}
        setCancelRescheduleModal={setCancelRescheduleModal}
        closeCancelRescheduleModal={closeCancelRescheduleModal}
        bookingId={selectedBookingId}
        fetchAppointments={fetchAppointments}
      />

      <CancelReschedule
        cancelRescheduleModal={cancelAllAppoinments}
        closeCancelRescheduleModal={closeCancelAllAppoimentsModal}
        selectedDoctorId={selectedDoctorId}
        fetchAppointments={fetchAppointments}
        cancelAll={true}
        clinicId={clinicId}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default ClinicProfile;

import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconEdit from "../../../components/Icon/IconEdit";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";
import NetworkHandler, {
  imageBaseUrl,
  websiteUrl,
} from "../../../utils/NetworkHandler";
import AddClinic from "../../owner/clinics/AddClinic";
import QRCodeComponent from "../../../components/QRCodeComponent";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import { showMessage } from "../../../utils/showMessage";
import { convertLocationDetail } from "../../../utils/getLocation";
import CustomSwitch from "../../../components/CustomSwitch";
import { Tab } from "@headlessui/react";
import { DataTable } from "mantine-datatable";
import emptyBox from "/assets/images/empty-box.svg";
import CountUp from "react-countup";
import Dropdown from "../../../components/Dropdown";
import IconHorizontalDots from "../../../components/Icon/IconHorizontalDots";
import IconSearch from "../../../components/Icon/IconSearch";
import IconCopy from "../../../components/Icon/IconCopy";
import RescheduleModal from "./RescheduleModal";
import CancelReschedule from "./CancelReschedule";

const ClinicProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = localStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic?.[0]?.clinic_id || 0;
  const ownerId = userDetails?.UserClinic?.[0]?.owner_id;

  const qrUrl = `${websiteUrl}clinic/${clinicId}`;

  useEffect(() => {
    dispatch(setPageTitle("Profile"));
  }, [dispatch]);

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [currentClinicId, setCurrentClinicId] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    place: "",
    password: "",
    confirmPassword: "",
    picture: null,
    defaultPicture: null,
    googleLocation: {},
  });

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [addRescheduleModal, setAddRescheduleModal] = useState(false);
  const [cancelRescheduleModal, setCancelRescheduleModal] = useState(false);
  const [cancelAllAppoinments,setCancelAllAppoinments] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setInput({
        picture: file,
        defaultPicture: URL.createObjectURL(file),
      });
    } else {
      setInput({ ...input, picture: null });
    }
  };

  const handleRemoveImage = () => {
    setInput({ ...input, picture: null });
  };

  const openEditModal = (clinic) => {
    const phoneWithoutCountryCode = clinic.phone.replace(/^\+91/, "");
    setInput({
      name: clinic.name,
      email: clinic.User.email,
      username: clinic.User.user_name,
      phone: phoneWithoutCountryCode,
      address: clinic.address,
      place: clinic.place,
      picture: null,
      googleLocation: convertLocationDetail(clinic.googleLocation),
      defaultPicture: imageBaseUrl + clinic?.banner_img_url || null,
    });
    setCurrentClinicId(clinic.clinic_id);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setInput({
      name: "",
      email: "",
      username: "",
      phone: "",
      address: "",
      place: "",
      picture: "",
      googleLocation: {},
    });
    setCurrentClinicId(null);
  };

  const updateClinic = async () => {
    if (!input.name || !input.phone || !input.address || !input.place) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    if (!input.googleLocation) {
      showMessage("Please select clinic location", "warning");
      return true;
    }

    setButtonLoading(true);

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("user_name", input.username);
    formData.append("phone", `+91${input.phone}`);
    formData.append("address", input.address);
    formData.append("place", input.place);
    formData.append("googleLocation", JSON.stringify(input.googleLocation));
    if (input.picture) {
      formData.append("image_url[]", input.picture);
    }

    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/clinic/edit/${currentClinicId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        showMessage("Clinic updated successfully", "success");
        fetchProfileData();
        closeEditModal();
      } else {
        throw new Error("Failed to update clinic");
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    } finally {
      setButtonLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getbyId/${clinicId}`
      );
      if (response?.status === 201) {
        setProfileData(response?.data?.Clinic);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch clinic data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
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

  setCancelAllAppoinments
  // block and unblock handler
  const { showAlert: showClinicAlert, loading: blockUnblockClinicLoading } =
    useBlockUnblock(fetchProfileData);

  return (
    <div>
      <div className="flex justify-end items-center">
        <ScrollToTop />
        <div className="flex items-center">
          {!loading && (
            <CustomSwitch
              checked={profileData?.User?.status}
              onChange={() =>
                showClinicAlert(
                  profileData?.User?.user_id,
                  profileData?.User?.status ? "block" : "activate",
                  "clinic"
                )
              }
              tooltipText={profileData?.User?.status ? "Block" : "Unblock"}
              uniqueId={`clinic${profileData?.clinic_id}`}
              size="large"
            />
          )}
        </div>
      </div>

      <div className="panel mb-1">
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            {profileData ? (
              <>
                <div className="relative flex flex-col xl:flex-row gap-3 xl:gap-3">
                  <div className="w-full xl:w-1/2 overflow-hidden flex flex-col items-center sm:mb-1 xl:mb-0">
                    <div className="w-full aspect-video xl:h-80 ">
                      <img
                        src={imageBaseUrl + profileData?.banner_img_url}
                        className="w-full h-full object-cover"
                        alt="Banner"
                      />
                    </div>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <div className="rounded-lg h-full mt-2 xl:-mt-3 flex flex-col justify-between">
                      <div className="">
                        <div className="text-2xl md:text-4xl text-green-800 font-semibold capitalize mb-4 flex sm:flex-col lg:flex-row justify-between">
                          <div className=" w-full flex items-start justify-between gap-2 mt-2 ">
                            {profileData?.name || ""}
                            <button
                              className="flex text-slate-500 hover:text-info"
                              onClick={() => openEditModal(profileData)}
                            >
                              <IconEdit className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col items-start">
                            <div className="text-base font-medium text-gray-500">
                              Address:
                            </div>
                            <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2 min-h-20">
                              {profileData?.address || ""}
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-start gap-5">
                            <div className="flex flex-col items-start w-full">
                              <div className="text-base font-medium text-gray-500 ">
                                Place:
                              </div>
                              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                                {profileData?.place || ""}
                              </div>
                            </div>
                            <div className="flex flex-col items-start w-full">
                              <div className="text-base font-medium text-gray-500">
                                Email:
                              </div>
                              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                                {profileData?.User?.email || ""}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-start gap-5">
                            <div className="flex flex-col items-start w-full">
                              <div className="text-base font-medium text-gray-500">
                                Username:
                              </div>
                              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                                {profileData?.User?.user_name || ""}
                              </div>
                            </div>
                            <div className="flex flex-col items-start w-full">
                              <div className="text-base font-medium text-gray-500">
                                Phone:
                              </div>
                              <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                                {profileData?.phone || ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <QRCodeComponent
                    qrUrl={qrUrl}
                    locationDetails={profileData?.googleLocation}
                    clinicId={clinicId}
                    ownerId={ownerId}
                    fetchClinicData={fetchProfileData}
                  />
                </div>
              </>
            ) : (
              <div className="h-52 grid place-items-center text-gray-500">
                No Data Found
              </div>
            )}

            <div className="border-t border-gray-300 dark:border-gray-800 flex-grow ml-2 mt-10"></div>
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
                        columns={[
                          {
                            accessor: "No",
                            title: "No", textAlignment: "center",
                            render: (row, rowIndex) => rowIndex + 1,
                          },
                          { accessor: "Patient.name", title: "Name" , textAlignment: "center",},
                          { accessor: "Patient.gender", title: "Gender", textAlignment: "center", },
                          { accessor: "schedule_time", title: "Time", textAlignment: "center", },
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
        )}
      </div>

      <AddClinic
        open={editModal}
        closeModal={closeEditModal}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        data={input}
        setData={setInput}
        handleSubmit={updateClinic}
        buttonLoading={buttonLoading}
        isEdit={true}
      />

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

import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../components/Icon/IconLoader";
import ScrollToTop from "../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconMenuScrumboard from "../../components/Icon/Menu/IconMenuScrumboard";
import AddDoctor from "./components/AddDoctor";
import NetworkHandler, {
  imageBaseUrl,
  websiteUrl,
} from "../../utils/NetworkHandler";
import IconMenuContacts from "../../components/Icon/Menu/IconMenuContacts";
import IconEdit from "../../components/Icon/IconEdit";
import AddClinic from "../../panels/owner/clinics/AddClinic";
import { formatDate } from "../../utils/formatDate";
import { showMessage } from "../../utils/showMessage";
import IconCaretDown from "../../components/Icon/IconCaretDown";
import {
  convertLocationDetail,
  handleGetLocation,
} from "../../utils/getLocation";
import useBlockUnblock from "../../utils/useBlockUnblock";
import QRCodeComponent from "../../components/QRCodeComponent";
import useFetchData from "../../customHooks/useFetchData";
import CustomSwitch from "../../components/CustomSwitch";
import { UserContext } from "../../contexts/UseContext";
import CustomButton from "../../components/CustomButton";
import ModalSubscription from "../../panels/owner/clinics/ModalSubscription";

const ClinicSingleView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { clinicId } = useParams();

  const { userDetails } = useContext(UserContext);
  const ownerId = userDetails?.UserOwner?.[0]?.owner_id;

  const isSuperAdmin = userDetails?.role_id === 1;

  const qrUrl = `${websiteUrl}clinic/${clinicId}`;

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [editModal, setEditModal] = useState(false);
  const [addDoctorModal, setaddDoctorModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [clinicInput, setClinicInput] = useState({
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
  const [activeTab, setActiveTab] = useState(1);
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
    photo: null,
    timeSlots: [],
    password: "",
    confirmPassword: "",
  });
  const [timeSlotInput, setTimeSlotInput] = useState({});
  const [subscriptionModal, setsubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  // fetch clinic data function
  const {
    data: clinicData,
    loading: detailsLoading,
    refetch: fetchClinicData,
  } = useFetchData(`/v1/clinic/getbyId/${clinicId}`, {}, [clinicId]);
  const clinicDetails = clinicData?.Clinic;

  // fetch doctors data function
  const {
    data: doctorData,
    loading: doctorLoading,
    refetch: fetchDoctorData,
  } = useFetchData(
    `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`,
    {},
    [clinicId, page, pageSize]
  );
  const totalDoctors = doctorData?.count || 0;
  const allDoctors = doctorData?.alldoctors || [];

  // doctor image picker
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInput({ ...input, photo: file });
  };

  // remove image function
  const handleRemoveImage = () => {
    setClinicInput({ ...clinicInput, picture: null });
  };

  // edit modal handler
  const openEditModal = () => {
    setClinicInput({
      name: clinicDetails.name,
      email: clinicDetails.User.email,
      username: clinicDetails.User.user_name,
      phone: clinicDetails.phone,
      address: clinicDetails.address,
      place: clinicDetails.place,
      picture: null,
      googleLocation: convertLocationDetail(clinicDetails?.googleLocation),
      defaultPicture: imageBaseUrl + clinicDetails?.banner_img_url || null,
    });
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  // edit clinic function
  const updateClinic = async () => {
    if (
      !clinicInput.name ||
      !clinicInput.email ||
      !clinicInput.username ||
      !clinicInput.phone ||
      !clinicInput.address ||
      !clinicInput.place ||
      !clinicInput.googleLocation
    ) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    setButtonLoading(true);

    const formData = new FormData();
    formData.append("name", clinicInput.name);
    formData.append("email", clinicInput.email);
    formData.append("user_name", clinicInput.username);
    formData.append("phone", clinicInput.phone);
    formData.append("address", clinicInput.address);
    formData.append("place", clinicInput.place);
    formData.append(
      "googleLocation",
      JSON.stringify(clinicInput.googleLocation)
    );
    if (clinicInput.picture) {
      formData.append("image_url[]", clinicInput.picture);
    }

    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/clinic/edit/${clinicId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        setButtonLoading(false);
        showMessage("Clinic updated successfully.", "success");
        fetchClinicData();
        closeEditModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // subscription modal handler
  const openSubscriptionModal = () => {
    setsubscriptionModal(true);
  };

  const closeSubscriptionModal = () => {
    setsubscriptionModal(false);
    setSelectedPlan(null);
  };

  const openAddDoctorModal = () => {
    setaddDoctorModal(true);
  };

  const closeAddDoctorModal = () => {
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
      photo: null,
      timeSlots: [],
      password: "",
      confirmPassword: "",
    });
    setActiveTab(1);
    setaddDoctorModal(false);
  };

  //  doctor adding function
  const addDoctor = async () => {
    if (
      !input.name ||
      !input.phone ||
      !input.email ||
      !input.address ||
      !input.gender ||
      !input.dateOfBirth ||
      !input.qualification ||
      !input.specialization ||
      !input.fees ||
      !input.photo ||
      !input.password ||
      !input.confirmPassword
    ) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    if (!input.timeSlots || input.timeSlots.length === 0) {
      showMessage("Please add at least one time slot", "warning");
      return true;
    }

    if (input.password !== input.confirmPassword) {
      showMessage("Passwords are not match", "warning");
      return true;
    }

    const basicDetails = {
      clinic_id: clinicId,
      name: input.name,
      email: input.email,
      address: input.address,
      phone: input.phone,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
      qualification: input.qualification,
      specialization: input.specialization,
      fees: input.fees,
      visibility: input.visibility,
      password: input.password,
    };

    const formData = new FormData();
    formData.append("image_url[]", input.photo);

    setButtonLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/doctor/createDoctor",
        basicDetails
      );

      if (response.status === 201) {
        const doctorId = response.data.Doctor.doctor_id;

        // Calling the add photo API
        const additionalResponse1 = await NetworkHandler.makePostRequest(
          `/v1/doctor/upload/${doctorId}`,
          formData
        );

        input.timeSlots.forEach((slot) => {
          slot.startTime += ":00";
          slot.endTime += ":00";
        });

        // Calling the add timeslot API
        const additionalResponse2 = await NetworkHandler.makePostRequest(
          `/v1/doctor/createtimeSlots/${doctorId}`,
          { timeslots: input.timeSlots }
        );

        fetchDoctorData();

        showMessage("Doctor added successfully.", "success");
        closeAddDoctorModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // block and unblock handler
  const { showAlert: showClinicAlert, loading: blockUnblockClinicLoading } =
    useBlockUnblock(fetchClinicData);
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
            <div className="flex justify-between flex-wrap">
              <div className="w-full max-w-96">
                <div className="rounded-md overflow-hidden">
                  <img
                    src={imageBaseUrl + clinicDetails?.banner_img_url}
                    className="w-full h-80 object-cover"
                    alt="Banner"
                  />
                </div>
                {/* <div className="text-2xl font-semibold capitalize mt-2 mb-4">
                  {clinicDetails?.name || ""}
                </div> */}
                {/* <QRCodeComponent qrUrl={qrUrl} /> */}
              </div>

              <div className="text-left mr-96">
                <div className="mt-5">
                  <div className="text-4xl text-green-800 font-semibold capitalize mt-2 mb-4">
                    {clinicDetails?.name || ""}
                  </div>
                  <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                    <div className="text-dark text-base min-w-[75px] flex items-start justify-between">
                      Address <span>:</span>
                    </div>
                    <div className="dark:text-slate-300 text-base">
                      {clinicDetails?.address || ""}
                    </div>
                  </div>
                  <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                    <div className="text-dark text-base min-w-[75px] flex items-start justify-between">
                      Place <span>:</span>
                    </div>
                    <div className="dark:text-slate-300 text-base">
                      {clinicDetails?.place || ""}
                    </div>
                  </div>
                  <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                    <div className="text-dark text-base min-w-[75px] flex items-start justify-between">
                      Email <span>:</span>
                    </div>
                    <div className="dark:text-slate-300 text-base">
                      {clinicDetails?.User?.email || ""}
                    </div>
                  </div>
                  <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                    <div className="text-dark text-base min-w-[75px] flex items-start justify-between">
                      Username <span>:</span>
                    </div>
                    <div className="dark:text-slate-300 text-base">
                      {clinicDetails?.User?.user_name || ""}
                    </div>
                  </div>
                  <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                    <div className="text-dark text-base min-w-[75px] flex items-start justify-between">
                      Phone <span>:</span>
                    </div>
                    <div className="dark:text-slate-300 text-base">
                      {clinicDetails?.phone || ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <CustomSwitch
                  checked={clinicDetails?.User?.status}
                  onChange={() =>
                    showClinicAlert(
                      clinicDetails?.User?.user_id,
                      clinicDetails?.User?.status ? "block" : "activate",
                      "clinic"
                    )
                  }
                  tooltipText={
                    clinicDetails?.User?.status ? "Block" : "Unblock"
                  }
                  uniqueId={`clinic${clinicDetails?.clinic_id}`}
                  size="large"
                />
                {!isSuperAdmin && (
                  <button
                    className="flex hover:text-info"
                    onClick={openEditModal}
                  >
                    <IconEdit className="w-6 h-6" />
                  </button>
                )}
              </div>

              <div className="mt-5">
                <div className="flex flex-row gap-3">
                  <QRCodeComponent qrUrl={qrUrl} />
                  <button
                    type="button"
                    onClick={() =>
                      handleGetLocation(clinicDetails?.googleLocation)
                    }
                    className="btn btn-success mb-1"
                  >
                    <IconMenuContacts className="mr-1 w-5" />
                    View Location
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mb-1"
                    onClick={openSubscriptionModal}
                  >
                    View Plan Details
                  </button>
                </div>
              </div>
            </div>
            {/* <div className="text-left">
              <div className="mt-5">
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Address <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {clinicDetails?.address || ""}
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Place <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {clinicDetails?.place || ""}
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Email <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {clinicDetails?.User?.email || ""}
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Username <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {clinicDetails?.User?.user_name || ""}
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Phone <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {clinicDetails?.phone || ""}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleGetLocation(clinicDetails?.googleLocation)
                  }
                  className="btn btn-success mt-5"
                >
                  <IconMenuContacts className="mr-1 w-5" />
                  View Location
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mt-5"
                  onClick={openSubscriptionModal}
                >
                  View Plan Details
                </button>
              </div>
            </div> */}
          </>
        )}
      </div>

      <div className="panel">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
              <CountUp start={0} end={totalDoctors} duration={3}></CountUp>
            </span>
          </div>

          <div className="flex items-right text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <CustomButton onClick={openAddDoctorModal}>
              <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
              Add Doctor
            </CustomButton>
          </div>
        </div>
        {doctorLoading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Doctors to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allDoctors}
              idAccessor="doctor_id"
              onRowClick={(row) =>
                navigate(`/clinics/${clinicId}/${row?.doctor_id}`, {
                  state: { previousUrl: location?.pathname },
                })
              }
              columns={[
                {
                  accessor: "doctor_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },

                {
                  accessor: "photo",
                  title: "Photo",
                  render: (row) =>
                    row?.photo ? (
                      <img
                        src={imageBaseUrl + row.photo}
                        alt="Doctor's photo"
                        className="w-10 h-10 rounded-[50%]"
                      />
                    ) : (
                      "---"
                    ),
                },
                {
                  accessor: "name",
                  title: "Name",
                },
                {
                  accessor: "email",
                  title: "Email",
                },

                { accessor: "phone" },
                {
                  accessor: "gender",
                  cellsStyle: { textTransform: "capitalize" },
                },
                {
                  accessor: "dateOfBirth",
                  title: "Date of Birth",
                  render: (row) => formatDate(row?.dateOfBirth),
                },
                { accessor: "qualification" },
                { accessor: "specialization" },
                {
                  accessor: "address",
                  title: "Address",
                  width: 220,
                  ellipsis: true,
                },
                { accessor: "fees" },
                {
                  accessor: "visibility",
                  title: "Visibility",
                  render: (row) => (row.visibility ? "Visible" : "Hidden"),
                },

                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <CustomSwitch
                      checked={rowData?.status}
                      onChange={() =>
                        showDoctorAlert(
                          rowData?.user_id,
                          rowData.status ? "block" : "activate",
                          "doctor"
                        )
                      }
                      tooltipText={rowData?.status ? "Block" : "Unblock"}
                      uniqueId={`doctor${rowData?.doctor_id}`}
                      size="normal"
                    />
                  ),
                },
              ]}
              totalRecords={totalDoctors}
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
      </div>

      {/* edit clinic modal */}
      <AddClinic
        open={editModal}
        closeModal={closeEditModal}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        data={clinicInput}
        setData={setClinicInput}
        handleSubmit={updateClinic}
        buttonLoading={buttonLoading}
        isEdit={true}
      />

      {/* subscription modal */}
      <ModalSubscription
        open={subscriptionModal}
        closeModal={closeSubscriptionModal}
        clinicId={clinicId}
        ownerId={ownerId}
        buttonLoading={buttonLoading}
        setButtonLoading={setButtonLoading}
        fetchClinicData={fetchClinicData}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />

      {/* add doctor modal */}
      <AddDoctor
        open={addDoctorModal}
        closeAddDoctorModal={closeAddDoctorModal}
        buttonLoading={buttonLoading}
        handleFileChange={handleFileChange}
        input={input}
        setInput={setInput}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clinicId={clinicId}
        timeSlotInput={timeSlotInput}
        setTimeSlotInput={setTimeSlotInput}
        formSubmit={addDoctor}
      />
    </div>
  );
};

export default ClinicSingleView;

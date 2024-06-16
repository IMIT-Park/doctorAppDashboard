import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
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
import { handleGetLocation } from "../../utils/getLocation";
import useBlockUnblock from "../../utils/useBlockUnblock";
import QRCodeComponent from "../../components/QRCodeComponent";
import useFetchData from "../../customHooks/useFetchData";

const ClinicSingleView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { clinicId } = useParams();
  const previousUrl = sessionStorage.getItem("clinicPreviousPage");
  const qrUrl = `${websiteUrl}${clinicId}`;

  useEffect(() => {
    if (location?.state?.previousUrl) {
      sessionStorage.setItem(
        "clinicPreviousPage",
        location?.state?.previousUrl
      );
    }
  }, [location?.state?.previousUrl]);

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
  const totalDoctors = doctorData?.Doctors?.count || 0;
  const allDoctors = doctorData?.Doctors?.rows || [];

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
      googleLocation: clinicDetails.googleLocation,
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
        onClick={() => navigate(previousUrl)}
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
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <div className="w-full max-w-96 rounded-md overflow-hidden">
                  <img
                    src={imageBaseUrl + clinicDetails?.banner_img_url}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                </div>
                <div className="text-2xl font-semibold capitalize mt-2">
                  {clinicDetails?.name || ""}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Tippy
                  content={clinicDetails?.User?.status ? "Block" : "Unblock"}
                >
                  <label
                    className="w-12 h-6 relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      showClinicAlert(
                        clinicDetails?.User?.user_id,
                        clinicDetails?.User?.status ? "block" : "activate",
                        "clinic"
                      );
                    }}
                  >
                    <input
                      type="checkbox"
                      className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                      id={`custom_switch_checkbox${clinicDetails?.clinic_id}`}
                      checked={clinicDetails?.User?.status}
                      readOnly
                    />
                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                  </label>
                </Tippy>
                <button
                  className="flex hover:text-info"
                  onClick={openEditModal}
                >
                  <IconEdit className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="text-left">
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
                <QRCodeComponent qrUrl={qrUrl} />
              </div>
            </div>
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
            <Tippy content="Click to Add Doctor">
              <button
                type="button"
                className="btn btn-green"
                onClick={openAddDoctorModal}
              >
                <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
                Add Doctor
              </button>
            </Tippy>
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
                { accessor: "phone" },
                { accessor: "gender" },
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
                    <Tippy content={rowData.status ? "Block" : "Unblock"}>
                      <label
                        className="w-[46px] h-[22px] relative"
                        disabled={blockUnblockDoctorLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          showDoctorAlert(
                            rowData?.user_id,
                            rowData?.status ? "block" : "activate",
                            "doctor"
                          );
                        }}
                      >
                        <input
                          type="checkbox"
                          className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                          id={`custom_switch_checkbox${rowData.doctor_id}`}
                          checked={rowData?.status}
                          readOnly
                        />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                      </label>
                    </Tippy>
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

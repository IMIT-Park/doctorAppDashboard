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
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCopy from "../../components/Icon/IconCopy";
import QRCode from "qrcode.react";
import IconDownload from "../../components/Icon/IconDownload";

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

  //QRCodeComponent
  const downloadQRCode = () => {
    const canvas = document.getElementById("qrcode-canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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

        <div className="flex items-center">
          {/* Your CustomSwitch component here */}
          <CustomSwitch
            checked={clinicDetails?.User?.status}
            onChange={() =>
              showClinicAlert(
                clinicDetails?.User?.user_id,
                clinicDetails?.User?.status ? "block" : "activate",
                "clinic"
              )
            }
            tooltipText={clinicDetails?.User?.status ? "Block" : "Unblock"}
            uniqueId={`clinic${clinicDetails?.clinic_id}`}
            size="large"
          />
        </div>
      </div>

      <div className="panel mb-1">
        {detailsLoading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="relative flex flex-col xl:flex-row md:gap-3 sm:gap-3 lg:gap-0 max-lg:gap-0">
              <div className="w-full xl:w-1/2 overflow-hidden flex flex-col items-center">
                <div className="w-full h-80">
                  <img
                    src={imageBaseUrl + clinicDetails?.banner_img_url}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                </div>
                <div className="w-full flex items-start gap-3 flex-wrap mt-3">
                  <div className="flex items-center gap-8 flex-wrap rounded mt-4 mb-5 w-full">
                    <form className="flex items-center w-full">
                      <input
                        type="text"
                        defaultValue={qrUrl}
                        className="form-input form-input-green rounded w-full"
                        readOnly
                      />
                      <div> 
                        <CopyToClipboard
                          text={qrUrl}
                          onCopy={(text, result) => {
                            if (result) {
                              showMessage("Copied Successfully");
                            }
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-green px-2 rounded lg:w-32 sm:w-24"
                          >
                            <IconCopy className="ltr:mr-2 rtl:ml-2" />
                            Copy
                          </button>
                        </CopyToClipboard>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-1/2">
                <div className="rounded-lg h-full -mt-5 flex flex-col justify-between">
                  <div className="p-4">
                    <div className="text-4xl text-green-800 font-semibold capitalize mb-4">
                      {clinicDetails?.name || ""}
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col items-start gap-2">
                        <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                          Address:
                        </div>
                        <input
                          type="text"
                          value={clinicDetails?.address || ""}
                          readOnly
                          className="text-base border bg-transparent rounded w-full p-3 focus:outline-none dark:border-none dark:bg-gray-800"
                        />
                      </div>

                      <div className="flex flex-col md:flex-row items-start gap-10">
                        <div className="flex flex-col items-start w-full md:w-1/2">
                          <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                            Place:
                          </div>
                          <input
                            type="text"
                            value={clinicDetails?.place || ""}
                            readOnly
                            className="text-base border bg-transparent rounded p-2 w-full focus:outline-none dark:border-none dark:bg-gray-800"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full md:w-1/2">
                          <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                            Email:
                          </div>
                          <input
                            type="text"
                            value={clinicDetails?.User?.email || ""}
                            readOnly
                            className="text-base border bg-transparent rounded p-2 w-full focus:outline-none dark:border-none dark:bg-gray-800"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start gap-10">
                        <div className="flex flex-col items-start w-full md:w-1/2">
                          <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                            Username:
                          </div>
                          <input
                            type="text"
                            value={clinicDetails?.User?.user_name || ""}
                            readOnly
                            className="text-base border bg-transparent rounded p-2 w-full focus:outline-none dark:border-none dark:bg-gray-800"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full md:w-1/2">
                          <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                            Phone:
                          </div>
                          <input
                            type="text"
                            value={clinicDetails?.phone || ""}
                            readOnly
                            className="text-base border bg-transparent rounded p-2 w-full focus:outline-none dark:border-none dark:bg-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isSuperAdmin && (
                    <button
                      className="flex hover:text-info p-4"
                      onClick={openEditModal}
                    >
                      <IconEdit className="w-6 h-6" />
                    </button>
                  )}
                  <div className="flex flex-col md:flex-row px-2 gap-3 mt-4.5">
                    <QRCode
                      id="qrcode-canvas"
                      value={qrUrl}
                      size={220}
                      style={{ display: "none"}}
                    />
                    <button
                      type="button"
                      className="btn btn-green w-full md:w-72 lg:text-sm max-lg:text-base md:text-sm sm:text-base mb-2 md:mb-0 md:px-2 sm:px-2 lg:px-0"
                      onClick={downloadQRCode}
                    >
                      <IconDownload className="md:mr-2 lg:mr-1" />
                      Download QRcode
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleGetLocation(clinicDetails?.googleLocation)
                      }
                      className="btn btn-green flex items-center gap-1 w-full md:w-72 md:text-sm lg:text-sm max-lg:text-base sm:text-base mb-2 md:mb-0 md:px-2 sm:px-2 lg:px-0"
                    >
                      <IconMenuContacts className="md:mr-2 lg:mr-0" />
                      View Location
                    </button>
                    <button
                      type="button"
                      className="btn btn-white text-green-600 border-green-600 w-full md:text-sm sm:text-base md:w-72 lg:text-sm max-lg:text-base shadow-sm md:px-2 sm:px-2 lg:px-0"
                      onClick={openSubscriptionModal}
                    >
                      View Plan Details
                    </button>
                  </div>
                </div>
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

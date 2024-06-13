import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../../components/Icon/IconLoader";
import ScrollToTop from "../../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import IconMenuScrumboard from "../../../../components/Icon/Menu/IconMenuScrumboard";
import AddDoctor from "./AddDoctor";
import NetworkHandler, {
  imageBaseUrl,
  websiteUrl,
} from "../../../../utils/NetworkHandler";
import IconMenuContacts from "../../../../components/Icon/Menu/IconMenuContacts";
import IconDownload from "../../../../components/Icon/IconDownload";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCopy from "../../../../components/Icon/IconCopy";
import IconEdit from "../../../../components/Icon/IconEdit";
import AddClinic from "../AddClinic";
import { formatDate } from "../../../../utils/formatDate";
import { showMessage } from "../../../../utils/showMessage";

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { clinicId } = useParams();

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addDoctorModal, setaddDoctorModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [clinicDetails, setClinicDetails] = useState({});
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

  const qrUrl = `${websiteUrl}${clinicId}`;
  // Qr downloader
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

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

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

  // doctor image picker
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInput({ ...input, photo: file });
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

  // fetch clinic details function
  const fetchClinicData = async () => {
    setDetailsLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getbyId/${clinicId}`
      );
      setClinicDetails(response?.data?.Clinic);
      setDetailsLoading(false);
    } catch (error) {
      console.log(error);
      setDetailsLoading(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // fetch clinic details
  useEffect(() => {
    fetchClinicData();
  }, []);

  // fetch doctors function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
      );
      setTotalDoctors(response?.data?.Doctors?.count);
      setAllDoctors(response?.data?.Doctors?.rows);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching doctors
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  //  block or unblock handler
  const handleActiveUser = async (userId) => {
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/auth/activate/${userId}`
      );
      fetchClinicData();
      fetchData();
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    }
  };

  const showClinicBlockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to block this Clinic!",
      showCancelButton: true,
      confirmButtonText: "Block",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleActiveUser(id);
        Swal.fire({
          title: "Blocked!",
          text: "The Clinic has been blocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  const showClinicUnblockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to unblock this Clinic!",
      showCancelButton: true,
      confirmButtonText: "Unblock",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleActiveUser(id);
        Swal.fire({
          title: "Unblocked!",
          text: "The Clinic has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
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

      console.log(response);

      if (response.status === 201) {
        const doctorId = response.data.Doctor.doctor_id;

        const additionalResponse1 = await NetworkHandler.makePostRequest(
          `/v1/doctor/upload/${doctorId}`,
          formData
        );

        console.log(additionalResponse1);

        input.timeSlots.forEach((slot) => {
          slot.startTime += ":00";
          slot.endTime += ":00";
        });

        // Call the second additional API
        const additionalResponse2 = await NetworkHandler.makePostRequest(
          `/v1/doctor/createtimeSlots/${doctorId}`,
          { timeslots: input.timeSlots }
        );

        console.log(additionalResponse2);

        fetchData();

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

  // Function to handle "Get Location" button click
  const handleGetLocation = () => {
    const googleLocation = clinicDetails.googleLocation;

    if (!googleLocation) {
      showMessage("Location information is not available", "error");
      return;
    }

    try {
      const decodedLocation = googleLocation.replace(/\\/g, "");

      const cleanedGoogleLocation =
        decodedLocation.startsWith('"') && decodedLocation.endsWith('"')
          ? decodedLocation.slice(1, -1)
          : decodedLocation;

      const locationData = JSON.parse(cleanedGoogleLocation);

      const cleanedLocationData = {};
      Object.keys(locationData).forEach((key) => {
        const trimmedKey = key.trim();
        cleanedLocationData[trimmedKey] = locationData[key];
      });

      const { lat, long } = cleanedLocationData;

      if (lat && long) {
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${long}`;
        window.open(googleMapsUrl, "_blank");
      } else {
        showMessage("Invalid location data", "error");
      }
    } catch (error) {
      console.error("Failed to parse location data", error);
      showMessage("Invalid location data", "error");
    }
  };

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
            <span>Doctors</span>
          </li>
        </ul>
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-start gap-1">
            <h5 className="text-base font-semibold dark:text-white-light">
              Active
            </h5>
            <label className="w-11 h-5 relative">
              <input
                type="checkbox"
                className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                id="custom_switch_checkbox_active"
                checked
                readOnly
              />
              <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
            </label>
          </div>
          <div className="flex items-start gap-1">
            <h5 className="text-base font-semibold dark:text-white-light">
              Blocked
            </h5>
            <label className="w-11 h-5 relative">
              <input
                type="checkbox"
                className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                id="custom_switch_checkbox_active"
                checked={false}
                readOnly
              />
              <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="panel mb-1">
        {detailsLoading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <div className="text-2xl font-semibold capitalize">
                  {clinicDetails?.name || ""}
                </div>
                <div className="w-full max-w-96 rounded-md overflow-hidden mt-4">
                  <img
                    src={imageBaseUrl + clinicDetails?.banner_img_url}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <label
                  className="w-12 h-6 relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (clinicDetails?.User?.status) {
                      showClinicBlockAlert(clinicDetails?.user_id);
                    } else {
                      showClinicUnblockAlert(clinicDetails?.user_id);
                    }
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
                <button
                  className="flex hover:text-info"
                  onClick={openEditModal}
                >
                  <IconEdit className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="text-left sm:px-4">
              <div className="mt-5">
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Address :</div>
                  <div>{clinicDetails?.address || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Place :</div>
                  <div>{clinicDetails?.place || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Email :</div>
                  <div>{clinicDetails?.User?.email || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark">Username :</div>
                  <div>{clinicDetails?.User?.user_name || ""}</div>
                </div>
                <div className="flex items-center sm:gap-2 flex-wrap">
                  <div className="text-white-dark">Phone :</div>
                  <div>{clinicDetails?.phone || ""}</div>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="btn btn-success mt-2"
                >
                  <IconMenuContacts className="mr-1 w-5" />
                  Get Location
                </button>
                <div className="w-full flex items-start gap-3 flex-wrap mt-5">
                  <div className="flex flex-col items-center bg-[#f1f2f3] dark:bg-[#060818] rounded p-2">
                    <QRCode id="qrcode-canvas" value={qrUrl} size={220} />
                    <button
                      type="button"
                      className="mt-2 btn btn-primary w-fit"
                      onClick={downloadQRCode}
                    >
                      <IconDownload className="mr-2" />
                      Download
                    </button>
                  </div>

                  <div className="bg-[#f1f2f3] p-2 rounded dark:bg-[#060818] w-full max-w-80">
                    <form>
                      <input
                        type="text"
                        defaultValue={qrUrl}
                        className="form-input"
                        readOnly
                      />
                      <div className="mt-1">
                        <CopyToClipboard
                          text={qrUrl}
                          onCopy={(text, result) => {
                            if (result) {
                              showMessage("Copied Successfullly");
                            }
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-primary px-2 ml-auto"
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
                className="btn btn-primary"
                onClick={openAddDoctorModal}
              >
                <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
                Add Doctor
              </button>
            </Tippy>
          </div>
        </div>
        {loading ? (
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
                navigate(`/owner/clinics/${clinicId}/doctors/${row?.doctor_id}`)
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
                    <Tippy content="Block/Unblock">
                      <label
                        className="w-[46px] h-[22px] relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (rowData?.status) {
                            showDoctorBlockAlert(rowData?.user_id);
                          } else {
                            showDoctorUnblockAlert(rowData?.user_id);
                          }
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

export default Doctors;

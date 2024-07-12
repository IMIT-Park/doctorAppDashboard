import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconEdit from "../../../components/Icon/IconEdit";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";
import NetworkHandler, {
  imageBaseUrl,
  websiteUrl,
} from "../../../utils/NetworkHandler";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";
import AddClinic from "../../owner/clinics/AddClinic";
import QRCodeComponent from "../../../components/QRCodeComponent";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import { showMessage } from "../../../utils/showMessage";
import {
  convertLocationDetail,
  handleGetLocation,
} from "../../../utils/getLocation";
import CustomSwitch from "../../../components/CustomSwitch";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCopy from "../../../components/Icon/IconCopy";
import QRCode from "qrcode.react";
import IconDownload from "../../../components/Icon/IconDownload";
import { Tab } from "@headlessui/react";
import { DataTable } from "mantine-datatable";
import emptyBox from "/assets/images/empty-box.svg";


const ClinicProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic?.[0]?.clinic_id || 0;

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
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);

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
    setInput({
      name: clinic.name,
      email: clinic.User.email,
      username: clinic.User.user_name,
      phone: clinic.phone,
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
    if (
      !input.name ||
      !input.email ||
      !input.username ||
      !input.phone ||
      !input.address ||
      !input.place ||
      !input.googleLocation
    ) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    setButtonLoading(true);

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("user_name", input.username);
    formData.append("phone", input.phone);
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
            setDoctors(response.data.doctors);
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
    };
  
    const handleDateChange = (event) => {
      setSelectedDate(event.target.value);
    };

    const fetchAppointments = async () => {
      if (!selectedDoctor || !selectedDate) {
        return;
      }
      try {
        const response = await NetworkHandler.makePostRequest(
          `/v1/booking/getdoctordate/${selectedDoctor}`,
          {
            date: selectedDate,
            clinic_id: clinicId,
          }
        );
        if (response.status === 200) {
          setAppointments(response.data.appointments);
        } else {
          throw new Error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
  
    useEffect(() => {
      fetchAppointments();
    }, [selectedDoctor, selectedDate]);
  
  

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
        </div>
      </div>

      <div className="panel mb-1">
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            {profileData ? (
              <>
                <div className="relative flex flex-col xl:flex-row md:gap-3 sm:gap-3 lg:gap-0 max-lg:gap-0">
                  <div className="w-full xl:w-1/2 overflow-hidden flex flex-col items-center">
                    <div className="w-full aspect-video xl:h-80 ">
                      <img
                        src={imageBaseUrl + profileData?.banner_img_url}
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
                        <div className="text-4xl text-green-800 font-semibold capitalize mb-4 flex flex-row justify-between">
                          {profileData?.name || ""}

                          <button
                            className="flex hover:text-info p-4"
                            onClick={() => openEditModal(profileData)}
                          >
                            <IconEdit className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col items-start gap-2">
                            <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                              Address <span>:</span>
                            </div>

                            <input
                              type="text"
                              value={profileData?.address || ""}
                              readOnly
                              className="text-base border bg-transparent rounded w-full p-3 focus:outline-none dark:border-none dark:bg-gray-800"
                            />
                          </div>

                          <div className="flex flex-col md:flex-row items-start gap-10">
                            <div className="flex flex-col items-start w-full md:w-1/2">
                              <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                                Place <span>:</span>
                              </div>

                              <input
                                type="text"
                                value={profileData?.place || ""}
                                readOnly
                                className="text-base border bg-transparent rounded p-2 w-full focus:outline-none dark:border-none dark:bg-gray-800"
                              />
                            </div>

                            <div className="flex flex-col items-start w-full md:w-1/2">
                              <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                                Email <span>:</span>
                              </div>

                              <input
                                type="text"
                                value={profileData?.User?.email || ""}
                                readOnly
                                className="text-base border bg-transparent rounded p-2 w-full focus:outline-none dark:border-none dark:bg-gray-800"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-start gap-10">
                            <div className="flex flex-col items-start w-full md:w-1/2">
                              <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                                Username :
                              </div>

                              <input
                                type="text"
                                value={profileData?.User?.user_name || ""}
                                readOnly
                                className="text-base border bg-transparent rounded p-2 w-full focus:outline-none dark:border-none dark:bg-gray-800"
                              />
                            </div>

                            <div className="flex flex-col items-start w-full md:w-1/2">
                              <div className="text-base font-medium text-[#AAAAAA] min-w-[75px]">
                                Phone :
                              </div>
                              <input
                                type="text"
                                value={profileData?.phone || ""}
                                readOnly
                                className="text-base border bg-transparent rounded p-2 w-full focus:outline-none dark:border-none dark:bg-gray-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row px-2 gap-3 mt-4.5">
                        <QRCode
                          id="qrcode-canvas"
                          value={qrUrl}
                          size={220}
                          style={{ display: "none" }}
                        />
                        <button
                          type="button"
                          className="btn btn-green w-full md:w-72 lg:text-sm max-lg:text-base md:text-sm sm:text-base mb-2 md:mb-0 md:px-2 sm:px-2 lg:px-0 whitespace-nowrap"
                          // onClick={downloadQRCode}
                        >
                          <IconDownload className="md:mr-2 lg:mr-1" />
                          Download QRcode
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleGetLocation(profileData?.googleLocation)
                          }
                          className="btn btn-green flex items-center gap-1 w-full md:w-72 md:text-sm lg:text-sm max-lg:text-base sm:text-base mb-2 md:mb-0 md:px-2 sm:px-2 lg:px-0"
                        >
                          <IconMenuContacts className="md:mr-2 lg:mr-0" />
                          View Location
                        </button>
                        <button
                          type="button"
                          className="btn btn-white text-green-600 border-green-600 w-full md:text-sm sm:text-base md:w-72 lg:text-sm max-lg:text-base shadow-sm md:px-2 sm:px-2 lg:px-0"
                          // onClick={openSubscriptionModal}
                        >
                          View Plan Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-52 grid place-items-center text-gray-500">
                No Data Found
              </div>
            )}
          </>
        )}

        <div className="border-t border-gray-300 dark:border-gray-600 flex-grow ml-2 mt-8"></div>
        <h5 className="mt-8 mb-10 text-xl font-bold text-dark dark:text-white-dark">
          Select a Doctors to View Appointments
        </h5>

        <div className="mb-8 flex flex-col md:flex-row items-start justify-start gap-8">
          <div className="w-full md:w-96">
            <select
              id="ChooseDoctor"
              className="form-select text-white-dark bg-gray-200 rounded-full h-11 w-full"
              required
              onChange={handleDoctorChange}
            >
              <option value="">Select Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.doctor_id} value={doctor.doctor_id}>
                  {doctor.name}
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

          <div className="w-full md:w-auto">
            <button
              type="button"
              className="btn btn-green btn-md mb-4 px-16 w-full md:w-auto whitespace-nowrap"
            >
              Book Now
            </button>
          </div>
        </div>

        <Tab.Group>
          <Tab.List className="mt-3 flex flex-wrap font-bold text-lg">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${
                    selected
                      ? "text-success !outline-none before:!w-full before:bg-success"
                      : "before:w-full before:bg-gray-100 dark:before:bg-gray-600"
                  } relative -mb-[1px] p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[2px] before:transition-all before:duration-700 hover:text-success mt-5`}
                >
                  Patients Appointments (20)
                </button>
              )}
            </Tab>
          </Tab.List>
        </Tab.Group>

        <div className="datatables mt-8">
            <DataTable
              noRecordsText="No Patients to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              // records={}
              // idAccessor="doctor_id"
              // onRowClick={(row) =>
              //   navigate(`/clinics/${clinicId}/${row?.doctor_id}`, {
              //     state: { previousUrl: location?.pathname },
              //   })
              // }
              columns={[
                {
                  accessor: "No",
                  title: "No",
                  // render: (row, rowIndex) => rowIndex + 1,
                },

              

                { accessor: "name", title: "Name" },
                { accessor: "phone", title: "Time" },
                { accessor: "gender", title: "Gender" },
              
               
                {
                  accessor: "TokenNumber",
                  title: "Token Number",
                  // render: (row) => (row.visibility ? "Visible" : "Hidden"),
                },
               
              ]}
             
            />
          </div>
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
    </div>
  );
};

export default ClinicProfile;

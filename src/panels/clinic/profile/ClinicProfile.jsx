import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Swal from "sweetalert2";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconEdit from "../../../components/Icon/IconEdit";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { Link, useNavigate } from "react-router-dom"; // Ensure useNavigate is imported
import NetworkHandler, {
  imageBaseUrl,
  websiteUrl,
} from "../../../utils/NetworkHandler";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";
import IconDownload from "../../../components/Icon/IconDownload";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCopy from "../../../components/Icon/IconCopy";
import IconPlus from "../../../components/Icon/IconPlus";
import AddClinic from "../../owner/clinics/AddClinic";

const ClinicProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    dispatch(setPageTitle("Profile"));
  }, [dispatch]);

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic?.[0]?.clinic_id || 0;
  console.log(clinicId);

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [currentClinicId, setCurrentClinicId] = useState("");
  const [buttonLoading,setButtonLoading] = useState(false)

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
      // picture: clinic.banner_img_url,
      googleLocation: JSON.parse(clinic.googleLocation),
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
console.log(response);
      if (response.status === 200) {
        showMessage("Clinic updated successfully", "success");
        fetchProfileData();
        closeEditModal();
      } else {
        throw new Error("Failed to update clinic");
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      // console.error("Update clinic error:", error);
    } finally {
      setButtonLoading(false);
    }
  };


  const fetchProfileData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getbyId/${clinicId}`
      );
      if (
        response &&
        response.data &&
        response.data.message === "Success" &&
        response.data.Clinic
      ) {
        setProfileData(response.data.Clinic);
        // setTotalDoctors(response.data.Clinic.doctors.length);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch clinic data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Function to handle "Get Location" button click
  const handleGetLocation = () => {
    const googleLocation = profileData.googleLocation;
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

  const showMessage = (msg = "", type = "success") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

  //  block or unblock handler
  const handleActiveUser = async (userId) => {
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/auth/activate/${userId}`
      );
      fetchProfileData();
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    }
  };
  const showBlockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to block this Owner!",
      showCancelButton: true,
      confirmButtonText: "Block",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleActiveUser(id);
        Swal.fire({
          title: "Blocked!",
          text: "The Owner has been blocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };
  const showUnblockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to unblock this Owner!",
      showCancelButton: true,
      confirmButtonText: "Unblock",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleActiveUser(id);
        Swal.fire({
          title: "Unblocked!",
          text: "The Owner has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  console.log(profileData);

  return (
    <div>
      <ScrollToTop />

      <div className="panel">
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="profile-details">
            <div className="profile-section">
              <div className="flex justify-between flex-wrap gap-4 sm:px-4">
                <div className="text-2xl font-semibold capitalize">
                  {profileData?.name || ""}
                </div>
                <label
                  className="w-12 h-6 relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (profileData?.User?.status) {
                      showBlockAlert(profileData?.user_id);
                    } else {
                      showUnblockAlert(profileData?.user_id);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                    id={`custom_switch_checkbox${profileData?.user_id}`}
                    checked={profileData?.User?.status}
                    readOnly
                  />
                  <span className="bg-[#EBEDF2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                </label>
              </div>

              <div className="flex items-start justify-end gap-2 flex-wrap m-4">
                {/* Edit Button */}
                <Tippy content="Edit">
                  <button onClick={() => openEditModal(profileData)}>
                    <IconEdit className="mr-1 w-8" />
                  </button>
                </Tippy>
              </div>

              <div className="section-content" style={{ marginTop: "10px" }}>
  <div className="flex flex-col md:flex-row gap-4">
    <div className="profile-section p-2 w-full md:w-1/2">
      <div className="section-content">
        <img
          src={imageBaseUrl + profileData?.banner_img_url}
          alt="Banner"
          className="w-full max-w-[400px]"
        />
      </div>
    </div>
   <div className="profile-section p-2 w-full md:w-1/2">
  <div className="section-content mt-5">
    <p className="p-2">
      <strong className="min-w-[105px] inline-block text-white-dark">Name</strong>  <span className="mx-2">:</span> <span className="dark:text-slate-300"> {profileData?.name}</span>
    </p>
    <p className="p-2">
      <strong className="min-w-[105px] inline-block text-white-dark">Email</strong> <span className="mx-2">:</span> <span className="dark:text-slate-300">{profileData?.email}</span>
    </p>
    <p className="p-2">
      <strong className="min-w-[105px] inline-block text-white-dark">Phone</strong> <span className="mx-2">:</span> <span className="dark:text-slate-300">{profileData?.phone}</span>
    </p>
    <p className="p-2">
      <strong className="min-w-[105px] inline-block text-white-dark">Address</strong> <span className="mx-2">:</span> <span className="dark:text-slate-300">{profileData?.address}</span>
    </p>
    <p className="p-2">
      <strong className="min-w-[105px] inline-block text-white-dark">Place</strong>  <span className="mx-2">:</span> <span className="dark:text-slate-300">{profileData?.place}</span>
    </p>
    <p>
      {/* <strong>Owner:</strong> {profileData?.User?.user_name} */}
    </p>
  </div>
</div>

  </div>
</div>

            </div>
          
            <div className="profile-section p-2">
              <button
                type="button"
                onClick={handleGetLocation}
                className="btn btn-success mt-2"
              >
                <IconMenuContacts className="mr-1 w-5" />
                Get Location
              </button>
            </div>
            <div className="w-full flex items-start gap-3 flex-wrap mt-5">
              <div className="flex flex-col items-center bg-[#F1F2F3] dark:bg-[#060818] rounded p-2">
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
              <div className="bg-[#F1F2F3] p-2 rounded dark:bg-[#060818] w-full max-w-80">
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
            {/* <div className="profile-section">
              <div className="section-content">
                <div className="doctor-item">
                  <Tippy content="Block/Unblock">
                    <label
                      className="w-[46px] h-[22px] relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (doctor?.status) {
                          showBlockAlert(doctor?.user_id);
                        } else {
                          showUnblockAlert(doctor?.user_id);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                        //   id={`custom_switch_checkbox${doctor?.doctor_id}`}
                        //   checked={doctor?.status}
                        readOnly
                      />
                      <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                  </Tippy>
                </div>
              </div>
            </div> */}
          </div>
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
    </div>
  );
};

export default ClinicProfile;

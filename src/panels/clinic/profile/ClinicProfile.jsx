import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Swal from "sweetalert2";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { Link, useNavigate } from "react-router-dom"; // Ensure useNavigate is imported
import NetworkHandler, { imageBaseUrl, websiteUrl } from "../../../utils/NetworkHandler";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";
import IconDownload from "../../../components/Icon/IconDownload";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCopy from "../../../components/Icon/IconCopy";

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
        setTotalDoctors(response.data.Clinic.doctors ? response.data.Clinic.doctors.length : 0);
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

  // Block or unblock handler
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
      <div className="flex items-start justify-end gap-2 flex-wrap mb-1">
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
              <div className="section-content" style={{ marginTop: "10px" }}>
                <p className="p-2">
                  <strong>Name:</strong> {profileData?.name}
                </p>
                <p className="p-2">
                  <strong>Email:</strong> {profileData?.email}
                </p>
                <p className="p-2">
                  <strong>Phone:</strong> {profileData?.phone}
                </p>
                <p className="p-2">
                  <strong>Address:</strong> {profileData?.address}
                </p>
                <p className="p-2">
                  <strong>Place:</strong> {profileData?.place}
                </p>
                <p>
                  {/* <strong>Owner:</strong> {profileData?.User?.user_name} */}
                </p>
              </div>
            </div>
            <div className="profile-section p-2">
              <div className="section-content">
                <img
                  src={imageBaseUrl + profileData?.banner_img_url}
                  alt="Banner"
                  className="w-full max-w-[400px]"
                />
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
                          showMessage("Copied Successfully");
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
        )}
      </div>
    </div>
  );
};

export default ClinicProfile;

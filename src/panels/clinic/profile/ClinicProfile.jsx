import { useEffect, useState } from "react";
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
import { handleGetLocation } from "../../../utils/getLocation";

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
  const [profileData, setProfileData] = useState({});
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
        setProfileData(response.data.Clinic);
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

  // block and unblock handler
  const { showAlert: showClinicAlert, loading: blockUnblockClinicLoading } =
    useBlockUnblock(fetchProfileData);

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <div className="w-full max-w-96 rounded-md overflow-hidden">
                  <img
                    src={imageBaseUrl + profileData?.banner_img_url}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                </div>
                <div className="text-2xl font-semibold capitalize mt-2">
                  {profileData?.name || ""}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Tippy
                  content={profileData?.User?.status ? "Block" : "Unblock"}
                >
                  <label
                    className="w-12 h-6 relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      showClinicAlert(
                        profileData?.User?.user_id,
                        profileData?.User?.status ? "block" : "activate",
                        "clinic"
                      );
                    }}
                  >
                    <input
                      type="checkbox"
                      className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                      id={`custom_switch_checkbox${profileData?.clinic_id}`}
                      checked={profileData?.User?.status}
                      readOnly
                    />
                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                  </label>
                </Tippy>
                <button
                  className="flex hover:text-info"
                  onClick={() => openEditModal(profileData)}
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
                    {profileData?.address || ""}
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Place <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {profileData?.place || ""}
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Email <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {profileData?.User?.email || ""}
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Username <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {profileData?.User?.user_name || ""}
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2">
                  <div className="text-white-dark min-w-[75px] flex items-start justify-between">
                    Phone <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {profileData?.phone || ""}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleGetLocation(profileData?.googleLocation)}
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

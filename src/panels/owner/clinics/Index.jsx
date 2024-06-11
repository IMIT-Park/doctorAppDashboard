import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconEdit from "../../../components/Icon/IconEdit";
import Swal from "sweetalert2";
import IconPlus from "../../../components/Icon/IconPlus";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate } from "react-router-dom";
import AddClinic from "./AddClinic";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";

const Clinics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const ownerId = userData?.UserOwner?.[0]?.owner_id || 0;

  useEffect(() => {
    dispatch(setPageTitle("Clinics"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [allClinics, setAllClinics] = useState([]);
  const [totalClinics, setTotalClinics] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentClinicId, setCurrentClinicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState({});
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
        ...input,
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

  // fetch function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getallclinics/${ownerId}?page=${page}&pagesize=${pageSize}`
      );
      setTotalClinics(response.data?.Clinic?.count);
      setAllClinics(response.data?.Clinic?.rows);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // fetching Mds
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);
  // handle add modal
  const openAddModal = () => {
    setAddModal(true);
  };

  const closeAddModal = () => {
    setAddModal(false);
    setInput({
      ...input,
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      place: "",
      banner_img_url: "",
      googleLocation: "",
    });
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

  const handleGetLocation = (googleLocation) => {
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
  const showMessage = (msg = "", type = "success") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      showCloseButton: true,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

  // Function to create a new clinic
  const createClinic = async () => {
    if (
      !input.name ||
      !input.email ||
      !input.username ||
      !input.phone ||
      !input.address ||
      !input.place ||
      !input.password ||
      !input.picture ||
      !input.googleLocation ||
      !input.confirmPassword
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
    formData.append("password", input.password);
    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/clinic/createClinic",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 201) {
        setButtonLoading(false);
        showMessage("Clinic added successfully.", "success");
        fetchData();
        closeAddModal();
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        showMessage("User Already Exist.", "error");
      } else {
        showMessage("An error occurred. Please try again.", "error");
      }
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
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
        setButtonLoading(false);
        showMessage("Clinic updated successfully.", "success");
        fetchData();
        closeEditModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  //  block or unblock handler
  const handleActiveUser = async (userId) => {
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/auth/activate/${userId}`
      );
      fetchData();
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

      <div className="panel mt-1">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Clinics
            </h5>
            <Tippy content="Total Clinics">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalClinics} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>
          <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Add Clinic">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openAddModal()}
              >
                <IconPlus className="ltr:mr-2 rtl:ml-2" />
                Add Clinic
              </button>
            </Tippy>
          </div>
        </div>
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Clinics to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allClinics}
              idAccessor="clinic_id"
              onRowClick={(row) =>
                navigate(`/owner/clinics/${row.clinic_id}/doctors`)
              }
              columns={[
                {
                  accessor: "",
                  title: "ID",
                  render: (rowData, index) => (
                    <span>{(page - 1) * pageSize + index + 1}</span>
                  ),
                },
                { accessor: "name", title: "Name" },
                { accessor: "phone", title: "Phone" },
                { accessor: "address", title: "Address" },
                { accessor: "place", title: "Place" },
                { accessor: "User.email", title: "Email" },

                {
                  accessor: "banner_img_url",
                  title: "Banner Image",
                  render: (rowData) => (
                    <img
                      src={imageBaseUrl + rowData.banner_img_url}
                      alt="Banner"
                      className="w-10"
                    />
                  ),
                },
                {
                  accessor: "googleLocation",
                  title: "Google Location",
                  render: (rowData) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetLocation(rowData.googleLocation);
                      }}
                      className="btn btn-success btn-sm"
                    >
                      <IconMenuContacts className="mr-1 w-4" />
                      View Location
                    </button>
                  ),
                },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex gap-4 items-center w-max mx-auto">
                      <Tippy content="Edit">
                        <button
                          className="flex hover:text-info"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(rowData);
                          }}
                        >
                          <IconEdit className="w-4.5 h-4.5" />
                        </button>
                      </Tippy>
                      <Tippy content="Block/Unblock">
                        <label
                          className="w-[46px] h-[22px] relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (rowData?.User?.status) {
                              showBlockAlert(rowData?.user_id);
                            } else {
                              showUnblockAlert(rowData?.user_id);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                            id={`custom_switch_checkbox${rowData.User.user_id}`}
                            checked={rowData.User.status}
                            readOnly
                          />
                          <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                        </label>
                      </Tippy>
                      {/* <Tippy content="Delete">
              <button
                type="button"
                className="flex hover:text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteConfirmModal();
                }}
              >
                <IconTrashLines />
              </button>
            </Tippy>  */}
                    </div>
                  ),
                },
              ]}
              totalRecords={totalClinics}
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
      {/* add clinic modal */}
      <AddClinic
        open={addModal}
        closeModal={closeAddModal}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        data={input}
        setData={setInput}
        handleSubmit={createClinic}
        buttonLoading={buttonLoading}
      />
      {/* edit clinic modal */}
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

      {/* delete sales person modal */}
      {/* <DeleteClinic open={deleteModal} closeModal={closeDeleteConfirmModal} /> */}
    </div>
  );
};

export default Clinics;

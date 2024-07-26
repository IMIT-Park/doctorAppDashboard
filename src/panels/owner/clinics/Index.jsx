import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconEdit from "../../../components/Icon/IconEdit";
import IconPlus from "../../../components/Icon/IconPlus";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useLocation, useNavigate } from "react-router-dom";
import AddClinic from "./AddClinic";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";
import { showMessage } from "../../../utils/showMessage";
import {
  convertLocationDetail,
  handleGetLocation,
} from "../../../utils/getLocation";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import ModalSubscription from "./ModalSubscription";
import { UserContext } from "../../../contexts/UseContext";
import CustomSwitch from "../../../components/CustomSwitch";
import CustomButton from "../../../components/CustomButton";
import IconSearch from "../../../components/Icon/IconSearch";

const Clinics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userDetails } = useContext(UserContext);
  const ownerId = userDetails?.UserOwner?.[0]?.owner_id || 0;

  useEffect(() => {
    dispatch(setPageTitle("Clinics"));
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [allClinics, setAllClinics] = useState([]);
  const [totalClinics, setTotalClinics] = useState(0);
  const [totalClinicsCount, setTotalClinicsCount] = useState(0);
  const [subscriptionAddModal, setsubscriptionAddModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentClinicId, setCurrentClinicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    user_name: "",
    phone: "",
    address: "",
    place: "",
    password: "",
    confirmPassword: "",
    picture: null,
    defaultPicture: null,
    googleLocation: null,
    type: "",
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPage(1);
  }, [pageSize, search]);

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
        `/v1/clinic/getallclinics/${ownerId}?page=${page}&pageSize=${pageSize}`
      );
      setTotalClinics(response.data?.pageInfo?.total || 0);
      setTotalClinicsCount(response.data?.pageInfo?.total || 0);
      setAllClinics(response.data?.Clinic);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // handle add modal
  const openAddModal = () => {
    setAddModal(true);
  };

  const addSubscriptionModal = () => {
    setsubscriptionAddModal(true);
  };

  const closeSubscriptionModal = () => {
    setsubscriptionAddModal(false);
    setSelectedPlan(null);
  };

  const closeAddModal = () => {
    setAddModal(false);
    setInput({
      ...input,
      name: "",
      email: "",
      user_name: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      place: "",
      picture: null,
      defaultPicture: null,
      googleLocation: null,
      type: "",
    });
  };

  const openEditModal = (clinic) => {
    console.log(clinic);
    const phoneWithoutCountryCode = clinic?.phone?.replace(/^\+91/, "");
    const isGoogleLocationValid =
      clinic?.googleLocation && clinic.googleLocation !== `"{}"`;
    setInput({
      name: clinic?.name,
      email: clinic?.User?.email,
      username: clinic?.User?.user_name,
      phone: phoneWithoutCountryCode,
      address: clinic?.address,
      place: clinic?.place,
      picture: null,
      googleLocation: isGoogleLocationValid
        ? convertLocationDetail(clinic?.googleLocation)
        : null,
      defaultPicture: imageBaseUrl + clinic?.banner_img_url || null,
      type: clinic?.type || "",
    });
    setCurrentClinicId(clinic?.clinic_id);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setInput({
      name: "",
      email: "",
      user_name: "",
      phone: "",
      address: "",
      place: "",
      picture: null,
      googleLocation: {},
      type: "",
    });
    setCurrentClinicId(null);
  };

  // Function to create a new clinic
  const createClinic = async () => {
    if (
      !input.name ||
      !input.email ||
      !input.phone ||
      !input.address ||
      !input.place ||
      !input.password ||
      !input.picture ||
      !input.confirmPassword ||
      !input.type
    ) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    if (input.password !== input.confirmPassword) {
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
    formData.append("user_name", input.email);
    formData.append("phone", `+91${input.phone}`);
    formData.append("address", input.address);
    formData.append("place", input.place);
    formData.append("type", input.type);

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
      console.log(error);
      if (error?.response?.status === 403) {
        showMessage(
          error?.response?.data?.error == "User Already Exists"
            ? "Username Already Exist."
            : "Email Already Exist.",
          "error"
        );
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
      !input.phone ||
      !input.address ||
      !input.place ||
      !input.type
    ) {
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
    formData.append("phone", `+91${input.phone}`);
    formData.append("address", input.address);
    formData.append("place", input.place);
    formData.append("type", input.type);
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

  // block and unblock handler
  const { showAlert: showClinicAlert, loading: blockUnblockClinicLoading } =
    useBlockUnblock(fetchData);

  const handleSubButtonClick = (clinic) => {
    setCurrentClinicId(clinic.clinic_id);
    setsubscriptionAddModal(true);
  };

  // Search Clinic
  const fetchSearchClinics = async () => {
    const updatedKeyword = isNaN(search) ? search : `+91${search}`;
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/clinic/getclinicdata/${ownerId}?pageSize=${pageSize}&page=${page}`,
        { keyword: updatedKeyword }
      );
      setTotalClinics(response?.data?.pagination?.total || 0);
      setAllClinics(response?.data?.clinics || []);
    } catch (error) {
      setAllClinics([]);
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (search.trim()) {
      fetchSearchClinics();
    } else {
      fetchData();
    }
  }, [search, page, pageSize]);

  return (
    <div>
      <ScrollToTop />
      <div className="panel mt-1">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Clinics
            </h5>
            <Tippy content="Total Clinics">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp
                  start={0}
                  end={totalClinicsCount}
                  duration={3}
                ></CountUp>
              </span>
            </Tippy>
          </div>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ownerSearch();
              }}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Search Clinics..."
                  className="form-input form-input-green shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-green absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center"
                >
                  <IconSearch className="mx-auto" />
                </button>
              </div>
            </form>
          </div>
          <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <CustomButton onClick={() => openAddModal()}>
              <IconPlus className="ltr:mr-2 rtl:ml-2" />
              Add Clinic
            </CustomButton>
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
              idAccessor="clinic.clinic_id"
              onRowClick={(row) =>
                navigate(`/clinics/${row?.clinic?.clinic_id}`, {
                  state: { previousUrl: location?.pathname },
                })
              }
              columns={[
                {
                  accessor: "",
                  title: "No",
                  render: (rowData, index) => (
                    <span>{(page - 1) * pageSize + index + 1}</span>
                  ),
                },
                { accessor: "clinic.name", title: "Name" },
                { accessor: "clinic.User.email", title: "Email" },
                { accessor: "clinic.User.user_name", title: "Username" },
                { accessor: "clinic.phone", title: "Phone" },
                { accessor: "clinic.address", title: "Address" },
                { accessor: "clinic.type", title: "Category" },
                { accessor: "clinic.place", title: "Place" },
                {
                  accessor: "doctor_count",
                  title: "Total Doctors",
                  textAlignment: "center",
                },

                {
                  accessor: "clinic.clinic_id",
                  title: "Plan Details",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="grid place-items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubButtonClick(rowData?.clinic);
                        }}
                        className="btn btn-green btn-sm py-1"
                      >
                        View Plan
                      </button>
                    </div>
                  ),
                },
                // {
                //   accessor: "googleLocation",
                //   title: "Location",
                //   textAlignment: "center",
                //   render: (rowData) => (
                //     <div className="grid place-items-center">
                //       <button
                //         type="button"
                //         onClick={(e) => {
                //           e.stopPropagation();
                //           handleGetLocation(rowData.googleLocation);
                //         }}
                //         className="btn btn-success btn-sm py-1"
                //       >
                //         <IconMenuContacts className="mr-1 w-4" />
                //         View Location
                //       </button>
                //     </div>
                //   ),
                // },

                // {
                //   accessor: "Actions",
                //   textAlignment: "center",
                //   render: (rowData) => (
                //     <div className="flex gap-4 items-center w-max mx-auto">
                //       <Tippy content="Edit">
                //         <button
                //           className="flex hover:text-info"
                //           onClick={(e) => {
                //             e.stopPropagation();
                //             openEditModal(rowData);
                //           }}
                //         >
                //           <IconEdit className="w-4.5 h-4.5" />
                //         </button>
                //       </Tippy>
                //       <CustomSwitch
                //         checked={rowData?.User?.status}
                //         onChange={() =>
                //           showClinicAlert(
                //             rowData?.user_id,
                //             rowData?.User?.status ? "block" : "activate",
                //             "clinic"
                //           )
                //         }
                //         tooltipText={
                //           rowData?.User?.status ? "Block" : "Unblock"
                //         }
                //         uniqueId={`clinic${rowData?.clinic_id}`}
                //         size="normal"
                //       />

                //     </div>
                //   ),
                // },

                // Column configuration for the status
                {
                  accessor: "clinic.User.status",
                  title: "status",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex items-center gap-2">
                      <span
                        className={`ml-2 ${
                          rowData?.clinic?.User?.status
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {rowData?.User?.status ? "Active" : "Blocked"}
                      </span>
                    </div>
                  ),
                },

                // Column configuration for the actions
                {
                  accessor: "actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex gap-4 items-center w-max mx-auto">
                      <Tippy content="Edit">
                        <button
                          className="flex hover:text-info"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(rowData?.clinic);
                          }}
                        >
                          <IconEdit className="w-4.5 h-4.5" />
                        </button>
                      </Tippy>
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

      <ModalSubscription
        open={subscriptionAddModal}
        closeModal={closeSubscriptionModal}
        clinicId={currentClinicId}
        ownerId={ownerId}
        buttonLoading={buttonLoading}
        setButtonLoading={setButtonLoading}
        fetchClinicData={fetchData}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />
    </div>
  );
};

export default Clinics;

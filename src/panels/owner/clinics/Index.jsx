import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconEdit from "../../../components/Icon/IconEdit";
import Swal from "sweetalert2";
import IconPlus from "../../../components/Icon/IconPlus";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { Link, useNavigate } from "react-router-dom";
import AddClinic from "./AddClinic";
// import DeleteClinic from "./DeleteClinic";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";

const Clinics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Clinics"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [allClinics, setAllClinics] = useState([]);
  const [totalClinics, setTotalClinics] = useState(0);
  const [addModal, setAddModal] = useState(false);
  // const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState({});
  const [input, setInput] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    picture: null,
    password: "",
    confirmPassword: "",
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
      setInput({ ...input, picture: file });
    } else {
      setInput({ ...input, picture: null });
    }
  };

  const handleRemoveImage = () => {
    setInput({ ...input, picture: null });
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setInput({
          ...input,
          googleLocation: JSON.stringify({ lat: latitude, long: longitude }),
        });
      });
    } else {
      // Handle when geolocation is not available
      console.log("Geolocation is not available");
    }
  };
  
  // fetch function
  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getall?pageSize=${pageSize}&page=${page}`
      );
      console.log(response?.data);
      console.log(response?.data?.Clinic?.rows);

      setTotalClinics(response.data?.Clinic?.count);
      setAllClinics(response.data?.Clinic?.rows);

      // Extract active status from the response and update the state
      const activeStatusObj = response.data?.Clinic?.rows.reduce(
        (acc, clinic) => {
          acc[clinic.clinic_id] = clinic.User?.status || false;
          return acc;
        },
        {}
      );
      setActiveStatus(activeStatusObj);

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
    });
  };

  // handle Delete Modal
  // const openDeleteConfirmModal = () => {
  //   setDeleteModal(true);
  // };
  // const closeDeleteConfirmModal = () => {
  //   setDeleteModal(false);
  // };

  // const deleteUser = () => {
  //   showMessage("User has been deleted successfully.");
  //   setDeleteModal(false);
  // };

  const toggleActiveStatus = (id) => {
    setActiveStatus((prevStatus) => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
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
        setActiveStatus((prevState) => ({ ...prevState, [id]: false }));
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
        setActiveStatus((prevState) => ({ ...prevState, [id]: true }));
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
    onRowClick={(row) => navigate(`/owner/clinics/${row.clinic_id}/doctors`)}
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
      {
        accessor: "banner_img_url",
        title: "Banner Image",
        render: (rowData) => (
          <img src={imageBaseUrl+rowData.banner_img_url} alt="Banner" className="w-10" />
        ),
      },
      {
        accessor: "googleLocation",
        title: "Google Location",
        render: (rowData) => {
          const location = JSON.parse(rowData.googleLocation);
          const { lat, long } = location;
          const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
          return (
            <a href={googleMapsURL} target="_blank" rel="noopener noreferrer">
              View on Google Maps
            </a>
          );
        },
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
                  addUser();
                }}
              >
                <IconEdit className="w-4.5 h-4.5" />
              </button>
            </Tippy>
            <Tippy content="Delete">
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
      {/* add sales person modal */}
      <AddClinic
        open={addModal}
        closeModal={closeAddModal}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        data={input}
      />

      {/* delete sales person modal */}
      {/* <DeleteClinic open={deleteModal} closeModal={closeDeleteConfirmModal} /> */}
    </div>
  );
};

export default Clinics;

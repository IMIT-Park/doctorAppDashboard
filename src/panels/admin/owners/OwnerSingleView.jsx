import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";
import { handleGetLocation } from "../../../utils/getLocation";

const OwnerSingleView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { ownerId } = useParams();

  useEffect(() => {
    dispatch(setPageTitle("Clinics"));
  }, []);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalClinics, setTotalClinics] = useState(0);
  const [allClinics, setAllClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

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

  //GET METHOD
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getallclinics/${ownerId}?page=${page}&pageSize=${pageSize}`
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

  const fetchOwnerInfo = async () => {
    setDetailsLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/owner/getowner/${ownerId}`
      );
      setOwnerInfo(response.data?.Owner);
      setDetailsLoading(false);
    } catch (error) {
      console.log(error);
      setDetailsLoading(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(
    () => {
      fetchOwnerInfo();
    }, //[ownerId, page, pageSize]
    []
  );

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  //  block or unblock handler
  const handleActiveUser = async (userId) => {
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/auth/activate/${userId}`
      );
      fetchOwnerInfo();
      fetchData();
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    }
  };

  const showOwnerBlockAlert = (id) => {
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

  const showOwnerUnblockAlert = (id) => {
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
          title: "Blocked!",
          text: "The Owner has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  const showBlockAlert = (id) => {
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

  const showUnblockAlert = (id) => {
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
          title: "Blocked!",
          text: "The Clinic has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  return (
    <div>
      <ScrollToTop />
      <button
        onClick={() => navigate("/admin/owners")}
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
            <div className="flex justify-between flex-wrap gap-4 sm:px-4">
              <div className="text-2xl font-semibold capitalize dark:text-slate-300">
                {ownerInfo?.name || ""}
              </div>
              <label
                className="w-12 h-6 relative"
                onClick={(e) => {
                  e.stopPropagation();
                  if (ownerInfo?.User?.status) {
                    showOwnerBlockAlert(ownerInfo?.user_id);
                  } else {
                    showOwnerUnblockAlert(ownerInfo?.user_id);
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                  id={`custom_switch_checkbox_owner${ownerInfo?.owner_id}`} // Unique ID
                  checked={ownerInfo?.User?.status}
                  readOnly
                />
                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
              </label>
            </div>
            <div className="text-left sm:px-4">
              <div className="mt-5">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark min-w-16 flex items-end justify-between">
                    Address <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">
                    {ownerInfo?.address}
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap mb-2 sm:mb-1">
                  <div className="text-white-dark min-w-16 flex items-end justify-between">
                    Email <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">{ownerInfo?.email}</div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <div className="text-white-dark min-w-16 flex items-end justify-between">
                    Phone <span>:</span>
                  </div>
                  <div className="dark:text-slate-300">{ownerInfo?.phone}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Clinics
            </h5>
            <Tippy content="Total Clinics">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalClinics} duration={3}></CountUp>
              </span>
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
                navigate(`/clinics/${row?.clinic_id}`, {
                  state: { previousUrl: location?.pathname },
                })
              }
              columns={[
                {
                  accessor: "clinic_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                { accessor: "name", title: "Name" },
                { accessor: "phone", title: "Phone" },
                { accessor: "address", title: "Address" },
                { accessor: "User.email", title: "Email" },

                { accessor: "place", title: "Place" },
                {
                  accessor: "googleLocation",
                  title: "Location",
                  textAlignment: "center",
                  render: (rowData) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetLocation(rowData.googleLocation);
                      }}
                      className="btn btn-success btn-sm py-1"
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
                          id={`custom_switch_checkbox_${rowData.clinic_id}`} // Unique ID
                          checked={rowData?.User?.status}
                          readOnly
                        />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                      </label>
                    </Tippy>
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
    </div>
  );
};

export default OwnerSingleView;

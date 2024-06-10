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

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { ownerId, clinicId } = useParams();

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [clinicInfo, setClinicInfo] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [clinicDetails, setClinicDetails] = useState({});

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

  const fetchClinicInfo = async () => {
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

  useEffect(() => {
    fetchClinicInfo();
  }, []);

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
      fetchClinicInfo();
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <div>
      <ScrollToTop />
      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
        <ul className="flex space-x-2 rtl:space-x-reverse mb-2">
          <li>
            <Link to="/admin/owners" className="text-primary hover:underline">
              Owners
            </Link>
          </li>
          <li className="before:content-['/'] before:mr-2">
            <Link
              to={`/admin/owners/${ownerId}/clinics`}
              className="text-primary hover:underline"
            >
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
                id="custom_switch_checkbox_blocked"
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
            <div className="flex justify-between flex-wrap gap-4 sm:px-4">
              <div className="text-2xl font-semibold capitalize">
                {clinicDetails?.name || ""}
              </div>
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
              </div>
            </div>
          </>
        )}
      </div>

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <Tippy content="Total Doctors">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalDoctors} duration={3}></CountUp>
              </span>
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
              columns={[
                { accessor: "doctor_id", title: "ID" },
                {
                  accessor: "photo",
                  title: "Photo",
                  render: (row) =>
                    row?.photo ? (
                      <img
                        src={imageBaseUrl + row?.photo}
                        alt="Doctor's photo"
                        className="w-10 h-10 rounded-[50%]"
                      />
                    ) : (
                      "---"
                    ),
                },

                { accessor: "name", title: "Name" },
                { accessor: "phone", title: "Phone" },
                { accessor: "gender", title: "Gender" },
                {
                  accessor: "dateOfBirth",
                  title: "Date of Birth",
                  render: (row) => formatDate(row?.dateOfBirth),
                },

                // { accessor: "email", title: "Email" },
                { accessor: "qualification", title: "Qualification" },
                { accessor: "specialization", title: "Specialization" },
                { accessor: "address", title: "Address" },
                { accessor: "fees", title: "Fees" },
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
                          id={`custom_switch_checkbox${rowData?.doctor_id}`}
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
    </div>
  );
};

export default Doctors;

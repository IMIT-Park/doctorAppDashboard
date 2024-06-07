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
import NetworkHandler from "../../../utils/NetworkHandler";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { clinicId } = useParams();

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  }, [dispatch]);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clinicInfo, setClinicInfo] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    fetchData();
    fetchClinicInfo();
  }, [clinicId, page, pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
        // `/v1/doctor/getalldr/1?pageSize=10&page=1`
      );
      const { count, rows } = response.data?.Doctors || {};
      setTotalDoctors(count || 0);
      setAllDoctors(Array.isArray(rows) ? rows : []);
      console.log(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClinicInfo = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getbyId/${clinicId}`
      );
      setClinicInfo(response.data);
    } catch (error) {
      console.log(error);
    }
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

  const showBlockAlert = (id) => {
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
        setActiveStatus((prevState) => ({ ...prevState, [id]: false }));
        Swal.fire({
          title: "Blocked!",
          text: "The Doctor has been blocked.",
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
      text: "You want to unblock this Doctor!",
      showCancelButton: true,
      confirmButtonText: "Unblock",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        setActiveStatus((prevState) => ({ ...prevState, [id]: true }));
        Swal.fire({
          title: "Unblocked!",
          text: "The Doctor has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

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
              to={`/admin/owners/${clinicId}/clinics`}
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
        <div className="flex justify-between flex-wrap gap-4">
          <div className="text-2xl font-semibold capitalize">Clinic</div>
          <label
            className="w-12 h-6 relative"
            onClick={(e) => {
              e.stopPropagation();
              showBlockAlert();
            }}
          >
            <input
              type="checkbox"
              className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
              id={`custom_switch_checkbox_owner`} // Unique ID
              checked={true}
              readOnly
            />
            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
          </label>
        </div>
        <div className="text-left sm:px-4">
          <div className="mt-5">
            <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
              <div className="text-white-dark">Name :</div>
              <div>{clinicInfo?.Clinic.name}</div>
            </div>
            <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
              <div className="text-white-dark">Address :</div>
              <div>{clinicInfo?.Clinic.address}</div>
            </div>
            <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
              <div className="text-white-dark">Email :</div>
              <div>{clinicInfo?.Clinic.User.email}</div>
            </div>
            <div className="flex items-center sm:gap-2 flex-wrap">
              <div className="text-white-dark">Phone :</div>
              <div>{clinicInfo?.Clinic.phone}</div>
            </div>
          </div>
        </div>
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
              onRowClick={(row) =>
                navigate(
                  `/admin/clinics/${clinicId}/doctors/${row?.doctor_id}`,
                  {
                    state: { previousUrl: location.pathname },
                  }
                )
              }
              columns={[
                { accessor: "doctor_id", title: "ID" },
                { accessor: "name", title: "Name" },
                { accessor: "email", title: "Email" },
                { accessor: "address", title: "Address" },
                { accessor: "qualification", title: "Qualification" },
                { accessor: "fees", title: "Fees" },
                { accessor: "phone", title: "Phone" },
                { accessor: "specialization", title: "Specialization" },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <Tippy content="Block/Unblock">
                      <label
                        className="w-[46px] h-[22px] relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeStatus[rowData.doctor_id]) {
                          showBlockAlert();
                          } else {
                            showUnblockAlert(rowData.doctor_id);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                          id={`custom_switch_checkbox`}
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

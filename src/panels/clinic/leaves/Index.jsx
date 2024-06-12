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
import { Link, useLocation, useNavigate } from "react-router-dom";
import IconSearch from "../../../components/Icon/IconSearch";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import IconMenuScrumboard from "../../../components/Icon/Menu/IconMenuScrumboard";
import AddLeave from "./AddLeaveModal";


const ClinicDoctorLeave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [allLeaves, setAllLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [allDoctorNames, setAllDoctorNames] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  const openAddLeaveModal = () => {
    setAddLeaveModal(true);
  };

  const closeAddLeaveModal = () => {
    setAddLeaveModal(false);
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

  // Get Leave by Clinic
  const fetchLeaveData = async () => {
    const clinicId = userData?.UserClinic[0]?.clinic_id;
    console.log(clinicId);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getleave/${clinicId}?page=${page}&pageSize=${pageSize}`
      );

      setTotalLeaves(response.data?.count);
      setAllLeaves(response.data?.doctorLeaveDetails);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching Leave
  useEffect(() => {
    fetchLeaveData();
  }, [page, pageSize]);

  const fetchDoctorData = async () => {
    const clinicId = userData?.UserClinic[0]?.clinic_id;
    let allDoctors = [];
    let page = 1;
    let hasMorePages = true;

    try {
      while (hasMorePages) {
        const response = await NetworkHandler.makeGetRequest(
          `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
        );

        const doctorData = response.data?.Doctors?.rows || [];
        allDoctors = allDoctors.concat(doctorData);

        hasMorePages = doctorData.length === pageSize;
        page += 1;
      }

      setAllDoctorNames(allDoctors);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching Doctors
  useEffect(() => {
    fetchDoctorData();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const convertTo12HourFormat = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${period}`;
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

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Leaves
            </h5>
            <Tippy content="Total Doctors">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalLeaves} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>

          <div>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Search Doctor..."
                  className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center"
                >
                  <IconSearch className="mx-auto" />
                </button>
              </div>
            </form>
          </div>

          <div className="flex  text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Add Doctor">
              <button
                type="button"
                className="btn btn-primary"
                onClick={openAddLeaveModal}
              >
                <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
                New Leave
              </button>
            </Tippy>
          </div>
        </div>
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Leaves to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allLeaves}
              idAccessor="leave_id"
              // onRowClick={() => navigate("/admin/owners/clinics/doctors/doctor")}
              columns={[
                {
                  accessor: "No",
                  title: "No",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                {
                  accessor: "doctorDetails.photo",
                  title: "Photo",
                  render: (row) =>
                    row?.doctorDetails?.photo ? (
                      <img
                        src={imageBaseUrl + row?.doctorDetails?.photo}
                        alt="Doctor's photo"
                        className="w-10 h-10 rounded-[50%]"
                      />
                    ) : (
                      "---"
                    ),
                },

                { accessor: "doctorDetails.name", title: "Name" },
                { accessor: "doctorDetails.phone", title: "phone" },

                // {
                //   accessor: "leave_date",
                //   title: "Leave Date",
                //   render: (row) => formatDate(row.leaveSlots[0]?.leave_date),
                // },

                {
                  accessor: "DoctorTimeSlot",
                  title: "Leave Date and Slot",

                  render: (row) => {
                    if (row.leaveSlots && row.leaveSlots.length > 0) {
                      return (
                        <div>
                          {row.leaveSlots.map((leaveSlot, index) => (
                              <div key={index} className="mb-5"
                             
                              >
                              <span className="text-slate-900 dark:text-slate-50 font-normal   px-2 py-0.5 rounded-md">
                                <time>{formatDate(leaveSlot.leave_date)} : </time>
                              </span>
                              <span className="text-slate-900 dark:text-slate-50 font-normal border border-primary px-2 py-0.5 rounded-md ml-2">
                                <time>{convertTo12HourFormat(leaveSlot.DoctorTimeSlot.startTime)} - {convertTo12HourFormat(leaveSlot.DoctorTimeSlot.endTime)}</time>
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return "";
                    }
                  },
                },
              
              ]}
              totalRecords={totalLeaves}
              recordsPerPage={pageSize}
              page={page}
              onPageChange={(p) => setPage(p)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setPageSize}
              minHeight={200}
              paginationText={({ from, to, totalRecords }) =>
                `Showing ${from} to ${to} of ${totalRecords} entries`
              }
            />
          </div>
        )}
      </div>
      <AddLeave
        addLeaveModal={addLeaveModal}
        setAddLeaveModal={setAddLeaveModal}
        closeAddLeaveModal={closeAddLeaveModal}
        buttonLoading={buttonLoading}
        allDoctorNames={allDoctorNames}
        fetchLeaveData={fetchLeaveData}
      />
    </div>
  );
};

export default ClinicDoctorLeave;

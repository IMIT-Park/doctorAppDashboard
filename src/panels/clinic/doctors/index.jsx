import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconMenuScrumboard from "../../../components/Icon/Menu/IconMenuScrumboard";
import IconEdit from "../../../components/Icon/IconEdit";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import AddDoctor from "./AddDoctor";
import AddDoctorModalDetail from "./AddDoctorModalDetail";
import DeleteDoctor from "./DeleteDoctor";
import DoctorPassword from "./DoctorPassword";
import IconEye from "../../../components/Icon/IconEye";
import ScrollToTop from "../../../components/ScrollToTop";
import IconSearch from "../../../components/Icon/IconSearch";
import IconLoader from "../../../components/Icon/IconLoader";
import emptyBox from "/assets/images/empty-box.svg";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { useNavigate } from "react-router-dom";

const rowData = [];
const ClinicDoctor = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = rowData.slice(0, pageSize);
  const [addDoctorModal, setaddDoctorModal] = useState(false);
  const [addDoctorModalDetail, setAddDoctorModalDetail] = useState(false);
  const [addDoctorPasswordModal, setAddDoctorPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [search, setSearch] = useState("");
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);

 
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for day
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for month
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const openAddDoctorModal = () => {
    setaddDoctorModal(true);
  };

  const closeAddDoctorModal = () => {
    setaddDoctorModal(false);
  };

  const closeAddDoctorModalDetail = () => {
    setAddDoctorModalDetail(false);
    setaddDoctorModal(true);
  };

  const openAddDoctorModalDetail = () => {
    setAddDoctorModalDetail(true);
  };

  const handleSelectDays = () => {
    closeAddDoctorModal();
    openAddDoctorModalDetail();
  };

  const doctorPasswordModal = () => {
    setAddDoctorPasswordModal(true);
  };

  const closeDoctorPasswordModal = () => {
    setAddDoctorPasswordModal(false);
    setAddDoctorModalDetail(true);
  };

  const handleDoctorPassword = () => {
    setAddDoctorModalDetail(false);
    doctorPasswordModal();
  };

  const saveDoctor = () => {
    alert("Success");
  };

  // handle Delete Modal
  const openDeleteConfirmModal = () => {
    setDeleteModal(true);
  };
  const closeDeleteConfirmModal = () => {
    setDeleteModal(false);
  };

  // fetch Doctors function
  const fetchData = async () => {

    const clinicId = userData?.UserClinic[0]?.clinic_id;
    console.log("clinicId:", clinicId);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
      );
      // console.log(response?.data?.Clinic);
      setTotalDoctors(response.data?.Doctors?.count);
      setAllDoctors(response.data?.Doctors?.rows);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching Loans
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

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
              Doctors
            </h5>
            <Tippy content="Total Doctors">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalDoctors} duration={3}></CountUp>
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
              onClick={openAddDoctorModal}
            >
              <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
              Add Doctor
            </button>
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
              onRowClick={(row) => navigate(`/clinic/doctors/${row.doctor_id}/doctor`)}
              columns={[
                {
                  accessor: "No",
                  title: "No",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                // { accessor: "doctor_id", title: "ID" },

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
      <AddDoctor
        addDoctorModal={addDoctorModal}
        setaddDoctorModal={setaddDoctorModal}
        buttonLoading={buttonLoading}
        saveDoctor={saveDoctor}
        handleSelectDays={handleSelectDays}
        closeAddDoctorModal={closeAddDoctorModal}
      />
      <AddDoctorModalDetail
        addDoctorModalDetail={addDoctorModalDetail}
        closeAddDoctorModalDetail={closeAddDoctorModalDetail}
        buttonLoading={buttonLoading}
        handleDoctorPassword={handleDoctorPassword}
      />
      <DeleteDoctor open={deleteModal} closeModal={closeDeleteConfirmModal} />
      <DoctorPassword
        addDoctorPasswordModal={addDoctorPasswordModal}
        closeDoctorPasswordModal={closeDoctorPasswordModal}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        data={data}
        setData={setData}
      />
    </div>
  );
};

export default ClinicDoctor;

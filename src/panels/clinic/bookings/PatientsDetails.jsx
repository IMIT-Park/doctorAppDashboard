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
// import AddDoctor from "./AddDoctor";
// import AddDoctorModalDetail from "./AddDoctorModalDetail";
// import DeleteDoctor from "./DeleteDoctor";
// import DoctorPassword from "./DoctorPassword";
import IconEye from "../../../components/Icon/IconEye";
import ScrollToTop from "../../../components/ScrollToTop";
import IconSearch from "../../../components/Icon/IconSearch";
import IconLoader from "../../../components/Icon/IconLoader";
import emptyBox from "/assets/images/empty-box.svg";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AddPatients from "./AddPatients";
import ShowPatients from "./SearchPatientsModal";

const rowData = [];
const PatientsDetails = () => {
  const dispatch = useDispatch();
  const {doctorId} = useParams()
  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = rowData.slice(0, pageSize);
  const [addPatientsModal, setAddPatientsModal] = useState(false);
  // const [addDoctorModalDetail, setAddDoctorModalDetail] = useState(false);
  const [addDoctorPasswordModal, setAddDoctorPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [singleDetails, setSingleDetails] = useState({});
  const [totalPatients, setTotalPatients] = useState(0);
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  useEffect(() => {
    if (search) {
      const filtered = allPatients.filter((doctor) =>
        doctor.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(allPatients);
    }
  }, [search, allPatients]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for day
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for month
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const openAddPatientsModal = () => {
    setAddPatientsModal(true);
  };

  const closeAddPatientsModal = () => {
    setAddPatientsModal(false);
  };

  const openViewModal = (user) => {
    setSingleDetails(user);
    setViewModal(true);
  };

  const closeViewModal = () => {
    setViewModal(false);
  };

  // const closeAddDoctorModalDetail = () => {
  //   setAddDoctorModalDetail(false);
  //   setaddDoctorModal(true);
  // };

  // const openAddDoctorModalDetail = () => {
  //   setAddDoctorModalDetail(true);
  // };

  // const handleSelectDays = () => {
  //   closeAddDoctorModal();
  //   openAddDoctorModalDetail();
  // };

  // const doctorPasswordModal = () => {
  //   setAddDoctorPasswordModal(true);
  // };

  // const closeDoctorPasswordModal = () => {
  //   setAddDoctorPasswordModal(false);
  //   setAddDoctorModalDetail(true);
  // };

  // const handleDoctorPassword = () => {
  //   setAddDoctorModalDetail(false);
  //   doctorPasswordModal();
  // };

  // const saveDoctor = () => {
  //   alert("Success");
  // };

  // handle Delete Modal
  // const openDeleteConfirmModal = () => {
  //   setDeleteModal(true);
  // };
  // const closeDeleteConfirmModal = () => {
  //   setDeleteModal(false);
  // };

  // fetch Doctors function
  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getall?pageSize=${pageSize}&page=${page}`
      );
      console.log(response?.data?.Clinic);
      setTotalPatients(response.data?.Doctors?.count);
      setAllPatients(response.data?.Doctors?.rows);
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
      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
        <ul className="flex space-x-2 rtl:space-x-reverse mb-2">
          <li>
            <Link to="/clinic/bookings" className="text-primary hover:underline">
              Doctors
            </Link>
          </li>
          <li className="before:content-['/'] before:mr-2">
            <span>Patients</span>
          </li>
        </ul>
      </div>

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Patients
            </h5>
            <Tippy content="Total Doctors">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalPatients} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>

          <div>
            <form
              //   onSubmit={(e) => handleSubmit(e)}
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  value={search}
                  type="text"
                  placeholder="Search Patients..."
                  className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                  // onChange={(e) => setSearch(e.target.value)}
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

          <div className="flex  text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Add Doctor">
              <button
                type="button"
                className="btn btn-green"
                onClick={openAddPatientsModal}
              >
                <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
                Add Patients
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
              records={filteredPatients}
              onRowClick={(row) =>
                // navigate(`/clinic/bookings/${doctorId}/patients/${patientId}`)
                navigate(`/clinic/bookings/${doctorId}/patients/${1}`)
              }
              columns={[
                {
                  accessor: "No",
                  title: "No",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                // { accessor: "doctor_id", title: "ID" },
                { accessor: "patientId", title: "Patient Id" },
                { accessor: "patientId", title: "Token Id" },
                { accessor: "name", title: "Name" },
                { accessor: "phone", title: "Phone" },
                { accessor: "gender", title: "Gender" },
                {
                  accessor: "dateOfBirth",
                  title: "Date of Birth",
                  render: (row) => formatDate(row?.dateOfBirth),
                },

              ]}
              totalRecords={totalPatients}
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
      <AddPatients
        addPatientsModal={addPatientsModal}
        setAddPatientsModal={setAddPatientsModal}
        buttonLoading={buttonLoading}
        // saveDoctor={saveDoctor}
        // handleSelectDays={handleSelectDays}
        closeAddPatientsModal={closeAddPatientsModal}
      />
      <ShowPatients
      open={viewModal}
      closeModal={closeViewModal}
      details={singleDetails}
      />
      {/* <AddDoctorModalDetail
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
      /> */}
    </div>
  );
};

export default PatientsDetails;

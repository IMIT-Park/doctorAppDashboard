import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import ScrollToTop from "../../../components/ScrollToTop";
import IconSearch from "../../../components/Icon/IconSearch";
import IconLoader from "../../../components/Icon/IconLoader";
import emptyBox from "/assets/images/empty-box.svg";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { useNavigate, Link } from "react-router-dom";
import ShowPatients from "./SearchPatientsModal";

const rowData = [];
const ClinicBookingDoctor = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchModal, setSearchModal] = useState(false);
  const [singleDetails, setSingleDetails] = useState({});
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic[0]?.clinic_id;

 
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

  const openSearchModal = (user) => {
    setSingleDetails(user);
    setSearchModal(true);
  };

  const closeSearchModal = () => {
    setSearchModal(false);
  };


  // fetch Doctors function
  const fetchData = async () => {

    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
      );
      // console.log(response?.data?.Clinic);
      setTotalDoctors(response.data?.count);
      setAllDoctors(response.data?.alldoctors);
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
        <li className="mr-2">
            <span>Doctors</span>
          </li>
        </ul>
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
                  className="btn btn-green absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center"
                >
                  <IconSearch className="mx-auto" />
                </button>
              </div>
            </form>
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
              // onRowClick={(row) => navigate(`/clinic/bookings/${row?.doctor_id}/patients`)}
              onRowClick={(row)=> openSearchModal(row)}
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
      <ShowPatients
      open={searchModal}
      closeModal={closeSearchModal}
      details={singleDetails}
      />
    </div>
  );
};

export default ClinicBookingDoctor;

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useLocation, useNavigate } from "react-router-dom";
import IconSearch from "../../../components/Icon/IconSearch";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { formatDate } from "../../../utils/formatDate";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import CustomSwitch from "../../../components/CustomSwitch";
import noProfile from "/assets/images/empty-user.png";
import * as XLSX from "xlsx";
import IconFile from "../../../components/Icon/IconFile";

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalDoctorsCount, setTotalDoctorCount] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [pageSize, search]);

  // useEffect(() => {
  //   const from = (page - 1) * pageSize;
  //   const to = from + pageSize;
  // }, [page, pageSize]);

  // fetch Doctors function
  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getall?pageSize=${pageSize}&page=${page}`
      );
      setTotalDoctorCount(response.data?.Doctors?.count);
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

  const doctorSearch = async () => {
    const updatedKeyword = isNaN(search) ? search : `+91${search}`;
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/doctor/getalldoctordata?pageSize=${pageSize}&page=${page}`,
        { keyword: updatedKeyword }
      );

      setTotalDoctors(response?.data?.pagination?.total || 0);
      setAllDoctors(response?.data?.doctors || 0);
    } catch (error) {
      setAllDoctors([]);
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim()) {
      doctorSearch();
    } else {
      fetchData();
    }
  }, [search, page, pageSize]);

  // block and unblock handler
  const { showAlert: showDoctorAlert, loading: blockUnblockDoctorLoading } =
    useBlockUnblock(fetchData);

  const exportToExcel = () => {
    const filteredDoctors = allDoctors.map((doctor, index) => ({
      No: index + 1,
      Name: doctor.name,
      Email: doctor.email,
      Phone: doctor.phone,
      Gender: doctor.gender,
      Address: doctor.address,
      Qualification: doctor.qualification,
      Specialization: doctor.specialization,
      Fees: doctor.fees,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredDoctors);
    const columnWidths = [
      { wpx: 50 },
      { wpx: 200 },
      { wpx: 250 },
      { wpx: 120 },
      { wpx: 150 },
      { wpx: 300 },
      { wpx: 150 },
      { wpx: 300 },
      { wpx: 150 },
    ];
    worksheet["!cols"] = columnWidths;

    const rowHeights = filteredDoctors.map(() => ({ hpx: 20 }));
    rowHeights.unshift({ hpx: 20 });
    worksheet["!rows"] = rowHeights;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doctors");
    XLSX.writeFile(workbook, "DoctorData.xlsx");
  };

  return (
    <div>
      <ScrollToTop />

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <Tippy content="Total Doctors">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp
                  start={0}
                  end={totalDoctorsCount}
                  duration={3}
                ></CountUp>
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

          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={exportToExcel}
            >
              <IconFile  className="ltr:mr-2 rtl:ml-2"/>

              Export to Excel
            </button>
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
                navigate(`/doctors/${row?.doctor_id}`, {
                  state: { previousUrl: location?.pathname },
                })
              }
              columns={[
                {
                  accessor: "No",
                  title: "No",
                  render: (row, rowIndex) => rowIndex + 1,
                },

                {
                  accessor: "photo",
                  title: "Photo",
                  render: (row) => (
                    <img
                      src={row?.photo ? imageBaseUrl + row?.photo : noProfile}
                      alt={row?.name}
                      className="w-10 h-10 rounded-[50%] object-cover"
                    />
                  ),
                },

                {
                  accessor: "name",
                  title: "Name",
                  cellsClassName: "capitalize",
                },
                { accessor: "email", title: "Email" },
                { accessor: "phone", title: "Phone" },
                {
                  accessor: "gender",
                  title: "Gender",
                  cellsStyle: { textTransform: "capitalize" },
                },
                // {
                //   accessor: "dateOfBirth",
                //   title: "Date of Birth",
                //   render: (row) => formatDate(row?.dateOfBirth),
                // },
                { accessor: "qualification", title: "Qualification" },
                { accessor: "specialization", title: "Specialization" },
                // { accessor: "address", title: "Address" },
                {
                  accessor: "fees",
                  title: "Fees",
                  render: (row) => `₹${row?.fees}`,
                },
                // {
                //   accessor: "visibility",
                //   title: "Visibility",
                //   render: (row) => (row.visibility ? "Visible" : "Hidden"),
                // },

                {
                  accessor: "Verification",
                  title: "Verification Status",
                  render: (row) => (
                    <span
                      key={row?.doctor_id}
                      className={`badge whitespace-nowrap capitalize ${
                        row?.verification_status === "verified"
                          ? "bg-success"
                          : row?.verification_status === "rejected"
                          ? "bg-danger"
                          : row?.verification_status === "under_verification"
                          ? "bg-secondary"
                          : row?.verification_status === "draft"
                          ? "bg-secondary"
                          : ""
                      }`}
                    >
                      {row?.verification_status.replace("_", " ")}
                    </span>
                  ),
                  cellsClassName: "capitalize",
                  textAlignment: "center",
                },
                // {
                //   accessor: "Actions",
                //   textAlignment: "center",
                //   render: (rowData) => (
                //     <CustomSwitch
                //       checked={rowData?.status}
                //       onChange={() =>
                //         showDoctorAlert(
                //           rowData?.user_id,
                //           rowData?.status ? "block" : "activate",
                //           "doctor"
                //         )
                //       }
                //       tooltipText={rowData?.status ? "Block" : "Unblock"}
                //       uniqueId={`clinic${rowData?.clinic_id}`}
                //       size="normal"
                //     />
                //   ),
                // },

                {
                  accessor: "Status",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex justify-center items-center">
                      <span
                        className={`text-sm font-medium ${
                          rowData?.status ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {rowData?.status ? "Active" : "Blocked"}
                      </span>
                    </div>
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

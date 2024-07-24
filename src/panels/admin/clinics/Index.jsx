import { useContext, useEffect, useState } from "react";
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
import NetworkHandler from "../../../utils/NetworkHandler";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";
import { handleGetLocation } from "../../../utils/getLocation";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import CustomSwitch from "../../../components/CustomSwitch";
import SubscriptionDetailsModal from "../../../components/SubscriptionDetailsModal/SubscriptionDetailsModal";
import { UserContext } from "../../../contexts/UseContext";
import * as XLSX from "xlsx";

const Clinics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(setPageTitle("Clinics"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [totalClinics, setTotalClinics] = useState(0);
  const [allClinics, setAllClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentClinicId, setCurrentClinicId] = useState("");
  const [subscriptionAddModal, setsubscriptionAddModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  // fetch Clininc function
  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getall?pageSize=${pageSize}&page=${page}`
      );
      setTotalClinics(response?.data?.Clinic?.count);
      setAllClinics(response?.data?.Clinic?.rows);
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

  const clinicSearch = async () => {
    const updatedKeyword = isNaN(search) ? search : `+91${search}`;
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/clinic/getallclinicdata?pageSize=1${pageSize}&page=${page}`,
        { keyword: updatedKeyword }
      );

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
      clinicSearch();
    } else {
      fetchData();
    }
  }, [search]);

  // block and unblock handler
  const { showAlert: showClinicAlert, loading: blockUnblockClinicLoading } =
    useBlockUnblock(fetchData);

  const handleSubButtonClick = (clinic) => {
    setCurrentClinicId(clinic.clinic_id);
    setsubscriptionAddModal(true);
  };

  const closeSubscriptionModal = () => {
    setsubscriptionAddModal(false);
    setSelectedPlan(null);
  };

  const exportToExcel = () => {
    const filteredClinics = allClinics.map((clinic, index) => ({
      No: index + 1,
      Name: clinic.name,
      Email: clinic.email,
      Phone: clinic.phone,
      Place: clinic.place,
      Address: clinic.address,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredClinics);
    const columnWidths = [
      { wpx: 50 },
      { wpx: 200 },
      { wpx: 250 },
      { wpx: 120 },
      { wpx: 150 },
      { wpx: 300 },
    ];
    worksheet["!cols"] = columnWidths;

    const rowHeights = filteredClinics.map(() => ({ hpx: 20 }));
    rowHeights.unshift({ hpx: 20 });
    worksheet["!rows"] = rowHeights;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clinics");
    XLSX.writeFile(workbook, "ClinicsData.xlsx");
  };

  return (
    <div>
      <ScrollToTop />
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
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                clinicSearch();
              }}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Search Clinic..."
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
              className="btn btn-green"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
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
                  accessor: "No",
                  title: "No",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                { accessor: "name", title: "Name" },
                { accessor: "email", title: "Email" },
                { accessor: "phone" },
                { accessor: "place", title: "Place" },
                { accessor: "address", title: "Address" },
                {
                  accessor: "clinic_id",
                  title: "Plan Details",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="grid place-items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubButtonClick(rowData);
                        }}
                        className="btn btn-green btn-sm py-1"
                      >
                        View Plan
                      </button>
                    </div>
                  ),
                },
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
                    <CustomSwitch
                      checked={rowData?.User?.status}
                      onChange={() =>
                        showClinicAlert(
                          rowData?.user_id,
                          rowData?.User?.status ? "block" : "activate",
                          "clinic"
                        )
                      }
                      tooltipText={rowData?.User?.status ? "Block" : "Unblock"}
                      uniqueId={`clinic${rowData?.clinic_id}`}
                      size="normal"
                    />
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
      <SubscriptionDetailsModal
        open={subscriptionAddModal}
        closeModal={closeSubscriptionModal}
        clinicId={currentClinicId}
      />
    </div>
  );
};

export default Clinics;

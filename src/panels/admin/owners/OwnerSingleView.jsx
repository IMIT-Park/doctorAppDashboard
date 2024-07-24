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
import NetworkHandler from "../../../utils/NetworkHandler";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";
import { handleGetLocation } from "../../../utils/getLocation";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import CustomSwitch from "../../../components/CustomSwitch";
import SubscriptionDetailsModal from "../../../components/SubscriptionDetailsModal/SubscriptionDetailsModal";
import IconSearch from "../../../components/Icon/IconSearch";

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
  const [subscriptionAddModal, setsubscriptionAddModal] = useState(false);
  const [currentClinicId, setCurrentClinicId] = useState("");
  const [search, setSearch] = useState("");
  // const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  //GET METHOD
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getallclinics/${ownerId}?page=${page}&pageSize=${pageSize}`
      );
      setTotalClinics(response.data?.Clinic?.count);
      setAllClinics(response.data?.Clinic?.rows);
      setClinics(response.data?.Clinic?.rows);
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

  // Get Search Clinics
  const fetchSearchClinics = async () => {
    const updatedKeyword = isNaN(search) ? search : `+91${search}`
    if (!search) {
      setClinics(allClinics); 
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/clinic/getclinicdata/${ownerId}?pageSize=${pageSize}&page=${page}`,
        { keyword: updatedKeyword }
      );
      if (response.status === 200) {
        const searchClinics = response?.data?.clinics || [];
        if (searchClinics.length > 0) {
          setClinics(searchClinics); 
        } else {
          setError("No data found for the search query.");
          setClinics([]); 
        }
      } else {
        setError("No Clinics found.");
        setClinics([]); 
      }
    } catch (error) {
      console.error("Error fetching Clinics:", error);
      setError("Error fetching Clinics.");
      setClinics([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerInfo();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      fetchSearchClinics();
    } else {
      fetchData();
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  // block and unblock handler
  const { showAlert: showOwnerAlert, loading: blockUnblockOwnerLoading } =
    useBlockUnblock(fetchOwnerInfo);
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

  console.log(allClinics);

  return (
    <div>
      <ScrollToTop />
      <button
        onClick={() => navigate(-1)}
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
            <div className="flex justify-between flex-wrap gap-4">
              <div className="text-3xl font-semibold capitalize text-green-700 ">
                {ownerInfo?.name || ""}
              </div>
              <CustomSwitch
                checked={ownerInfo?.User?.status}
                onChange={() =>
                  showOwnerAlert(
                    ownerInfo?.user_id,
                    ownerInfo?.User?.status ? "block" : "activate",
                    "owner"
                  )
                }
                tooltipText={ownerInfo?.User?.status ? "Block" : "Unblock"}
                uniqueId={`owner${ownerInfo?.owner_id}`}
                size="large"
              />
            </div>
            <div className="text-left">
              <div className="mt-5">
                <div className="flex lg:flex-row md:flex-col sm:flex-col flex-wrap gap-6 mb-2">
                  <div className="flex flex-col lg:w-7/12 w-full mb-5">
                    <div className="text-white-dark min-w-96 text-base mb-1">
                      Address
                    </div>
                    <div className="dark:text-slate-300 border dark:border-slate-800 rounded p-2 text-base h-36">
                      {ownerInfo?.address}
                    </div>
                  </div>
                  <div className="lg:w-4/12 w-full flex flex-col gap-4">
                    <div className="gap-1 mb-2 w-full">
                      <div className="text-white-dark text-base mb-1">
                        Email
                      </div>
                      <div className="dark:text-slate-300 border dark:border-slate-800 rounded p-2 text-base">
                        {ownerInfo?.email}
                      </div>
                    </div>
                    <div className="gap-1 mb-2 w-full">
                      <div className="text-white-dark text-base mb-1">
                        Phone Number
                      </div>
                      <div className="dark:text-slate-300 border dark:border-slate-800 rounded p-2 text-base">
                        {ownerInfo?.phone}
                      </div>
                    </div>
                  </div>
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
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchSearchClinics();
              }}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Search Clinic..."
                  className="form-input form-input-green shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    // setShowSuggestions(true);
                  }}
                  // onFocus={() => {
                  //   setShowSuggestions(true);
                  // }}
                  // onBlur={() => {
                  //   setTimeout(() => setShowSuggestions(false), 2000);
                  // }}
                />
                <button
                  type="submit"
                  className="btn btn-green absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center"
                >
                  <IconSearch className="mx-auto" />
                </button>
                {/* {showSuggestions && clinics.length > 0 && (
                  <ul className="z-10 absolute top-11 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-800 rounded-md w-full p-2 max-h-60 overflow-y-auto">
                    {error && search ? (
                      <li className="px-4 py-2 text-red-500 text-center">
                      {error}
                    </li>
                    ) : (
                      clinics?.length > 0 && 
                      clinics?.map((clinic) => (
                        <li
                        key={clinic?.clinic_id}
                        className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                        onMouseDown={() => handleSuggestionClick(clinic)}
                        >
                          {clinic?.name}{" "}
                        </li>
                      ))
                    )}
                  </ul>
                )} */}
              </div>
            </form>
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
              records={clinics}
              idAccessor="clinic_id"
              onRowClick={(row) =>
                navigate(`/clinics/${row?.clinic_id}`, {
                  state: { previousUrl: location?.pathname },
                })
              }
              columns={[
                {
                  accessor: "User.user_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                { accessor: "name", title: "Name" },
                { accessor: "phone", title: "Phone" },
                { accessor: "address", title: "Address" },
                { accessor: "User.email", title: "Email" },

                { accessor: "place", title: "Place" },
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

export default OwnerSingleView;

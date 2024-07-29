import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconPlus from "../../../components/Icon/IconPlus";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useLocation, useNavigate } from "react-router-dom";
import NetworkHandler from "../../../utils/NetworkHandler";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import { UserContext } from "../../../contexts/UseContext";
import CustomSwitch from "../../../components/CustomSwitch";

const Booking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userDetails, bookingDetails, setBookingDetails } =
    useContext(UserContext);
  const ownerId = userDetails?.UserOwner?.[0]?.owner_id || 0;
  useEffect(() => {
    dispatch(setPageTitle("Add Booking"));
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [allClinics, setAllClinics] = useState([]);
  const [totalClinics, setTotalClinics] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  // fetch function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getallclinics/${ownerId}?page=${page}&pagesize=${pageSize}`
      );
      setTotalClinics(response.data?.pageInfo.total);
      setAllClinics(response.data?.Clinic);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching Mds
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  // block and unblock handler
  const { showAlert: showClinicAlert, loading: blockUnblockClinicLoading } =
    useBlockUnblock(fetchData);


  const handleAddBooking = (clinicId) => {
    setBookingDetails({
      ...bookingDetails,
      clinic_id: clinicId,
      type: "walkin",
      whoIsBooking: "owner",
    });
    navigate("/clinic/bookings");
  };

  return (
    <div>
      <ScrollToTop />
      <div className="panel mt-1">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
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
              idAccessor="clinic.clinic_id"
              columns={[
                {
                  accessor: "",
                  title: "No",
                  render: (rowData, index) => (
                    <span>{(page - 1) * pageSize + index + 1}</span>
                  ),
                },
                { accessor: "clinic.name", title: "Name" },
                { accessor: "clinic.User.email", title: "Email" },

                { accessor: "clinic.phone", title: "Phone" },
                { accessor: "doctor_count", title: "Total Doctors" },

                // {
                //   accessor: "Actions",
                //   textAlignment: "center",
                //   render: (rowData) => (
                //     <div className="flex gap-6 items-center w-max mx-auto">
                //       <CustomSwitch
                //         checked={rowData?.User?.status}
                //         onChange={() =>
                //           showClinicAlert(
                //             rowData?.user_id,
                //             rowData?.User?.status ? "block" : "activate",
                //             "clinic"
                //           )
                //         }
                //         tooltipText={
                //           rowData?.User?.status ? "Block" : "Unblock"
                //         }
                //         uniqueId={`clinic${rowData?.clinic_id}`}
                //         size="normal"
                //       />

                //       <button
                //         type="button"
                //         onClick={(e) => {
                //           e.stopPropagation();
                //           handleAddBooking(rowData?.clinic_id);
                //         }}
                //         className="btn btn-green btn-sm py-1"
                //       >
                //         <IconPlus className="ltr:mr-2 rtl:ml-2" />
                //         Add Booking
                //       </button>
                //     </div>
                //   ),
                // },

                {
                  accessor: "clinic.User.status",
                  title: "status",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex items-center gap-2">
                      <span
                        className={`ml-2 ${
                          rowData?.clinic?.User?.status
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {rowData?.clinic?.User?.status ? "Active" : "Blocked"}
                      </span>
                    </div>
                  ),
                },

                {
                  accessor: "actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex gap-6 items-center w-max mx-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddBooking(rowData?.clinic?.clinic_id);
                        }}
                        className="btn btn-green btn-sm py-1"
                      >
                        <IconPlus className="ltr:mr-2 rtl:ml-2" />
                        Add Booking
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add your view booking handler here
                          navigate(
                            `/owner/bookings/${rowData?.clinic?.clinic_id}`
                          );
                        }}
                        className="btn btn-green btn-sm py-1.5 px-3.5"
                      >
                        View Booking
                      </button>
                    </div>
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

export default Booking;

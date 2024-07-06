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
import NetworkHandler from "../../../utils/NetworkHandler";
import { UserContext } from "../../../contexts/UseContext";
import CustomButton from "../../../components/CustomButton";
import AcceptRejectModal from "./AcceptRejectModal";
import Swal from "sweetalert2";

const Requests = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Requests"));
  });
  const { userDetails } = useContext(UserContext);
  const doctorId = userDetails?.UserDoctor?.[0]?.doctor_id || "";

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [allRequests, setAllRequests] = useState([]);
  const [accepRequestModal, setAcceptRequestModal] = useState(false);
  const [rejectRequestModal, setRejectRequestModal] = useState(false);
  const [acceptRequestResponse, setAcceptRequestResponse] = useState("");
  const [rejectionRequestResponse, setRejectionRequestResponse] = useState("");
  const [selectedRowData, setSelectedRowData] = useState();
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
        `/v1/doctor/getRequest/${doctorId}?page=${page}&pageSize=${pageSize}`
      );
      setTotalRequests(response?.data?.allRequest?.count);
      setAllRequests(response?.data?.allRequest?.rows);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const openAcceptRequestModal = (rowData) => {
    setSelectedRowData(rowData?.doctor_clinic_id);
    setAcceptRequestModal(true);
  };

  const closeAcceptRequestModal = () => {
    setAcceptRequestModal(false);
  };

  const openRejectRequestModal = (rowData) => {
    setSelectedRowData(rowData?.doctor_clinic_id);
    setRejectRequestModal(true);
  };

  const closeRejectRequestModal = () => {
    setRejectRequestModal(false);
  };

  //  doctor accept request
  const acceptRequest = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/doctor/acceptRequest/${selectedRowData}`
      );
      if (response.status === 201) {
        fetchData();
        Swal.fire({
          title: "Accepted!",
          text: "Request has been accepted.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    } catch (error) {
      setAcceptRequestResponse("Failed to accept request.");
    } finally {
      setLoading(false);
      closeAcceptRequestModal();
    }
  };

  // doctor reject request
  const rejectRequest = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/doctor/cancelRequest/${selectedRowData}`
      );
      if (response.status === 201) {
        fetchData();
        Swal.fire({
          title: "Rejected!",
          text: "Request has been rejected.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    } catch (error) {
      setRejectionRequestResponse("Failed to reject request.");
    } finally {
      setLoading(false);
      closeRejectRequestModal();
    }
  };

  // fetching Mds
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center gap-1 mb-3">
          <h5 className="font-semibold text-lg dark:text-white-light">
            Requests
          </h5>
          <Tippy content="Total Owners">
            <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
              <CountUp start={0} end={totalRequests} duration={3}></CountUp>
            </span>
          </Tippy>
        </div>
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Requests Found"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allRequests}
              idAccessor="clinic_id"
              columns={[
                {
                  accessor: "owner_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                {
                  accessor: "name",
                  title: "Name",
                  render: (row) => row?.Clinic?.name || "",
                },
                {
                  accessor: "email",
                  render: (row) => row?.Clinic?.email || "",
                },
                {
                  accessor: "phone",
                  render: (row) => row?.Clinic?.phone || "",
                },
                {
                  accessor: "address",
                  title: "Address",
                  render: (row) => row?.Clinic?.address || "",
                },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex gap-4 justify-center">
                      <CustomButton
                        onClick={(e) => {
                          e.stopPropagation();
                          openAcceptRequestModal(rowData);
                        }}
                      >
                        Accept
                      </CustomButton>
                      <CustomButton
                        className="btn btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          openRejectRequestModal(rowData);
                        }}
                      >
                        Reject
                      </CustomButton>
                    </div>
                  ),
                },
              ]}
              totalRecords={totalRequests}
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

      {/* request accept modal */}
      <AcceptRejectModal
        show={accepRequestModal}
        onConfirm={acceptRequest}
        onClose={closeAcceptRequestModal}
      />
      {/* request reject modal */}
      <AcceptRejectModal
        show={rejectRequestModal}
        onConfirm={rejectRequest}
        isReject={true}
        onClose={closeRejectRequestModal}
      />
    </div>
  );
};

export default Requests;

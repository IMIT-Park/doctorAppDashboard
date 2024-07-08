import { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import { showMessage } from "../../../utils/showMessage";
import IconEye from "../../../components/Icon/IconEye";
import NetworkHandler from "../../../utils/NetworkHandler";
import { UserContext } from "../../../contexts/UseContext";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Requests"));
  });

  const { userDetails } = useContext(UserContext);
  const doctorId = userDetails?.UserDoctor?.[0]?.doctor_id || "";
  const doctorclinicid = userDetails?.UserDoctor?.[0]?.doctor_clinic_id || "";
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);
  const [allRequests, setAllRequests] = useState([]);
  const [singleDetails, setSingleDetails] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      console.log(response);
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

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  // handle view modal
  const openDeleteModal = () => {
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const deleteUser = () => {
    showMessage("User has been deleted successfully.");
    setDeleteModal(false);
  };

  const openViewModal = (user) => {
    setSingleDetails(user);
    setViewModal(true);
  };

  const closeViewModal = () => {
    setViewModal(false);
  };

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
            Requests
            </h5>
            <Tippy content="Total Reports">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalRequests} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>
        </div>
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Reports to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allRequests}
              columns={[
                {
                  accessor: "No",
                  title: "NO",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                { accessor: "Clinic.email", title: "email" },
                {
                  accessor: "Clinic.name",
                  title: "Clinic Name",
                },
                {
                  accessor: "Clinic.phone",
                  title: "Phone",
                },
                {
                  accessor: "status",
                  title: "Status",
                },

                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData,index) => (
                    <div className="flex gap-4 justify-center">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        // openAcceptRequestModal(rowData);
                      }}>
                        Accept
                      </button>
                      <button 
                      // onClick={openRejectRequestModal}
                      >
                        Cancel
                      </button>
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
    </div>
  );
};

export default Requests;

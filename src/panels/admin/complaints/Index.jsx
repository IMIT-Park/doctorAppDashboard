import { Fragment, useEffect, useState } from "react";
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
import ViewReport from "./ViewReport";
import DeleteReport from "./DeleteReport";
import { formatDate } from "../../../utils/formatDate";
import NetworkHandler from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";
import IconEye from "../../../components/Icon/IconEye";

const Complaints = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Complaints"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [allComplaints, setAllComplaints] = useState([]);
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
        `/v1/complaint/getallComplaint?pageSize=${pageSize}&page=${page}`
      );
      console.log(response);
      setTotalComplaints(response?.data?.allComplaint?.count);
      setAllComplaints(response?.data?.allComplaint?.rows);
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
              Complaints
            </h5>
            <Tippy content="Total Reports">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalComplaints} duration={3}></CountUp>
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
              records={allComplaints}
              columns={[
                { accessor: "No", title: "NO",
                render: (row, rowIndex) => rowIndex + 1,},
                { accessor: "email", title: "email" },
                { accessor: "content", title: "content", ellipsis:true, width:350},
                { accessor: "phone", title: "phone" },

                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (user) => (
                    <div className="flex gap-4 items-center w-max mx-auto">
                      <Tippy content="View">
                        <button
                          className="flex hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openViewModal(user);
                          }}
                        >
                          <IconEye />
                        </button>
                      </Tippy>
                      <Tippy content="Delete">
                        <button
                          type="button"
                          className="flex hover:text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal();
                          }}
                        >
                          <IconTrashLines />
                        </button>
                      </Tippy>
                    </div>
                  ),
                },
              ]}
              totalRecords={totalComplaints}
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

      {/* view user modal */}
      <ViewReport open={viewModal} closeModal={closeViewModal}  details={singleDetails}/>

      {/* delete user modal */}
      <DeleteReport open={deleteModal} closeModal={closeDeleteModal} />
    </div>
  );
};

export default Complaints;

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
import { useNavigate } from "react-router-dom";
import NetworkHandler from "../../../utils/NetworkHandler";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import CustomSwitch from "../../../components/CustomSwitch";
import { UserContext } from "../../../contexts/UseContext";
import ModalRequests from "./ModalRequests";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("RequestsToDoctor"));
  });

  const { userDetails } = useContext(UserContext);
  const doctorId = userDetails?.UserDoctor?.[0]?.doctor_id || "";

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // const response = await NetworkHandler.makeGetRequest(
      //   `/v1/doctor/getRequest/${doctorId}?page=${page}&pageSize=${pageSize}`
      // );
      // setTotalRequests(response?.data?.allRequest?.count);
      // setAllRequests(response?.data?.allRequest?.rows);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const { showAlert: showOwnerAlert, loading: blockUnblockOwnerLoading } = useBlockUnblock(fetchData);

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center gap-1 mb-3">
          <h5 className="font-semibold text-lg dark:text-white-light">Requests</h5>
          <Tippy content="Total Owners">
            <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
              <CountUp start={0} end={totalRequests} duration={3}></CountUp>
            </span>
          </Tippy>

          <div className="ml-auto flex text-gray-500 font-semibold dark:text-white-dark gap-y-4 mb-3">
              <button
                type="button"
                className="btn btn-green"
                onClick={openModal}
              >
                Send Request
              </button>
          </div>
        </div>

        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Owners to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allRequests}
              onRowClick={(row) => navigate(`/admin/owners/${row?.owner_id}`)}
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
                },
                { accessor: "email" },
                { accessor: "phone" },
                { accessor: "address", title: "Address" },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="grid place-items-center">
                      <CustomSwitch
                        checked={rowData?.User?.status}
                        onChange={() =>
                          showOwnerAlert(
                            rowData?.user_id,
                            rowData?.User?.status ? "block" : "activate",
                            "owner"
                          )
                        }
                        tooltipText={
                          rowData?.User?.status ? "Block" : "Unblock"
                        }
                        uniqueId={`owner${rowData?.owner_id}`}
                        size="normal"
                      />
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

      <ModalRequests
        open={isModalOpen}
        closeModal={closeModal}
        fetchClinicData={fetchData}
        setButtonLoading={setButtonLoading}

      />
    </div>
  );
};

export default Requests;

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
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { UserContext } from "../../../contexts/UseContext";
import ModalRequests from "./ModalRequests";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("RequestsToDoctor"));
  });

  const { userDetails } = useContext(UserContext);
  const clinicId = userDetails?.UserClinic?.[0]?.clinic_id || "";

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEmail("");
  };
  // Get request
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/veiwRequest/${clinicId}?page=${page}&pageSize=${pageSize}`
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

          <div className="ml-auto flex text-gray-500 font-semibold dark:text-white-dark gap-y-4 mb-3">
            <button type="button" className="btn btn-green" onClick={openModal}>
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
              // onRowClick={(row) => navigate(`/admin/owners/${row?.owner_id}`)}
              idAccessor="doctor_clinic_id"
              columns={[
                {
                  accessor: "doctor_clinic_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                {
                  accessor: "Doctor.photo",
                  title: "Photo",
                  render: (row) =>
                    row?.Doctor?.photo ? (
                      <img
                        src={imageBaseUrl + row?.Doctor?.photo}
                        alt="Doctor's photo"
                        className="w-10 h-10 rounded-[50%]"
                      />
                    ) : (
                      "---"
                    ),
                },
                {
                  accessor: "Doctor.name",
                  title: "Name",
                  render: (row) => row?.Doctor?.name || "",
                },
                {
                  accessor: "email",
                  render: (row) => row?.Doctor?.email || "",
                },
                {
                  accessor: "phone",
                  render: (row) => row?.Doctor?.phone || "",
                },
                {
                  accessor: "address",
                  title: "Address",
                  render: (row) => row?.Doctor?.address || "",
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
        email={email}
        setEmail={setEmail}
        fetchClinicData={fetchData}
        setButtonLoading={setButtonLoading}
      />
    </div>
  );
};

export default Requests;

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
import { UserContext } from "../../../contexts/UseContext";
import CustomButton from "../../../components/CustomButton";
import Swal from "sweetalert2";
import DoctorRequestAccept from "../../../pages/DoctorSingleView/components/DoctorRequestAccept";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Requets"));
  });
  const { userDetails } = useContext(UserContext);
  const doctorId = userDetails?.UserDoctor?.[0]?.doctor_id || "";

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [allRequests, setAllRequests] = useState([]);
  const [accepRequestModal,setAcceptRequestModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
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

  const openAcceptRequestModal = () => {
    setAcceptRequestModal(true);
   }
  


 const closeAcceptRequestModal = () => {
  setAcceptRequestModal(false);
 }

  const showAlert = async () => {
    if (type === 10) {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result) => {
            if (result.value) {
                Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
            }
        });
    }
}
// const acceptRequest =async () => {
//   setLoading(true);
//   try {
//     const response = await NetworkHandler.makePostRequest(`v1/doctor/acceptRequest/${doctorId}`);
//     setLoading(false);
//   } catch (error) {
//     setLoading(false);
//   }
// }


// const showAlert = async (type: number) => {
//   if (type === 10) {
//       Swal.fire({
//           icon: 'warning',
//           title: 'Are you sure?',
//           text: "You won't be able to revert this!",
//           showCancelButton: true,
//           confirmButtonText: 'Delete',
//           padding: '2em',
//           customClass: 'sweet-alerts',
//       }).then((result) => {
//           if (result.value) {
//               Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', customClass: 'sweet-alerts' });
//           }
//       });
//   }
// }





  // fetching Mds
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  // block and unblock handler
  const { showAlert: showOwnerAlert, loading: blockUnblockOwnerLoading } =
    useBlockUnblock(fetchData);

  console.log(allRequests);

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
                { accessor: "email" ,
                  render: (row) => row?.Clinic?.email || "",
                },
                { accessor: "phone",
                  render: (row) => row?.Clinic?.phone || "",
                 },
                { accessor: "address", title: "Address",
                  render: (row) => row?.Clinic?.address || "",
                 },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex gap-4 justify-center">
                     <CustomButton 
                      onClick={openAcceptRequestModal}
                     >Accept</CustomButton>
                     <CustomButton>Cancel</CustomButton>
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
      <DoctorRequestAccept
      open={accepRequestModal}
      closeModal={closeAcceptRequestModal}
      />

    </div>
  );
};

export default Requests;

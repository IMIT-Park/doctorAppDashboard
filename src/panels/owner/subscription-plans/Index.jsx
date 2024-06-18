import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import NetworkHandler from "../../../utils/NetworkHandler";
import IconArrowLeft from "../../../components/Icon/IconArrowLeft";
import ModalSubscription from "./ModalSubscription";
import ScrollToTop from "../../../components/ScrollToTop";
import Tippy from "@tippyjs/react";
import CountUp from "react-countup";
import IconLoader from "../../../components/Icon/IconLoader";
import { DataTable } from "mantine-datatable";
import emptyBox from "/assets/images/empty-box.svg";
import IconMenuContacts from "../../../components/Icon/Menu/IconMenuContacts";
import subscriptionplans from "../subscription-plans/ModalSubscription";


const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [addModal, setAddModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [totalClinics, setTotalClinics] = useState(0);
  const [loading, setLoading] = useState(true);
const[allClinics,setAllClinics] = useState([]);


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
      `https://aeda-2405-201-f018-10d6-605d-8aa4-161b-1443.ngrok-free.app/api/v1/clinic/getallclinics/2?page=${page}&pagesize=${pageSize}`
    );
    setTotalClinics(response.data?.Clinic?.count);
    setAllClinics(response.data?.Clinic?.rows);
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


    // handle add modal
    const openAddModal = () => {
      setAddModal(true);
    };
  
    const closeAddModal = () => {
      setAddModal(false);
     
    };
  

  useEffect(() => {
    dispatch(setPageTitle("Pricing Tables"));
  }, [dispatch]);

  const [allPlans, setAllPlans] = useState([]);

  // useEffect(() => {
  //   fetchPlanDetails();
  // }, []);

  // const fetchPlanDetails = async () => {
  //   try {
  //     const response = await NetworkHandler.makeGetRequest(`/v1/plans/getallplans`);
  //     console.log(response.data);
  //     setAllPlans(response?.data?.Plans?.rows || []);
  //   } catch (error) {
  //     console.error("Error fetching plans:", error);
  //   }
  // };

  const handleBuyNowClick = (plan) => {
    
  };

  return (
    <div className="panel">

      {/* <ModalSubscription
      open={addModal}
      closeModal={closeAddModal}
      buttonLoading={buttonLoading}

      /> */}
      <ScrollToTop/>
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

export default SubscriptionPlans;

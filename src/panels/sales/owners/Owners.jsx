import { Fragment, useEffect, useState } from "react";
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

const Owners = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Owners"));
  }, []);

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const salespersonId = userData?.UserSalesperson?.[0]?.salesperson_id || 0;

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalOwners, setTotalOwners] = useState(0);
  const [allOwners, setAllOwners] = useState([]);
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
        `/v1/salesperson/getsalespersonid/${salespersonId}?page=${page}&pageSize=${pageSize}`
      );

      setTotalOwners(response?.data?.Owner?.count);
      setAllOwners(response?.data?.Owner?.rows);

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

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Owners
            </h5>
            <Tippy content="Total Users">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalOwners} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-start gap-1">
              <h5 className="text-base font-semibold dark:text-white-light">
                Active
              </h5>
              <label className="w-11 h-5 relative">
                <input
                  type="checkbox"
                  className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                  id="custom_switch_checkbox_active"
                  checked
                  readOnly
                />
                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
              </label>
            </div>
            <div className="flex items-start gap-1">
              <h5 className="text-base font-semibold dark:text-white-light">
                Not Active
              </h5>
              <label className="w-11 h-5 relative">
                <input
                  type="checkbox"
                  className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                  id="custom_switch_checkbox_active"
                  checked={false}
                  readOnly
                />
                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
              </label>
            </div>
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
              records={allOwners}
              idAccessor="owner_id"
              columns={[
                {
                  accessor: "owner_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                {
                  accessor: "name",
                  title: "Name",
                  cellsStyle: { textTransform: "capitalize" },
                },
                { accessor: "email" },
                { accessor: "phone" },
                {
                  accessor: "address",
                  title: "Address",
                  width: 220,
                  ellipsis: true,
                },
                {
                  accessor: "isActive",
                  title: "Active",
                  textAlignment: "center",
                  render: (user) => (
                    <label className="w-[46px] h-[22px] relative">
                      <input
                        type="checkbox"
                        className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                        id={`custom_switch_checkbox`}
                        checked={user.User?.status}
                        readOnly
                        disabled
                      />
                      <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                  ),
                },
              ]}
              totalRecords={totalOwners}
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

export default Owners;

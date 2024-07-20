import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import IconLoader from "../../../../components/Icon/IconLoader";
import ScrollToTop from "../../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate, useParams } from "react-router-dom";
import NetworkHandler from "../../../../utils/NetworkHandler";
import IconCaretDown from "../../../../components/Icon/IconCaretDown";
import useBlockUnblock from "../../../../utils/useBlockUnblock";
import CustomSwitch from "../../../../components/CustomSwitch";

const Owners = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { salesId } = useParams();

  useEffect(() => {
    dispatch(setPageTitle("Owners"));
  });
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
        `/v1/salesperson/getsalespersonid/${salesId}?page=${page}&pageSize=${pageSize}`
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

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  // block and unblock handler
  const { showAlert: showOwnerAlert, loading: blockUnblockOwnerLoading } =
    useBlockUnblock(fetchData);

  return (
    <div>
      <ScrollToTop />
      <button
        onClick={() => navigate("/admin/sales")}
        type="button"
        className="btn btn-green btn-sm -mt-4 mb-4"
      >
        <IconCaretDown className="w-4 h-4 rotate-90" />
      </button>
      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Owners by Sales Person
            </h5>
            <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
              <CountUp start={0} end={totalOwners} duration={3}></CountUp>
            </span>
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

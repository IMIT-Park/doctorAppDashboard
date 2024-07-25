import { useEffect, useState } from "react";
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
import IconSearch from "../../../components/Icon/IconSearch";
import { formatDate } from "../../../utils/formatDate";
import * as XLSX from "xlsx";

const Owners = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Owners"));
  }, [dispatch]);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalOwners, setTotalOwners] = useState(0);
  const [totalOwnersCount, setTotalOwnersCount] = useState(0);
  const [allOwners, setAllOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPage(1);
  }, [pageSize, search]);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/owner/getallowner?page=${page}&pageSize=${pageSize}`
      );

      setTotalOwnersCount(response?.data?.pageInfo?.total || 0);
      setTotalOwners(response?.data?.pageInfo?.total || 0);
      setAllOwners(response?.data?.Owners || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const ownerSearch = async () => {
    const updatedKeyword = isNaN(search) ? search : `+91${search}`;
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/owner/getownersearch?pageSize=${pageSize}&page=${page}`,
        { keyword: updatedKeyword }
      );
      setTotalOwners(response?.data?.pagination?.total || 0);
      setAllOwners(response?.data?.owners || []);
    } catch (error) {
      setAllOwners([]);
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim()) {
      ownerSearch();
    } else {
      fetchData();
    }
  }, [search, page, pageSize]);

  const { showAlert: showOwnerAlert, loading: blockUnblockOwnerLoading } =
    useBlockUnblock(fetchData);

  // Export to Excel function
  const exportToExcel = () => {
    const filteredOwners = allOwners.map((owner, index) => ({
      No: index + 1,
      Name: owner.name,
      Email: owner.email,
      Phone: owner.phone,
      Address: owner.address,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredOwners);
    const columnWidths = [
      { wpx: 50 },
      { wpx: 200 },
      { wpx: 250 },
      { wpx: 120 },
      { wpx: 300 },
    ];
    worksheet["!cols"] = columnWidths;

    const rowHeights = filteredOwners.map(() => ({ hpx: 20 }));
    rowHeights.unshift({ hpx: 20 });
    worksheet["!rows"] = rowHeights;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clinics");
    XLSX.writeFile(workbook, "ClinicsData.xlsx");
  };


  console.log(allOwners);

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Owners
            </h5>
            <Tippy content="Total Owners">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalOwnersCount} duration={3} />
              </span>
            </Tippy>
          </div>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ownerSearch();
              }}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Search Owners..."
                  className="form-input form-input-green shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-green absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center"
                >
                  <IconSearch className="mx-auto" />
                </button>
              </div>
            </form>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-green"
              onClick={exportToExcel}
            >
              Export to Excel
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
              records={allOwners}
              onRowClick={(row) => navigate(`/admin/owners/${row?.Owner.owner_id}`)}
              idAccessor="Owner.owner_id"
              columns={[
                {
                  accessor: "owner_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                {
                  accessor: "Owner.name",
                  title: "Name",
                  cellsClassName: "capitalize",
                },
                { accessor: "Owner.email", title: "Email" },
                { accessor: "Owner.phone", title: "Phone" },
                { accessor: "Owner.address", title: "Address" },
                {
                  accessor: "Owner.created_at",
                  title: "Account Creation Date",
                  textAlignment: "center",
                  render: (row) =>
                    row?.Owner?.created_at && formatDate(row?.Owner?.created_at),
                },
                {
                  accessor: "salesperson_name",
                  title: "Entered By",
                  render: (row) =>
                    row?.Owner?.salesperson_id
                      ? row?.Owner?.salesperson?.name || "Salesperson"
                      : "Application",
                },
                // {
                //   accessor: "Actions",
                //   textAlignment: "center",
                //   render: (rowData) => (
                //     <div className="grid place-items-center">
                //       <CustomSwitch
                //         checked={rowData?.User?.status}
                //         onChange={() =>
                //           showOwnerAlert(
                //             rowData?.user_id,
                //             rowData?.User?.status ? "block" : "activate",
                //             "owner"
                //           )
                //         }
                //         tooltipText={
                //           rowData?.User?.status ? "Block" : "Unblock"
                //         }
                //         uniqueId={`owner${rowData?.owner_id}`}
                //         size="normal"
                //       />
                //     </div>
                //   ),
                // },
                {
                  accessor: "Status",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex justify-center items-center">
                      <span
                        className={`text-sm font-medium ${
                          rowData?.Owner?.User?.status
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {rowData?.Owner?.User?.status ? "Active" : "Blocked"}
                      </span>
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
                `Showing ${from} to ${to} of ${totalRecords} entries`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Owners;

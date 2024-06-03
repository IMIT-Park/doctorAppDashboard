// import React from 'react'

// const ownerDoctor = () => {
//   return (
//     <div>
//       <p>Owner Doctors</p>
//     </div>
//   )
// }

// export default ownerDoctor

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Tippy from "@tippyjs/react";
import IconMenuScrumboard from "../../../components/Icon/Menu/IconMenuScrumboard";

const rowData = [
  {
    id: 1,
    firstName: "Caroline",
    lastName: "Jensen",
    email: "carolinejensen@zidant.com",
    date: "2004-05-28",
    phone: "+1 (821) 447-3782",
    status: "Pending",
  },
  {
    id: 2,
    firstName: "Celeste",
    lastName: "Grant",
    email: "celestegrant@polarax.com",
    date: "1989-11-19",
    phone: "+1 (838) 515-3408",
    status: "Completed",
  },
  {
    id: 3,
    firstName: "Tillman",
    lastName: "Forbes",
    email: "tillmanforbes@manglo.com",
    date: "2016-09-05",
    phone: "+1 (969) 496-2892",
    status: "Canceled",
  },
  {
    id: 4,
    firstName: "Daisy",
    lastName: "Whitley",
    email: "daisywhitley@applideck.com",
    date: "1987-03-23",
    phone: "+1 (861) 564-2877",
    status: "Completed",
  },
  {
    id: 5,
    firstName: "Weber",
    lastName: "Bowman",
    email: "weberbowman@volax.com",
    date: "1983-02-24",
    phone: "+1 (962) 466-3483",
    status: "Canceled",
  },
  {
    id: 6,
    firstName: "Buckley",
    lastName: "Townsend",
    email: "buckleytownsend@orbaxter.com",
    date: "2011-05-29",
    phone: "+1 (884) 595-2643",
    status: "Completed",
  },
];

const ownerDoctor = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = rowData.slice(0, pageSize);
  const [recordsData, setRecordsData] = useState(initialRecords);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(rowData.slice(from, to));
  }, [page, pageSize]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for day
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for month
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <div>
      <div className="panel">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
              <CountUp start={0} end={rowData.length} duration={3}></CountUp>
            </span>
          </div>

          <div className="flex items-right text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Add Doctor">
              <button
                type="button"
                className="btn btn-primary"
                // onClick={() => addUser()}
              >
                <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
                Add Doctor
              </button>
            </Tippy>
          </div>
        </div>
        <div className="datatables">
          <DataTable
            noRecordsText="No Transactons found"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={recordsData}
            columns={[
              { accessor: "id", title: "ID" },
              {
                accessor: "fullName",
                title: "Full Name",
                render: (rowData) => `${rowData.firstName} ${rowData.lastName}`,
              },
              { accessor: "email" },
              { accessor: "phone" },
              {
                accessor: "date",
                title: "Date",
                render: (rowData) => formatDate(rowData.date),
              },
            ]}
            totalRecords={rowData.length}
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
      </div>
    </div>
  );
};

export default ownerDoctor;

import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconEye from "../../../components/Icon/IconEye";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import Swal from "sweetalert2";
import MaskedInput from "react-text-mask";
import IconCoffee from "../../../components/Icon/IconCoffee";
import IconCalendar from "../../../components/Icon/IconCalendar";
import IconMapPin from "../../../components/Icon/IconMapPin";
import IconMail from "../../../components/Icon/IconMail";
import IconPhone from "../../../components/Icon/IconPhone";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate } from "react-router-dom";
import ViewReport from "./ViewReport";
import DeleteReport from "./DeleteReport";
import {formatDate} from "../../../utils/formatDate"

const rowData = [
  {
    id: 1,
    name: "Caroline Jensen",
    date: "2004-05-28",
    subject: "something else",
    description: "lorem ipsum nwefj djfvkjergk hefkjewgjbk jrhgkjrgkj",
  },
  {
    id: 2,
    name: "John Doe",
    date: "1990-12-15",
    subject: "another subject",
    description: "lorem ipsum qwejg kqjergkj eqhfkjqwhfbk jrhgkjrgkj",
  },
  {
    id: 3,
    name: "Alice Smith",
    date: "1985-07-03",
    subject: "one more thing",
    description: "lorem ipsum nwekjg kqjergkj eqhfkjqwhfbk jrhgkjrgkj",
  },
  {
    id: 4,
    name: "Michael Johnson",
    date: "1976-02-20",
    subject: "some other subject",
    description: "lorem ipsum qwejg djfvkjergk eqhfkjqwhfbk jrhgkjrgkj",
  },
  {
    id: 5,
    name: "Emily Brown",
    date: "1995-10-08",
    subject: "different topic",
    description: "lorem ipsum nwefj djfvkjergk eqhfkjqwhfbk jrhgkjrgkj",
  },
  {
    id: 6,
    name: "James Wilson",
    date: "1988-04-17",
    subject: "another subject",
    description: "lorem ipsum qwejg kqjergkj hefkjewgjbk jrhgkjrgkj",
  },
  {
    id: 7,
    name: "Emma Taylor",
    date: "2000-09-25",
    subject: "random thing",
    description: "lorem ipsum nwefj djfvkjergk hefkjewgjbk jrhgkjrgkj",
  },
  {
    id: 8,
    name: "David Martinez",
    date: "1983-11-30",
    subject: "topic of interest",
    description: "lorem ipsum qwejg kqjergkj eqhfkjqwhfbk jrhgkjrgkj",
  },
  {
    id: 9,
    name: "Olivia Thomas",
    date: "1999-06-12",
    subject: "important matter",
    description: "lorem ipsum nwefj kqjergkj eqhfkjqwhfbk jrhgkjrgkj",
  },
  {
    id: 10,
    name: "Daniel Anderson",
    date: "1992-03-05",
    subject: "urgent issue",
    description: "lorem ipsum qwejg djfvkjergk hefkjewgjbk jrhgkjrgkj",
  },
];

const Reports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Reports"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = rowData.slice(0, pageSize);
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [addUserModal, setAddUserModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(rowData.slice(from, to));
  }, [page, pageSize]);

  // handle view modal
  const openViewModal = () => {
    setViewModal(true);
  };
  const closeViewModal = () => {
    setViewModal(false);
  };

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

  const showMessage = (msg = "", type = "success") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };


  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Reports
            </h5>
            <Tippy content="Total Reports">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp start={0} end={rowData.length} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>
        </div>
        {/* <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" /> */}
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
            records={recordsData}
            columns={[
              { accessor: "id", title: "ID" },
              { accessor: "name", title: "Name" },
              { accessor: "date", render: (row) => formatDate(row?.date) },
              { accessor: "subject" },
              { accessor: "description", width: 220, ellipsis: true },
              {
                accessor: "Actions",
                textAlignment: "center",
                render: (rowData) => (
                  <div className="flex gap-4 items-center w-max mx-auto">
                    <Tippy content="View">
                      <button
                        className="flex hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewModal(true);
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

      {/* view user modal */}
      <ViewReport open={viewModal} closeModal={closeViewModal} />

      {/* delete user modal */}
      <DeleteReport open={deleteModal} closeModal={closeDeleteModal} />
    </div>
  );
};

export default Reports;

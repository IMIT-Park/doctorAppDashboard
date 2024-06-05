import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconEdit from "../../../components/Icon/IconEdit";
import Swal from "sweetalert2";
import IconPlus from '../../../components/Icon/IconPlus';
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { Link, useNavigate } from "react-router-dom";
import AddClinic from "./AddClinic";
import DeleteClinic from "./DeleteClinic";
import NetworkHandler from "../../../utils/NetworkHandler";


const Clinics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Clinics"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [allClinics, setAllClinics] = useState([]);
  const [totalClinics,setTotalClinics] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);


 // fetch function
 const fetchData = async () => {
  try {
    const response = await NetworkHandler.makeGetRequest(
      `/v1/clinic/getall?pageSize=${pageSize}&page=${page}`
    );
    console.log(response)
    // setTotalClinics(response.data?.data?.count);
    // setAllClinics(response.data?.data?.mdsList);
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
  // handle add modal
  const openAddModal = () => {
    setAddModal(true);
  };

  const closeAddModal = () => {
    setAddModal(false);
    setInput({
      ...input,
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    });
  };


  // handle Delete Modal
  const openDeleteConfirmModal = () => {
    setDeleteModal(true);
  };
  const closeDeleteConfirmModal = () => {
    setDeleteModal(false);
  };

  const deleteUser = () => {
    showMessage("User has been deleted successfully.");
    setDeleteModal(false);
  };

  const showMessage = (msg = "", type = "success") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      showCloseButton: true,
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
      <div className="panel mt-1">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Clinics
            </h5>
            <Tippy content="Total Clinics">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                {/* <CountUp start={0} end={rowData.length} duration={3}></CountUp> */}
              </span>
            </Tippy>
          </div>
          <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Add Clinic">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openAddModal()}
              >
                <IconPlus className="ltr:mr-2 rtl:ml-2" />
                Add Clinic
              </button>
            </Tippy>
          </div>
        </div>
        {/* <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" /> */}
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
            // records={recordsData}
            onRowClick={() => navigate("/admin/owners/clinics/doctors")}
            columns={[
              { accessor: "id", title: "ID" },
              {
                accessor: "firstName",
                title: "Name",
                render: (row) => row.firstName + " " + row.lastName,
              },
              { accessor: "email" },
              // { accessor: "email", title: "Username" },
              { accessor: "phone" },
              { accessor: "address.street", title: "Address" },
              {
                accessor: "Actions",
                textAlignment: "center",
                render: (rowData) => (
                  <div className="flex gap-4 items-center w-max mx-auto">
                    <Tippy content="Edit">
                      <button
                        className="flex hover:text-info"
                        onClick={(e) => {
                          e.stopPropagation();
                          addUser();
                        }}
                      >
                        <IconEdit className="w-4.5 h-4.5" />
                      </button>
                    </Tippy>
                    <Tippy content="Delete">
                      <button
                        type="button"
                        className="flex hover:text-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirmModal();
                        }}
                      >
                        <IconTrashLines />
                      </button>
                    </Tippy>
                  </div>
                ),
              },
            ]}
            // totalRecords={rowData.length}
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
      {/* add sales person modal */}
      <AddClinic
        open={addModal}
        closeModal={closeAddModal}
      />

      {/* delete sales person modal */}
      <DeleteClinic
        open={deleteModal}
        closeModal={closeDeleteConfirmModal}
      />
    </div>
  );
};

export default Clinics;

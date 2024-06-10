import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";

import Swal from "sweetalert2";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../../components/Icon/IconLoader";
import ScrollToTop from "../../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate, useParams } from "react-router-dom";
import NetworkHandler from "../../../../utils/NetworkHandler";

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

  const addUser = () => {
    setAddUserModal(true);
  };

  const saveUser = () => {
    // if (!params.name) {
    //     showMessage('Name is required.', 'error');
    //     return true;
    // }
    showMessage("User has been saved successfully.");
    setAddUserModal(false);
  };

  const deleteConfirm = () => {
    setDeleteModal(true);
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

  // fetch function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/salesperson/getsalespersonid/${10}?page=${page}&pageSize=${pageSize}`
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

  //  block or unblock handler
  const handleActiveUser = async (userId) => {
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/auth/activate/${userId}`
      );
      fetchData();
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    }
  };

  const showBlockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to block this Owner!",
      showCancelButton: true,
      confirmButtonText: "Block",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleActiveUser(id);
        Swal.fire({
          title: "Blocked!",
          text: "The Owner has been blocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  const showUnblockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to unblock this Owner!",
      showCancelButton: true,
      confirmButtonText: "Unblock",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleActiveUser(id);
        Swal.fire({
          title: "Unblocked!",
          text: "The Owner has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Ownerssss
            </h5>
            <Tippy content="Total Owners">
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
                Blocked
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
                },
                { accessor: "email" },
                { accessor: "phone" },
                { accessor: "address", title: "Address" },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <Tippy content="Block/Unblock">
                      <label
                        className="w-[46px] h-[22px] relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (rowData?.User?.status) {
                            showBlockAlert(rowData?.user_id);
                          } else {
                            showUnblockAlert(rowData?.user_id);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                          id={`custom_switch_checkbox${rowData.owner_id}`}
                          checked={rowData?.User?.status}
                          readOnly
                        />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                      </label>
                    </Tippy>
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

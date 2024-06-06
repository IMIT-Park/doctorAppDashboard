import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconEdit from "../../../components/Icon/IconEdit";
import Swal from "sweetalert2";
import IconUserPlus from "../../../components/Icon/IconUserPlus";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { Link, useNavigate } from "react-router-dom";
import AddSalesPerson from "./AddSalesPerson";
import DeleteSalesPerson from "./DeleteSalesPerson";
import IconEye from "../../../components/Icon/IconEye";
import ShowSalesPerson from "./ShowSalesPerson";
import NetworkHandler from "../../../utils/NetworkHandler";

const Sales = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Sales Teams"));
  }, [dispatch]);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [recordsData, setRecordsData] = useState([]);
  const [addSalesPersonModal, setAddSalesPersonModal] = useState(false);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
  const [editSalesPersonModal, setEditSalesPersonModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [allSalesPerson, setAllSalesPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState({
    name: "",
    email: "",
    user_name: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [emailError, setEmailError] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);
  const [singleDetails,setSingleDetails] = useState({})

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(allSalesPerson.slice(from, to));
  }, [page, pageSize, allSalesPerson]);

  const openAddSalesPersonModal = () => {
    setAddSalesPersonModal(true);
    
  };

  const closeAddSalesPersonModal = () => {
    setAddSalesPersonModal(false);
    setInput({
      ...input,
      name: "",
      email: "",
      user_name: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    });
    setEmailError("");
  };

  //GET METHOD
  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/salesperson/getallsalespersons?page=${page}&pagesize=${pageSize}`
      );
      console.log(response.data?.Salesperson?.rows);
      console.log(response.data?.pageInfo);

      setAllSalesPerson(response.data?.Salesperson?.rows);
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

  //POST METHOD
  const saveSalesPerson = async () => {
    if (
      !input.name ||
      !input.email ||
      !input.user_name ||
      !input.phone ||
      !input.address ||
      !input.password ||
      !input.confirmPassword
    ) {
      showMessage("Please fill in all required fields", "error");
      return true;
    }

    if (input.password !== input.confirmPassword) {
      showMessage("Passwords do not match", "error");
      return true;
    }
    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/salesperson/createsalesperson",
        input
      );
      setAddSalesPersonModal(false);

      if (response.status === 201) {
        showMessage("Sales Person has been added successfully.");
        closeAddSalesPersonModal();
        fetchData();
      } else {
        showMessage("Failed to add sales person. Please try again.", "error");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showMessage("Email already exists.", "error");
      } else {
        showMessage("Failed to add sales person. Please try again.", "error");
      }
    }
  };

  const updateSalesPerson = async () => {
    if (!selectedSalesPerson) {
      // Handle error: No salesperson selected for update
      showMessage("No salesperson selected for update", "error");
      return;
    }

    if (
      !input.name ||
      !input.email ||
      !input.user_name ||
      !input.phone ||
      !input.address
    ) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/salesperson/updatesalesperson/${selectedSalesPerson.salesperson_id}`,
        input
      );

      if (response.status === 200) {
        showMessage("Salesperson has been updated successfully.");
        closeEditModal();
        fetchData(); // Refetch data to update the UI
      } else {
        showMessage("Failed to update salesperson. Please try again.", "error");
      }
    } catch (error) {
      showMessage("Failed to update salesperson. Please try again.", "error");
    }
  };

  // const openDeleteConfirmModal = () => {
  //   setDeleteModal(true);
  // };

  // const closeDeleteConfirmModal = () => {
  //   setDeleteModal(false);
  // };

  // const deleteUser = () => {
  //   setDeleteModal(false);
  //   showMessage("User has been deleted successfully.");
  // };

  const openEditModal = (salesPerson) => {
    setSelectedSalesPerson(salesPerson);
    setEditSalesPersonModal(true);
    setInput({
      name: salesPerson.name,
      email: salesPerson.email,
      user_name: salesPerson.user_name,
      phone: salesPerson.phone,
      address: salesPerson.address,
      password: "", // Assuming password should not be editable
      confirmPassword: "", // Assuming password should not be editable
    });
  };

  const closeEditModal = () => {
    setEditSalesPersonModal(false);
    setSelectedSalesPerson(null);
    setInput({
      ...input,
      name: "",
      email: "",
      user_name: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    });
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

  const openViewModal = (user) => {
    setSingleDetails(user);
    setViewModal(true);
  };

  const closeViewModal = () => {
    setViewModal(false);
  };

  return (
    <div>
      <ScrollToTop />
      <div className="panel mt-1">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Sales Teams
            </h5>
            <Tippy content="Total Sales Team">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={allSalesPerson.length} duration={3} />
              </span>
            </Tippy>
          </div>
          <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Add Sales Person">
              <button
                type="button"
                className="btn btn-primary"
                onClick={openAddSalesPersonModal}
              >
                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                Add Sales Person
              </button>
            </Tippy>
          </div>
        </div>
        <div className="datatables">
          {loading ? (
            <div className="flex justify-center items-center">
              <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
            </div>
          ) : (
            <DataTable
              noRecordsText="No Salespersons to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={recordsData}
              idAccessor="salesperson_id"
              columns={[
                {
                  accessor: "salesperson_id",
                  title: "ID",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                { accessor: "name", title: "Name" },
                { accessor: "email", title: "Email" },
                { accessor: "phone", title: "Phone" },
                { accessor: "address", title: "Address" },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (user) => (
                    <div className="flex gap-4 items-center w-max mx-auto">
                      <Tippy content="Edit">
                        <button
                          className="flex hover:text-info"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(user);
                          }}
                        >
                          <IconEdit className="w-4.5 h-4.5" />
                        </button>
                      </Tippy>
                      <Tippy content="View">
                        <button
                          className="flex hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openViewModal(user);
                          }}
                        >
                          <IconEye />
                        </button>
                      </Tippy>
                      <Tippy content="Unblocked/Blocked">
                        <label className="w-[46px] h-[22px] relative">
                          <input
                            type="checkbox"
                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                            id={`custom_switch_checkbox`}
                            checked={user.isActive}
                          />
                          <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                        </label>
                      </Tippy>
                    </div>
                  ),
                },
              ]}
              totalRecords={allSalesPerson.length}
              recordsPerPage={pageSize}
              page={page}
              onPageChange={setPage}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setPageSize}
              minHeight={200}
              paginationText={({ from, to, totalRecords }) =>
                `Showing ${from} to ${to} of ${totalRecords} entries`
              }
            />
          )}
        </div>
      </div>
      <AddSalesPerson
        open={addSalesPersonModal}
        closeModal={closeAddSalesPersonModal}
        input={input}
        setInput={setInput}
        formSubmit={saveSalesPerson}
        buttonLoading={buttonLoading}
        setButtonLoading={setButtonLoading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showComfirmPassword={showComfirmPassword}
        setShowComfirmPassword={setShowComfirmPassword}
        emailError={emailError}
        setEmailError={setEmailError}
        // handleEmailChange={handleEmailChange}
      />
      <AddSalesPerson
        open={editSalesPersonModal} // Ensure the open prop is provided here
        closeModal={closeEditModal}
        input={input}
        setInput={setInput}
        formSubmit={updateSalesPerson}
        isEditMode={true}
        buttonLoading={buttonLoading}
        setButtonLoading={setButtonLoading}
      />
      <ShowSalesPerson open={viewModal} closeModal={closeViewModal}  details={singleDetails}/>
    </div>
  );
};

export default Sales;

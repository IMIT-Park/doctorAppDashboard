import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconEdit from "../../../components/Icon/IconEdit";
import IconUserPlus from "../../../components/Icon/IconUserPlus";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate } from "react-router-dom";
import AddSalesPerson from "./AddSalesPerson";
import IconEye from "../../../components/Icon/IconEye";
import ShowSalesPerson from "./ShowSalesPerson";
import NetworkHandler from "../../../utils/NetworkHandler";
import { showMessage } from "../../../utils/showMessage";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import CustomSwitch from "../../../components/CustomSwitch";
import CustomButton from "../../../components/CustomButton";
import { UserContext } from "../../../contexts/UseContext";
import * as XLSX from "xlsx";

const Sales = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ids, setIds } = useContext(UserContext);

  useEffect(() => {
    dispatch(setPageTitle("Sales Teams"));
  }, [dispatch]);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [addSalesPersonModal, setAddSalesPersonModal] = useState(false);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
  const [editSalesPersonModal, setEditSalesPersonModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [totalSaleperson, setTotalSalesPerson] = useState(0);
  const [totalSalespersonsCount, setTotalSalespersonsCount] = useState(0);
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
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);
  const [singleDetails, setSingleDetails] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

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
    setErrors(null);
  };

  // get all Sales-Persons function
  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/salesperson/getallsalespersons?page=${page}&pageSize=${pageSize}`
      );
      console.log(response);
      setTotalSalesPerson(response.data?.pageInfo?.total);
      setTotalSalespersonsCount(response.data?.pageInfo?.total);
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

  const validate = () => {
    const newErrors = {};
    if (input.password !== input.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      showMessage("Passwords do not match", "warning");
    }
    if (input.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      showMessage("Phone number must be exactly 10 digits", "warning");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Add Sales Person function
  const saveSalesPerson = async () => {
    if (
      !input.name ||
      !input.email ||
      !input.phone ||
      !input.address ||
      !input.password ||
      !input.confirmPassword
    ) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }
    if (validate()) {
      setButtonLoading(true);

      const updatedData = {
        ...input,
        phone: `+91${input.phone}`,
        user_name: input?.email,
      };
      try {
        const response = await NetworkHandler.makePostRequest(
          "/v1/salesperson/createsalesperson",
          updatedData
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
          showMessage(
            error?.response?.data?.error == "User Already Exists"
              ? "Username Already Exists"
              : "Email already exists.",
            "error"
          );
        } else {
          showMessage("Failed to add sales person. Please try again.", "error");
        }
      } finally {
        setButtonLoading(false);
      }
    }
  };

  const updateSalesPerson = async () => {
    if (!selectedSalesPerson) {
      showMessage("No salesperson selected for update", "error");
      return;
    }

    if (!input.name || !input.phone || !input.address) {
      showMessage("Please fill in all required fields", "error");
      return;
    }
    if (validate()) {
      setButtonLoading(true);

      const updatedData = {
        ...input,
        phone: `+91${input.phone}`,
      };
      try {
        const response = await NetworkHandler.makePutRequest(
          `/v1/salesperson/updatesalesperson/${selectedSalesPerson.salesperson_id}`,
          updatedData
        );

        if (response.status === 200) {
          showMessage("Salesperson has been updated successfully.");
          closeEditModal();
          fetchData();
        } else {
          showMessage(
            "Failed to update salesperson. Please try again.",
            "error"
          );
        }
      } catch (error) {
        showMessage("Failed to update salesperson. Please try again.", "error");
      } finally {
        setButtonLoading(false);
      }
    }
  };

  const openEditModal = (salesPerson) => {
    const phoneWithoutCountryCode = salesPerson.phone.replace(/^\+91/, "");
    setSelectedSalesPerson(salesPerson);
    setEditSalesPersonModal(true);
    setInput({
      name: salesPerson?.name,
      phone: phoneWithoutCountryCode,
      address: salesPerson?.address,
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
    setErrors(null);
  };

  const openViewModal = (user) => {
    setSingleDetails(user);
    setViewModal(true);
  };

  const closeViewModal = () => {
    setViewModal(false);
  };

  // block and unblock handler
  const { showAlert: showSalesAlert, loading: blockUnblockSalesLoading } =
    useBlockUnblock(fetchData);

  const handleRowClick = (salespersonId) => {
    setIds({ ...ids, salespersonId: salespersonId });
    navigate(`/admin/sales/owners`);
  };

  // Export to Excel function
  const exportToExcel = () => {
    const filteredSales = allSalesPerson.map((sales, index) => ({
      No: index + 1,
      Name: sales.name,
      Email: sales.email,
      Phone: sales.phone,
      Address: sales.address,
      UserName: sales.User.user_name,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredSales);
    const columnWidths = [
      { wpx: 50 },
      { wpx: 200 },
      { wpx: 250 },
      { wpx: 120 },
      { wpx: 300 },
      { wpx: 300 },
    ];
    worksheet["!cols"] = columnWidths;

    const rowHeights = filteredSales.map(() => ({ hpx: 20 }));
    rowHeights.unshift({ hpx: 20 });
    worksheet["!rows"] = rowHeights;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clinics");
    XLSX.writeFile(workbook, "SalesPersonData.xlsx");
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
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalSalespersonsCount} duration={3} />
              </span>
            </Tippy>
          </div>

          <div className="flex items-center ml-auto text-gray-500 font-semibold  dark:text-white-dark gap-2">
            <CustomButton onClick={openAddSalesPersonModal}>
              <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
              Add Sales Person
            </CustomButton>
         
            <button
              type="button"
              className="btn btn-green"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        </div>
        <div className="datatables">
          {loading ? (
            <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
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
              records={allSalesPerson}
              idAccessor="salesperson_id"
              onRowClick={(row) => handleRowClick(row?.salesperson_id)}
              columns={[
                {
                  accessor: "salesperson_id",
                  title: "ID",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                {
                  accessor: "name",
                  title: "Name",
                  cellsClassName: "capitalize",
                },
                { accessor: "email", title: "Email" },
                {
                  accessor: "user_name",
                  title: "Username",
                  render: (row) => row?.User?.user_name,
                },
                { accessor: "phone", title: "Phone" },
                { accessor: "address", title: "Address" },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (user) => (
                    <div className="flex gap-6 items-center w-max mx-auto">
                      <CustomSwitch
                        checked={user?.User?.status}
                        onChange={() =>
                          showSalesAlert(
                            user?.user_id,
                            user?.User?.status ? "block" : "activate",
                            "sales person"
                          )
                        }
                        tooltipText={user?.User?.status ? "Block" : "Unblock"}
                        uniqueId={`sales${user?.owner_id}`}
                        size="normal"
                      />
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
                    </div>
                  ),
                },
              ]}
              totalRecords={totalSaleperson}
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
        errors={errors}
        setErrors={setErrors}
      />
      <AddSalesPerson
        open={editSalesPersonModal}
        closeModal={closeEditModal}
        input={input}
        setInput={setInput}
        formSubmit={updateSalesPerson}
        isEditMode={true}
        buttonLoading={buttonLoading}
        setButtonLoading={setButtonLoading}
        errors={errors}
        setErrors={setErrors}
      />
      <ShowSalesPerson
        open={viewModal}
        closeModal={closeViewModal}
        details={singleDetails}
      />
    </div>
  );
};

export default Sales;

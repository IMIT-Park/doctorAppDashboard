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
import NetworkHandler from "../../../utils/NetworkHandler";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import IconUserPlus from "../../../components/Icon/IconUserPlus";
import AddSupportUser from "./AddSupportUser";
import IconEdit from "../../../components/Icon/IconEdit";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import { showMessage } from "../../../utils/showMessage";
import CustomSwitch from "../../../components/CustomSwitch";
import CustomButton from "../../../components/CustomButton";
import DeleteSupportPerson from "../../../components/CustomDeleteModal";

const SupportUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Support User"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalSupportUsers, setTotalSupportUsers] = useState(0);
  const [allSupportUsers, setAllSupportUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [supportPersonId, setSupportPersonId] = useState("");
  const [input, setInput] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    user_name: "",
    password: "",
    confirmPassword: "",
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
        `/v1/supportuser/getallSupportuser?pageSize=${pageSize}&page=${page}`
      );

      setTotalSupportUsers(response?.data?.Supportuser?.count);
      setAllSupportUsers(response?.data?.Supportuser?.rows);
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

  // add modal handler
  const openAddModal = () => {
    setAddModal(true);
  };

  const closeAddModal = () => {
    setInput({
      ...input,
      name: "",
      phone: "",
      address: "",
      email: "",
      user_name: "",
      password: "",
      confirmPassword: "",
    });
    setErrors(null);
    setAddModal(false);
  };

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

  //Add Support User function
  const addSupportUser = async () => {
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
          "/v1/supportuser/createSupportuser",
          updatedData
        );

        if (response.status === 201) {
          showMessage("Support User added successfully.");
          setButtonLoading(false);
          closeAddModal();
          fetchData();
        } else {
          showMessage("Failed to add support user. Please try again.", "error");
          setButtonLoading(false);
        }
      } catch (error) {
        setButtonLoading(false);
        if (error.response && error.response.status === 403) {
          showMessage(
            error?.response?.data?.error == "User Already Exists"
              ? "Username Already Exists"
              : "Email already exists.",
            "error"
          );
        } else {
          showMessage("An error occurred. Please try again.", "error");
        }
      } finally {
        setButtonLoading(false);
      }
    }
  };

  // edit modal handler
  const openEditModal = (rowData) => {
    const phoneWithoutCountryCode = rowData.phone.replace(/^\+91/, "");

    setSupportPersonId(rowData?.supportuser_id || "");
    setInput({
      name: rowData?.name || "",
      phone: phoneWithoutCountryCode || "",
      address: rowData?.address || "",
    });
    setEditModal(true);
  };

  const closeEditModal = () => {
    setSupportPersonId("");
    setInput({
      ...input,
      name: "",
      phone: "",
      address: "",
      email: "",
      user_name: "",
      password: "",
      confirmPassword: "",
    });
    setErrors(null);
    setEditModal(false);
  };

  //Edit support user function
  const editSupportUser = async () => {
    if (!input.name || !input.phone || !input.address) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    if (validate()) {
      setButtonLoading(true);

      const updatedData = {
        ...input,
        phone: `+91${input.phone}`,
      };

      try {
        const response = await NetworkHandler.makePutRequest(
          `/v1/supportuser/updateSupportuser/${supportPersonId}`,
          updatedData
        );
        if (response.status === 200) {
          showMessage("Support User updated successfully.");
          setButtonLoading(false);
          closeEditModal();
          fetchData();
        } else {
          showMessage(
            "Failed to update support user. Please try again.",
            "error"
          );
          setButtonLoading(false);
        }
      } catch (error) {
        setButtonLoading(false);
        if (error.response && error.response.status === 403) {
          showMessage("Email already exists.", "error");
        } else {
          showMessage("An error occurred. Please try again.", "error");
        }
      } finally {
        setButtonLoading(false);
      }
    }
  };

  // edit modal handler
  const openDeleteModal = (rowData) => {
    setSupportPersonId(rowData?.supportuser_id || "");
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSupportPersonId("");
    setDeleteModal(false);
  };

  const deleteSupportUser = async () => {
    setButtonLoading(true);
    try {
      const response = await NetworkHandler.makeDeleteRequest(
        `/v1/supportuser/deleteSupportuser/${supportPersonId}`,
        input
      );
      if (response.status === 201) {
        showMessage("Support User Deleted successfully.");
        setButtonLoading(false);
        closeDeleteModal();
        fetchData();
      } else {
        showMessage(
          "Failed to delete support user. Please try again.",
          "error"
        );
        setButtonLoading(false);
      }
    } catch (error) {
      setButtonLoading(false);

      showMessage("An error occurred. Please try again.", "error");
    } finally {
      setButtonLoading(false);
    }
  };

  // block and unblock handler
  const { showAlert: showSupportAlert, loading: blockUnblockSupportLoading } =
    useBlockUnblock(fetchData);

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Support User
            </h5>
            <Tippy content="Total Owners">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp
                  start={0}
                  end={totalSupportUsers}
                  duration={3}
                ></CountUp>
              </span>
            </Tippy>
          </div>
          <CustomButton onClick={openAddModal}>
            <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
            Add Support User
          </CustomButton>
        </div>
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Support user to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allSupportUsers}
              idAccessor="supportuser_id"
              columns={[
                {
                  accessor: "supportuser_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                {
                  accessor: "name",
                  title: "Name",
                  cellsClassName: "capitalize",
                },
                { accessor: "email" },
                { accessor: "phone" },
                { accessor: "address", title: "Address" },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex gap-5 items-center w-max mx-auto">
                      <CustomSwitch
                        checked={rowData?.User?.status}
                        onChange={() =>
                          showSupportAlert(
                            rowData?.user_id,
                            rowData?.User?.status ? "block" : "activate",
                            "support user"
                          )
                        }
                        tooltipText={
                          rowData?.User?.status ? "Block" : "Unblock"
                        }
                        uniqueId={`support${rowData?.supportuser_id}`}
                        size="normal"
                      />
                      <Tippy content="Edit">
                        <button
                          className="flex hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(rowData);
                          }}
                        >
                          <IconEdit className="w-[18px]" />
                        </button>
                      </Tippy>
                      <Tippy content="Delete">
                        <button
                          type="button"
                          className="flex hover:text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(rowData);
                          }}
                        >
                          <IconTrashLines />
                        </button>
                      </Tippy>
                    </div>
                  ),
                },
              ]}
              totalRecords={totalSupportUsers}
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
      {/* add support user modal */}
      <AddSupportUser
        open={addModal}
        closeModal={closeAddModal}
        input={input}
        setInput={setInput}
        buttonLoading={buttonLoading}
        formSubmit={addSupportUser}
        errors={errors}
        setErrors={setErrors}
      />

      {/* edit support user modal */}
      <AddSupportUser
        open={editModal}
        closeModal={closeEditModal}
        input={input}
        setInput={setInput}
        buttonLoading={buttonLoading}
        formSubmit={editSupportUser}
        isEditMode={true}
        errors={errors}
        setErrors={setErrors}
      />

      {/* delete support user modal */}
      <DeleteSupportPerson
        title={" Delete Support User"}
        warningText={" Are you sure you want to delete this Support User?"}
        open={deleteModal}
        closeModal={closeDeleteModal}
        buttonLoading={buttonLoading}
        handleSubmit={deleteSupportUser}
      />
    </div>
  );
};

export default SupportUser;

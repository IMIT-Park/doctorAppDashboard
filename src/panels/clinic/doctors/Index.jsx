import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import IconSearch from "../../../components/Icon/IconSearch";
import IconLoader from "../../../components/Icon/IconLoader";
import emptyBox from "/assets/images/empty-box.svg";
import noProfile from "/assets/images/empty-user.png";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import CustomSwitch from "../../../components/CustomSwitch";
import IconUserPlus from "../../../components/Icon/IconUserPlus";
import AddDoctor from "./AddDoctor";
import { showMessage } from "../../../utils/showMessage";
import RemoveDoctor from "../../../pages/DoctorSingleView/components/RemoveDoctor";
import Swal from "sweetalert2";

const ClinicDoctor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userDetails = localStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic[0]?.clinic_id;

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addDoctorModal, setAddDoctorModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [removeModal, setRemoveModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const [input, setInput] = useState({
    name: "",
    email: "",
    user_name: "",
    phone: "",
    gender: "",
    qualification: "",
    fees: "",
    specialization: " ",
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

  const openAddDoctorModal = () => {
    setAddDoctorModal(true);
  };

  const closeAddDoctorModal = () => {
    setAddDoctorModal(false);
    setInput({
      ...input,
      name: "",
      email: "",
      user_name: "",
      phone: "",
      gender: "",
      qualification: "",
      fees: "",
      specialization: " ",
      address: "",
      password: "",
      confirmPassword: "",
    });
    setErrors(null);
  };

  // fetch Doctors function
  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
      );
      setTotalDoctors(response.data?.count);
      setAllDoctors(response.data?.alldoctors || []);
      setLoading(false);
    } catch (error) {
      setAllDoctors([]);
      setTotalDoctors(0);
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching Doctors
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  // block and unblock handler
  const { showAlert: showDoctorAlert, loading: blockUnblockDoctorLoading } =
    useBlockUnblock(fetchData);

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

  const saveDoctorPerson = async () => {
    if (
      !input.name ||
      !input.email ||
      !input.phone ||
      !input.dateOfBirth ||
      !input.gender ||
      !input.qualification ||
      !input.specialization ||
      !input.fees ||
      !input.address ||
      !input.password ||
      !input.confirmPassword
    ) {
      showMessage("Please fill in all required fields", "warning");
      return;
    }

    if (validate()) {
      setButtonLoading(true);

      const updatedData = {
        ...input,
        phone: `+91${input.phone}`,
        user_name: input.email,
        clinic_id: clinicId,
      };

      try {
        const response = await NetworkHandler.makePostRequest(
          "v1/doctor/ClinicCreateDoctor",
          updatedData
        );

        setAddDoctorModal(false);

        if (response.status === 201) {
          showMessage("Doctor has been added successfully.");
          closeAddDoctorModal();
          fetchData();
        } else {
          showMessage("Failed to add Doctor. Please try again.", "error");
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          showMessage(
            error.response.data.error === "User Already Exists"
              ? "Username Already Exists"
              : "Email already exists.",
            "error"
          );
        } else {
          showMessage("Failed to add Doctor. Please try again.", "error");
        }
      } finally {
        setButtonLoading(false);
      }
    }
  };

  // dr remove actions
  const openRemoveModal = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setRemoveModal(true);
  };
  const closeRemoveModal = () => {
    setSelectedDoctorId("");
    setRemoveModal(false);
  };

  const removeDoctor = async () => {
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/clinic/removeDR/${clinicId}`,
        { doctor_id: selectedDoctorId }
      );
      if (response.status === 201) {
        fetchData();
        Swal.fire({
          title: "Removed!",
          text: "Doctor has been removed.",
          icon: "success",
          customClass: "sweet-alerts",
          confirmButtonColor: "#006241",
        });
        closeRemoveModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
              <CountUp start={0} end={totalDoctors} duration={3}></CountUp>
            </span>
          </div>

          <div>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Search Doctor..."
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
          <button
            type="button"
            className="btn btn-green px-10 py-2 h-fit whitespace-nowrap"
            onClick={openAddDoctorModal}
          >
            <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
            Add Doctor
          </button>
        </div>
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Doctors to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allDoctors}
              idAccessor="doctor_id"
              onRowClick={(row) =>
                navigate(`/clinics/${clinicId}/${row?.doctor_id}`, {
                  state: { previousUrl: location?.pathname },
                })
              }
              columns={[
                {
                  accessor: "No",
                  title: "No",
                  render: (row, rowIndex) => rowIndex + 1,
                },

                {
                  accessor: ".photo",
                  title: "Photo",
                  render: (row) => (
                    <img
                      src={row?.photo ? imageBaseUrl + row?.photo : noProfile}
                      alt="Doctor's photo"
                      className="w-10 h-10 rounded-[50%] object-cover"
                    />
                  ),
                },

                {
                  accessor: "name",
                  title: "Name",
                  cellsClassName: "capitalize",
                },
                { accessor: "email", title: "Email" },
                { accessor: "phone", title: "Phone" },
                { accessor: "gender", title: "Gender" },
                {
                  accessor: "dateOfBirth",
                  title: "Date of Birth",
                  render: (row) => formatDate(row?.dateOfBirth),
                },
                {
                  accessor: "qualification",
                  title: "Qualification",
                  textAlignment: "center",
                },
                {
                  accessor: "specialization",
                  title: "Specialization",
                  textAlignment: "center",
                },
                { accessor: "address", title: "Address" },
                {
                  accessor: "fees",
                  title: "Fees",
                  render: (row) => `₹${row?.fees}`,
                },
                {
                  accessor: "visibility",
                  title: "Visibility",
                  render: (row) => (row.visibility ? "Visible" : "Hidden"),
                },
                {
                  accessor: "status",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex items-center gap-5">
                      <CustomSwitch
                        checked={rowData?.status}
                        onChange={() =>
                          showDoctorAlert(
                            rowData?.user_id,
                            rowData?.status ? "block" : "activate",
                            "doctor"
                          )
                        }
                        tooltipText={rowData?.status ? "Block" : "Unblock"}
                        uniqueId={`doctor${rowData?.doctor_id}`}
                        size="normal"
                      />

                      <button
                        type="button"
                        className="btn btn-danger btn-sm h-fit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openRemoveModal(rowData?.doctor_id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ),
                },
              ]}
              totalRecords={totalDoctors}
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

      <AddDoctor
        open={addDoctorModal}
        closeModal={closeAddDoctorModal}
        input={input}
        setInput={setInput}
        formSubmit={saveDoctorPerson}
        buttonLoading={buttonLoading}
        setButtonLoading={setButtonLoading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showComfirmPassword={showComfirmPassword}
        setShowComfirmPassword={setShowComfirmPassword}
        errors={errors}
        setErrors={setErrors}
      />
      {/* dr remove modal */}
      <RemoveDoctor
        show={removeModal}
        onClose={closeRemoveModal}
        onConfirm={removeDoctor}
      />
    </div>
  );
};

export default ClinicDoctor;

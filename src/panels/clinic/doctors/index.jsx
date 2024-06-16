import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconMenuScrumboard from "../../../components/Icon/Menu/IconMenuScrumboard";
import IconEdit from "../../../components/Icon/IconEdit";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconEye from "../../../components/Icon/IconEye";
import ScrollToTop from "../../../components/ScrollToTop";
import IconSearch from "../../../components/Icon/IconSearch";
import IconLoader from "../../../components/Icon/IconLoader";
import emptyBox from "/assets/images/empty-box.svg";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import { showMessage } from "../../../utils/showMessage";
import AddDoctor from "../../../pages/ClinicSingleView/components/AddDoctor";
import Swal from "sweetalert2";
import useBlockUnblock from "../../../utils/useBlockUnblock";

const rowData = [];
const ClinicDoctor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic[0]?.clinic_id;

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [addDoctorModal, setaddDoctorModal] = useState(false);
  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [input, setInput] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    qualification: "",
    specialization: "",
    fees: "",
    visibility: true,
    photo: null,
    timeSlots: [],
    password: "",
    confirmPassword: "",
  });
  const [timeSlotInput, setTimeSlotInput] = useState({});

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  // fetch Doctors function
  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
      );
      setTotalDoctors(response.data?.Doctors?.count);
      setAllDoctors(response.data?.Doctors?.rows);
      setLoading(false);
    } catch (error) {
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

  // doctor image picker
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInput({ ...input, photo: file });
  };

  const openAddDoctorModal = () => {
    setaddDoctorModal(true);
  };

  const closeAddDoctorModal = () => {
    setInput({
      ...input,
      name: "",
      phone: "",
      email: "",
      address: "",
      gender: "",
      dateOfBirth: "",
      qualification: "",
      specialization: "",
      fees: "",
      visibility: true,
      photo: null,
      timeSlots: [],
      password: "",
      confirmPassword: "",
    });
    setActiveTab(1);
    setaddDoctorModal(false);
  };

  //  doctor adding function
  const addDoctor = async () => {
    if (
      !input.name ||
      !input.phone ||
      !input.email ||
      !input.address ||
      !input.gender ||
      !input.dateOfBirth ||
      !input.qualification ||
      !input.specialization ||
      !input.fees ||
      !input.photo ||
      !input.password ||
      !input.confirmPassword
    ) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    if (!input.timeSlots || input.timeSlots.length === 0) {
      showMessage("Please add at least one time slot", "warning");
      return true;
    }

    if (input.password !== input.confirmPassword) {
      showMessage("Passwords are not match", "warning");
      return true;
    }

    const basicDetails = {
      clinic_id: clinicId,
      name: input.name,
      email: input.email,
      address: input.address,
      phone: input.phone,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
      qualification: input.qualification,
      specialization: input.specialization,
      fees: input.fees,
      visibility: input.visibility,
      password: input.password,
    };

    const formData = new FormData();
    formData.append("image_url[]", input.photo);

    setButtonLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        "/v1/doctor/createDoctor",
        basicDetails
      );

      console.log(response);

      if (response.status === 201) {
        const doctorId = response.data.Doctor.doctor_id;

        // Calling the add photo API
        const additionalResponse1 = await NetworkHandler.makePostRequest(
          `/v1/doctor/upload/${doctorId}`,
          formData
        );

        input.timeSlots.forEach((slot) => {
          slot.startTime += ":00";
          slot.endTime += ":00";
        });

        // Calling the add timeslot API
        const additionalResponse2 = await NetworkHandler.makePostRequest(
          `/v1/doctor/createtimeSlots/${doctorId}`,
          { timeslots: input.timeSlots }
        );

        fetchData();

        showMessage("Doctor added successfully.", "success");
        closeAddDoctorModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // block and unblock handler
  const { showAlert: showDoctorAlert, loading: blockUnblockDoctorLoading } =
    useBlockUnblock(fetchData);

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <Tippy content="Total Doctors">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalDoctors} duration={3}></CountUp>
              </span>
            </Tippy>
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

          <div className="flex  text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <button
              type="button"
              className="btn btn-green"
              onClick={openAddDoctorModal}
            >
              <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
              Add Doctor
            </button>
          </div>
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
                  accessor: "photo",
                  title: "Photo",
                  render: (row) =>
                    row?.photo ? (
                      <img
                        src={imageBaseUrl + row?.photo}
                        alt="Doctor's photo"
                        className="w-10 h-10 rounded-[50%]"
                      />
                    ) : (
                      "---"
                    ),
                },

                { accessor: "name", title: "Name" },
                { accessor: "phone", title: "Phone" },
                { accessor: "gender", title: "Gender" },
                {
                  accessor: "dateOfBirth",
                  title: "Date of Birth",
                  render: (row) => formatDate(row?.dateOfBirth),
                },
                { accessor: "qualification", title: "Qualification" },
                { accessor: "specialization", title: "Specialization" },
                { accessor: "address", title: "Address" },
                { accessor: "fees", title: "Fees" },
                {
                  accessor: "visibility",
                  title: "Visibility",
                  render: (row) => (row.visibility ? "Visible" : "Hidden"),
                },
                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <Tippy content={rowData?.status ? "Block" : "Unblock"}>
                      <label
                        className="w-[46px] h-[22px] relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          showDoctorAlert(
                            rowData?.user_id,
                            rowData?.status ? "block" : "activate",
                            "doctor"
                          );
                        }}
                      >
                        <input
                          type="checkbox"
                          className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                          id={`custom_switch_checkbox${rowData?.doctor_id}`}
                          checked={rowData?.status}
                          readOnly
                        />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                      </label>
                    </Tippy>
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

      {/* add doctor modal */}
      <AddDoctor
        open={addDoctorModal}
        closeAddDoctorModal={closeAddDoctorModal}
        buttonLoading={buttonLoading}
        handleFileChange={handleFileChange}
        input={input}
        setInput={setInput}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clinicId={clinicId}
        timeSlotInput={timeSlotInput}
        setTimeSlotInput={setTimeSlotInput}
        formSubmit={addDoctor}
      />
    </div>
  );
};

export default ClinicDoctor;

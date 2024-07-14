import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../components/Icon/IconLoader";
import ScrollToTop from "../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NetworkHandler, {
  imageBaseUrl,
  websiteUrl,
} from "../../utils/NetworkHandler";
import IconEdit from "../../components/Icon/IconEdit";
import AddClinic from "../../panels/owner/clinics/AddClinic";
import { formatDate } from "../../utils/formatDate";
import { showMessage } from "../../utils/showMessage";
import IconCaretDown from "../../components/Icon/IconCaretDown";
import { convertLocationDetail } from "../../utils/getLocation";
import useBlockUnblock from "../../utils/useBlockUnblock";
import QRCodeComponent from "../../components/QRCodeComponent";
import useFetchData from "../../customHooks/useFetchData";
import CustomSwitch from "../../components/CustomSwitch";
import { UserContext } from "../../contexts/UseContext";
import emptyUser from "/assets/images/empty-user.png";

const ClinicSingleView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { clinicId } = useParams();

  const { userDetails } = useContext(UserContext);
  const ownerId = userDetails?.UserOwner?.[0]?.owner_id;

  const isSuperAdmin = userDetails?.role_id === 1;

  const qrUrl = `${websiteUrl}clinic/${clinicId}`;

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [editModal, setEditModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [clinicInput, setClinicInput] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    place: "",
    password: "",
    confirmPassword: "",
    picture: null,
    defaultPicture: null,
    googleLocation: {},
  });
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

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  // fetch clinic data function
  const {
    data: clinicData,
    loading: detailsLoading,
    refetch: fetchClinicData,
  } = useFetchData(`/v1/clinic/getbyId/${clinicId}`, {}, [clinicId]);
  const clinicDetails = clinicData?.Clinic;

  // fetch doctors data function
  const {
    data: doctorData,
    loading: doctorLoading,
    refetch: fetchDoctorData,
  } = useFetchData(
    `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`,
    {},
    [clinicId, page, pageSize]
  );
  const totalDoctors = doctorData?.count || 0;
  const allDoctors = doctorData?.alldoctors || [];

  // doctor image picker
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInput({ ...input, photo: file });
  };

  // remove image function
  const handleRemoveImage = () => {
    setClinicInput({ ...clinicInput, picture: null });
  };

  // edit modal handler
  const openEditModal = () => {
    const phoneWithoutCountryCode = clinicDetails.phone.replace(/^\+91/, "");
    setClinicInput({
      name: clinicDetails.name,
      email: clinicDetails.User.email,
      username: clinicDetails.User.user_name,
      phone: phoneWithoutCountryCode,
      address: clinicDetails.address,
      place: clinicDetails.place,
      picture: null,
      googleLocation: convertLocationDetail(clinicDetails?.googleLocation),
      defaultPicture: imageBaseUrl + clinicDetails?.banner_img_url || null,
    });
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  // edit clinic function
  const updateClinic = async () => {
    if (
      !clinicInput.name ||
      !clinicInput.phone ||
      !clinicInput.address ||
      !clinicInput.place
    ) {
      showMessage("Please fill in all required fields", "warning");
      return true;
    }

    if (!clinicInput.googleLocation) {
      showMessage("Please select clinic location", "warning");
      return true;
    }

    setButtonLoading(true);

    const formData = new FormData();
    formData.append("name", clinicInput.name);
    formData.append("email", clinicInput.email);
    formData.append("user_name", clinicInput.username);
    formData.append("phone", `+91${clinicInput.phone}`);
    formData.append("address", clinicInput.address);
    formData.append("place", clinicInput.place);
    formData.append(
      "googleLocation",
      JSON.stringify(clinicInput.googleLocation)
    );
    if (clinicInput.picture) {
      formData.append("image_url[]", clinicInput.picture);
    }

    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/clinic/edit/${clinicId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        setButtonLoading(false);
        showMessage("Clinic updated successfully.", "success");
        fetchClinicData();
        closeEditModal();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // block and unblock handler
  const { showAlert: showClinicAlert, loading: blockUnblockClinicLoading } =
    useBlockUnblock(fetchClinicData);
  const { showAlert: showDoctorAlert, loading: blockUnblockDoctorLoading } =
    useBlockUnblock(fetchDoctorData);

  return (
    <div>
      <div className="flex justify-between items-center">
        <ScrollToTop />

        <button
          onClick={() => navigate(-1)}
          type="button"
          className="btn btn-green btn-sm mt-1 mb-4"
        >
          <IconCaretDown className="w-4 h-4 rotate-90" />
        </button>

        <div className="flex items-center">
          <CustomSwitch
            checked={clinicDetails?.User?.status}
            onChange={() =>
              showClinicAlert(
                clinicDetails?.User?.user_id,
                clinicDetails?.User?.status ? "block" : "activate",
                "clinic"
              )
            }
            tooltipText={clinicDetails?.User?.status ? "Block" : "Unblock"}
            uniqueId={`clinic${clinicDetails?.clinic_id}`}
            size="large"
          />
        </div>
      </div>

      <div className="panel mb-1">
        {detailsLoading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <>
            <div className="relative flex flex-col xl:flex-row gap-3 xl:gap-3">
              <div className="w-full xl:w-1/2 overflow-hidden flex flex-col items-center sm:mb-1 xl:mb-0">
                <div className="w-full aspect-video xl:h-80 ">
                  <img
                    src={imageBaseUrl + clinicDetails?.banner_img_url}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                </div>
              </div>

              <div className="w-full xl:w-1/2">
                <div className="rounded-lg h-full mt-2 xl:-mt-3 flex flex-col justify-between">
                  <div className="">
                    <div className="text-2xl md:text-4xl text-green-800 font-semibold capitalize mb-4 flex sm:flex-col lg:flex-row justify-between">
                      <div className=" w-full flex items-start justify-between gap-2 mt-2 ">
                        {clinicDetails?.name || ""}
                        {!isSuperAdmin && (
                          <button
                            className="flex text-slate-500 hover:text-info"
                            onClick={openEditModal}
                          >
                            <IconEdit className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col items-start">
                        <div className="text-base font-medium text-gray-500">
                          Address:
                        </div>
                        <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2 min-h-20">
                          {clinicDetails?.address || ""}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start gap-5">
                        <div className="flex flex-col items-start w-full">
                          <div className="text-base font-medium text-gray-500 ">
                            Place:
                          </div>
                          <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                            {clinicDetails?.place || ""}
                          </div>
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <div className="text-base font-medium text-gray-500">
                            Email:
                          </div>
                          <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                            {clinicDetails?.User?.email || ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start gap-5">
                        <div className="flex flex-col items-start w-full">
                          <div className="text-base font-medium text-gray-500">
                            Username:
                          </div>
                          <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                            {clinicDetails?.User?.user_name || ""}
                          </div>
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <div className="text-base font-medium text-gray-500">
                            Phone:
                          </div>
                          <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                            {clinicDetails?.phone || ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <QRCodeComponent
                qrUrl={qrUrl}
                locationDetails={clinicDetails?.googleLocation}
                clinicId={clinicId}
                ownerId={ownerId}
                fetchClinicData={fetchClinicData}
              />
            </div>
          </>
        )}
      </div>

      <div className="panel">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
              <CountUp start={0} end={totalDoctors} duration={3}></CountUp>
            </span>
          </div>
        </div>
        {doctorLoading ? (
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
                  accessor: "doctor_id",
                  title: "No.",
                  render: (row, rowIndex) => rowIndex + 1,
                },

                {
                  accessor: "photo",
                  title: "Photo",
                  render: (row) => (
                    <img
                      src={row?.photo ? imageBaseUrl + row.photo : emptyUser}
                      alt={row?.name}
                      className="w-10 h-10 rounded-[50%] object-cover"
                    />
                  ),
                },
                {
                  accessor: "name",
                  title: "Name",
                },
                {
                  accessor: "email",
                  title: "Email",
                },

                { accessor: "phone" },
                {
                  accessor: "gender",
                  cellsStyle: { textTransform: "capitalize" },
                },
                {
                  accessor: "dateOfBirth",
                  title: "Date of Birth",
                  render: (row) => formatDate(row?.dateOfBirth),
                },
                { accessor: "qualification" },
                { accessor: "specialization" },
                {
                  accessor: "address",
                  title: "Address",
                  width: 220,
                  ellipsis: true,
                },
                { accessor: "fees" },
                {
                  accessor: "visibility",
                  title: "Visibility",
                  render: (row) => (row.visibility ? "Visible" : "Hidden"),
                },

                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <CustomSwitch
                      checked={rowData?.status}
                      onChange={() =>
                        showDoctorAlert(
                          rowData?.user_id,
                          rowData.status ? "block" : "activate",
                          "doctor"
                        )
                      }
                      tooltipText={rowData?.status ? "Block" : "Unblock"}
                      uniqueId={`doctor${rowData?.doctor_id}`}
                      size="normal"
                    />
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

      {/* edit clinic modal */}
      <AddClinic
        open={editModal}
        closeModal={closeEditModal}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        data={clinicInput}
        setData={setClinicInput}
        handleSubmit={updateClinic}
        buttonLoading={buttonLoading}
        isEdit={true}
      />
    </div>
  );
};

export default ClinicSingleView;

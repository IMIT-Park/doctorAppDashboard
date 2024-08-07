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
import IconUserPlus from "../../components/Icon/IconUserPlus";
import AddDoctor from "../../panels/clinic/doctors/AddDoctor";
import Tippy from "@tippyjs/react";
import IconSearch from "../../components/Icon/IconSearch";
import * as XLSX from "xlsx";
import CustomButton from "../../components/CustomButton";
import IconPlus from "../../components/Icon/IconPlus";
import AddTiming from "../../panels/clinic/timings/AddTiming";
import AnimateHeight from "react-animate-height";
import { formatTime } from "../../utils/formatTime";
import IconFile from "../../components/Icon/IconFile";

const ClinicSingleView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails, ids, setIds } = useContext(UserContext);

  const clinicId = ids?.clinicId;

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
    type: "",
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

  const [addDoctorModal, setAddDoctorModal] = useState(false);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalDoctorsCount, setTotalDoctorsCount] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [doctorLoading, setdoctorLoading] = useState(true);

  const [addTimingModal, setAddTimingModal] = useState(false);
  const [editTimingModal, setEditTimingModal] = useState(false);
  const [clinicTimings, setClinicTimings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [timesInput, setTimesInput] = useState({
    day_id: "",
    timing: {
      start: "",
      end: "",
    },
  });
  const [active, setActive] = useState(null);

  const togglePara = (value) => {
    setActive((oldValue) => (oldValue === value ? null : value));
  };

  const days = [
    { name: "Sunday", id: 0 },
    { name: "Monday", id: 1 },
    { name: "Tuesday", id: 2 },
    { name: "Wednesday", id: 3 },
    { name: "Thursday", id: 4 },
    { name: "Friday", id: 5 },
    { name: "Saturday", id: 6 },
  ];

  useEffect(() => {
    setPage(1);
  }, [pageSize, search]);

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

  const fetchDoctorData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
      );
      setTotalDoctors(response?.data?.count);
      setTotalDoctorsCount(response?.data?.count);
      setAllDoctors(response?.data?.alldoctors);
      setdoctorLoading(false);
    } catch (error) {
      console.log(error);
      setdoctorLoading(false);
    } finally {
      setdoctorLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [page, pageSize]);

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
    const phoneWithoutCountryCode = clinicDetails?.phone?.replace(/^\+91/, "");
    const isGoogleLocationValid =
      clinicDetails?.googleLocation && clinicDetails.googleLocation !== `"{}"`;
    setClinicInput({
      name: clinicDetails?.name,
      email: clinicDetails?.User?.email,
      username: clinicDetails?.User?.user_name,
      phone: phoneWithoutCountryCode,
      address: clinicDetails?.address,
      place: clinicDetails?.place,
      picture: null,
      googleLocation: isGoogleLocationValid
        ? convertLocationDetail(clinicDetails?.googleLocation)
        : null,
      defaultPicture: imageBaseUrl + clinicDetails?.banner_img_url || null,
      type: clinicDetails?.type || "",
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
      !clinicInput.place ||
      !clinicInput.type
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
    formData.append("type", clinicInput.type);

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
          fetchDoctorData();
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

  const doctorSearch = async () => {
    let updatedKeyword;
    if (search.startsWith("+9" || "+91")) {
      updatedKeyword = search;
    } else {
      updatedKeyword = isNaN(search) ? search : `+91${search}`;
    }
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/doctor/getalldoctordata?pageSize=${pageSize}&page=${page}`,
        { keyword: updatedKeyword }
      );
      setAllDoctors(response?.data?.doctors || []);
      setTotalDoctors(response?.data?.pagination?.total || 0);
    } catch (error) {
      setAllDoctors([]);
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim()) {
      doctorSearch();
    } else {
      fetchDoctorData();
    }
  }, [search]);

  // Export to Excel function
  const exportToExcel = () => {
    const filteredDoctors = allDoctors.map((doctor, index) => ({
      No: index + 1,
      Name: doctor.name,
      Email: doctor.email,
      Phone: doctor.phone,
      Address: doctor.address,
      Gender: doctor.gender,
      Qualification: doctor.qualification,
      Specialization: doctor.specialization,
      Fees: doctor.fees,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredDoctors);
    const columnWidths = [
      { wpx: 50 },
      { wpx: 200 },
      { wpx: 250 },
      { wpx: 120 },
      { wpx: 300 },
      { wpx: 100 },
      { wpx: 150 },
      { wpx: 200 },
      { wpx: 100 },
    ];
    worksheet["!cols"] = columnWidths;

    const rowHeights = filteredDoctors.map(() => ({ hpx: 20 }));
    rowHeights.unshift({ hpx: 20 });
    worksheet["!rows"] = rowHeights;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clinics");
    XLSX.writeFile(workbook, "DoctorData.xlsx");
  };

  // block and unblock handler
  const { showAlert: showClinicAlert, loading: blockUnblockClinicLoading } =
    useBlockUnblock(fetchClinicData);
  const { showAlert: showDoctorAlert, loading: blockUnblockDoctorLoading } =
    useBlockUnblock(fetchDoctorData);

  // get clinic timing function
  const fetchClinicTiming = async () => {
    setLoading(true);

    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getClinictiming/${clinicId}`
      );

      setClinicTimings(response?.data?.Clinictiming || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicTiming();
  }, []);

  // add timing modal handler
  const openAddTimingModal = () => {
    setAddTimingModal(true);
  };

  const closeAddTimingModal = () => {
    setTimesInput({
      day_id: "",
      timing: {
        start: "",
        end: "",
      },
    });
    setAddTimingModal(false);
  };

  // add timing function
  const addClinicTiming = async () => {
    if (!timesInput.day_id) {
      showMessage("Please select a day", "warning");
      return true;
    }

    if (!timesInput.timing.start) {
      showMessage("Please add the start time", "warning");
      return true;
    }

    if (!timesInput.timing.end) {
      showMessage("Please add the end time", "warning");
      return true;
    }

    setButtonLoading(true);

    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/clinic/createClinictiming/${clinicId}`,
        { clinictimings: [timesInput] }
      );

      if (response.status === 201) {
        showMessage("Timing Added successfully.", "success");
        closeAddTimingModal();
        fetchClinicTiming();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  // eidt timing modal handler
  const openEditTimingModal = (timing) => {
    setTimesInput({
      day_id: timing?.dayId || "",
      timing: {
        start: timing?.start || "",
        end: timing?.end || "",
      },
      Clinictiming_id: timing?.Clinictiming_id,
    });
    setEditTimingModal(true);
  };

  const closeEditTimingModal = () => {
    setTimesInput({
      day_id: "",
      timing: {
        start: "",
        end: "",
      },
    });
    setEditTimingModal(false);
  };

  // eidt timing function
  const editClinicTiming = async () => {
    if (!timesInput.timing.start) {
      showMessage("Please add the start time", "warning");
      return true;
    }

    if (!timesInput.timing.end) {
      showMessage("Please add the end time", "warning");
      return true;
    }

    setButtonLoading(true);

    const updatedTimesInput = {
      day_id: timesInput?.day_id,
      timings: {
        start: timesInput?.timing?.start,
        end: timesInput?.timing?.end,
      },
    };

    try {
      const response = await NetworkHandler.makePutRequest(
        `/v1/clinic/editClinictiming/${timesInput?.Clinictiming_id}`,
        updatedTimesInput
      );

      if (response.status === 200) {
        showMessage("Timing Edited successfully.", "success");
        closeEditTimingModal();
        fetchClinicTiming();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

  const parseTimings = (timings) => {
    try {
      return JSON.parse(timings);
    } catch (error) {
      const correctedTimings = timings
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"');
      return JSON.parse(correctedTimings);
    }
  };

  const groupTimingsByDay = (timings) => {
    return timings.reduce((acc, timing) => {
      const day = timing.day_id;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push({
        ...parseTimings(timing.timings),
        Clinictiming_id: timing.Clinictiming_id,
      });
      return acc;
    }, {});
  };

  const groupedTimings = groupTimingsByDay(clinicTimings);

  const handleRowClick = (doctorId) => {
    setIds({ ...ids, clinicId: clinicId || null, doctorId: doctorId });
    navigate("/doctors/single-view");
  };

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
                            Cateogry:
                          </div>
                          <div className="border dark:border-slate-800 dark:text-slate-300 rounded w-full text-base p-2">
                            {clinicDetails?.type || ""}
                          </div>
                        </div>
                        <div className={`flex flex-col items-start w-full`}>
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
            <div className="flex items-end flex-wrap gap-3 justify-between mb-2 mt-5">
              <h5 className="font-semibold text-lg dark:text-white-light">
                Timings:
              </h5>
              {!isSuperAdmin && (
                <CustomButton onClick={openAddTimingModal}>
                  <IconPlus className="ltr:mr-2 rtl:ml-2" />
                  Add Timing
                </CustomButton>
              )}
            </div>
            {loading ? (
              <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
            ) : (
              <>
                {clinicTimings && clinicTimings.length > 0 ? (
                  <div className="space-y-2 font-semibold mb-8">
                    {Object.keys(groupedTimings).map((dayId) => {
                      const day = days?.find((d) => d?.id == dayId);
                      const dayTimings = groupedTimings[dayId];

                      // Filter out timings that don't have a start and end time
                      const validTimings = dayTimings.filter(
                        (timing) => timing?.start && timing?.end
                      );

                      // Skip rendering the day if no valid timings
                      if (validTimings.length === 0) {
                        return null;
                      }

                      return (
                        <div
                          key={dayId}
                          className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]"
                        >
                          <button
                            type="button"
                            className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${
                              active == dayId
                                ? "!text-[#006241] dark:!text-[#4ec37bfb]"
                                : ""
                            }`}
                            onClick={() => togglePara(dayId)}
                          >
                            {day ? day?.name : "Unknown Day"}
                            <div
                              className={`ltr:ml-auto rtl:mr-auto ${
                                active == dayId ? "rotate-180" : ""
                              }`}
                            >
                              <IconCaretDown />
                            </div>
                          </button>
                          <div>
                            <AnimateHeight
                              duration={300}
                              height={active == dayId ? "auto" : 0}
                            >
                              <div className="w-full flex items-start flex-wrap gap-5 p-4">
                                {validTimings?.map((timing, index) => (
                                  <div
                                    key={index}
                                    className={`flex flex-col items-center gap-2 pt-4 px-3 pb-2 rounded ${
                                      !isSuperAdmin &&
                                      "border border-slate-300 dark:border-slate-700"
                                    }`}
                                  >
                                    <span className="text-[#006241] font-bold border border-[#006241] px-4 py-1 rounded">
                                      {timing?.start
                                        ? formatTime(timing.start)
                                        : ""}{" "}
                                      -{" "}
                                      {timing?.end
                                        ? formatTime(timing.end)
                                        : ""}
                                    </span>
                                    {!isSuperAdmin && (
                                      <button
                                        type="button"
                                        className="btn btn-primary btn-sm rounded-sm py-1 min-w-20 sm:min-w-24"
                                        onClick={() =>
                                          openEditTimingModal({
                                            ...timing,
                                            dayId: dayId,
                                          })
                                        }
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </AnimateHeight>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full h-28 grid place-items-center">
                    No Timings Found
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="panel">
        <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <Tippy content="Total Doctors">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp
                  start={0}
                  end={totalDoctorsCount}
                  duration={3}
                ></CountUp>
              </span>
            </Tippy>
          </div>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                doctorSearch();
              }}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Search Doctors..."
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

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={exportToExcel}
            >
              <IconFile className="ltr:mr-2 rtl:ml-2" />
              Export to Excel
            </button>

            {!isSuperAdmin && (
              <button
                type="button"
                className="btn btn-green px-10 py-2 h-fit whitespace-nowrap"
                onClick={openAddDoctorModal}
              >
                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                Add Doctor
              </button>
            )}
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
              onRowClick={(row) => handleRowClick(row?.doctor_id)}
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
                // {
                //   accessor: "dateOfBirth",
                //   title: "Date of Birth",
                //   render: (row) => formatDate(row?.dateOfBirth),
                // },
                { accessor: "qualification" },
                { accessor: "specialization" },
                // {
                //   accessor: "address",
                //   title: "Address",
                //   width: 220,
                //   ellipsis: true,
                // },
                { accessor: "fees", render: (row) => `₹${row?.fees}` },
                {
                  accessor: "Verification",
                  title: "Verification Status",
                  render: (row) => (
                    <span
                      key={row?.doctor_id}
                      className={`badge whitespace-nowrap capitalize ${
                        row?.verification_status === "verified"
                          ? "bg-success"
                          : row?.verification_status === "rejected"
                          ? "bg-danger"
                          : row?.verification_status === "under_verification"
                          ? "bg-secondary"
                          : row?.verification_status === "draft"
                          ? "bg-secondary"
                          : ""
                      }`}
                    >
                      {row?.verification_status?.replace("_", " ")}
                    </span>
                  ),
                  cellsClassName: "capitalize",
                  textAlignment: "center",
                },
                // {
                //   accessor: "Actions",
                //   textAlignment: "center",
                //   render: (rowData) => (
                //     <CustomSwitch
                //       checked={rowData?.status}
                //       onChange={() =>
                //         showDoctorAlert(
                //           rowData?.user_id,
                //           rowData.status ? "block" : "activate",
                //           "doctor"
                //         )
                //       }
                //       tooltipText={rowData?.status ? "Block" : "Unblock"}
                //       uniqueId={`doctor${rowData?.doctor_id}`}
                //       size="normal"
                //     />
                //   ),
                // },

                {
                  accessor: "Status",
                  textAlignment: "center",
                  render: (rowData) => (
                    <div className="flex justify-center items-center">
                      <span
                        className={`text-sm font-medium ${
                          rowData?.status ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {rowData?.status ? "Active" : "Blocked"}
                      </span>
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
      <AddDoctor
        open={addDoctorModal}
        closeModal={closeAddDoctorModal}
        input={input}
        setInput={setInput}
        formSubmit={saveDoctorPerson}
        buttonLoading={buttonLoading}
        setButtonLoading={setButtonLoading}
        errors={errors}
        setErrors={setErrors}
      />

      {/* add timing modal */}
      <AddTiming
        open={addTimingModal}
        days={days}
        closeModal={closeAddTimingModal}
        timesInput={timesInput}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        setTimesInput={setTimesInput}
        buttonLoading={buttonLoading}
        handleSubmit={addClinicTiming}
      />

      {/* edit timing modal */}
      <AddTiming
        open={editTimingModal}
        days={days}
        closeModal={closeEditTimingModal}
        timesInput={timesInput}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        setTimesInput={setTimesInput}
        buttonLoading={buttonLoading}
        handleSubmit={editClinicTiming}
        isEdit={true}
      />
    </div>
  );
};

export default ClinicSingleView;

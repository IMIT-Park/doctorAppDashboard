import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate } from "react-router-dom";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import useBlockUnblock from "../../../utils/useBlockUnblock";
import CustomSwitch from "../../../components/CustomSwitch";
import { UserContext } from "../../../contexts/UseContext";
import useFetchData from "../../../customHooks/useFetchData";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import IconSearch from "../../../components/Icon/IconSearch";

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Owners"));
  }, [dispatch]);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [clinicId, setClinicId] = useState(null);

  
    const getCurrentDate = () => {
      const currentDate = new Date();
      return currentDate.toISOString().split('T')[0]; 
    };
  
    const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  

  const doctorId = userDetails?.UserDoctor?.[0]?.doctor_id;
  const isSuperAdmin = userDetails?.role_id === 1;

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  const {
    data: clinicsData,
    loading: clinicsLoading,
    refetch: fetchDoctorClinics,
  } = useFetchData(`/v1/doctor/getClincbydr/${doctorId}`, {}, [doctorId]);
  const doctorClinics = clinicsData?.allclinics;

  useEffect(() => {
    if (doctorClinics && doctorClinics.length > 0) {
      setSelectedClinic(doctorClinics[0]);
      setClinicId(doctorClinics[0]?.clinic_id);
    }
  }, [doctorClinics]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setClinicId(clinic?.clinic_id);
  };

  const getallConsultation = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/consultation/getallConsultation/${doctorId}?pageSize=${pageSize}&page=${page}`,
        {
          clinic_id: clinicId,
          schedule_date: selectedDate || null,
        }
      );
      setAllAppointments(response?.data?.Consultations?.rows || []);
      setTotalAppointments(response?.data?.Consultations?.count || 0);
      setLoading(false);
    } catch (error) {
      setAllAppointments([]);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId) {
      console.log("Selected Clinic ID:", clinicId);
      getallConsultation();
    }
  }, [clinicId, selectedDate, page, pageSize]);


  


  return (
    <div>
      <ScrollToTop />

      {/* Clinics List Starts Here */}
      <div className="flex items-center gap-1 flex-grow">
        <h5 className="mt-5 mb-4 text-xl font-bold text-dark dark:text-white-dark">
          Clinics:
        </h5>
        <div className="border-t border-gray-300 dark:border-gray-600 flex-grow ml-2"></div>
      </div>
      {doctorClinics && doctorClinics?.length ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {doctorClinics?.map((clinic) => (
            <div
              key={clinic?.clinic_id}
              className={`Sm:min-w-[413px] border bg-[#F6F6F6] dark:bg-slate-900 ${
                selectedClinic?.clinic_id === clinic?.clinic_id
                  ? "border-[#006241]"
                  : "border-slate-200 dark:border-slate-800"
              } rounded flex gap-3 items-center p-1 cursor-pointer`}
              onClick={() => handleClinicSelect(clinic)}
            >
              <img
                src={imageBaseUrl + clinic?.banner_img_url}
                alt="Clinic"
                className="w-[76px] h-[62px] rounded-md object-cover"
              />
              <div>
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-300 capitalize">
                  {clinic?.name || ""}
                </h4>
                <p className="text-xs font-normal text-slate-500 capitalize">
                  {clinic?.place || ""}
                </p>
              </div>
              <div
                className={`ml-auto mr-2 w-4 h-4 rounded-full border ${
                  selectedClinic?.clinic_id === clinic?.clinic_id
                    ? "border-[#006241] bg-slate-400"
                    : "border-slate-200 dark:border-slate-800"
                } p-[1px] bg-slate-200 dark:bg-slate-800`}
              >
                {selectedClinic?.clinic_id === clinic?.clinic_id && (
                  <div className="bg-[#006241] w-full h-full rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-600">No clinics Found</div>
      )}
      {/* Clinics List Ends Here */}

      <div className="panel mt-5">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center  gap-1 mb-5 mt-5">
            <h5 className="font-semibold text-lg dark:text-white-light ">
              Appointments
            </h5>
            <Tippy content="Total Owners">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp
                  start={0}
                  end={totalAppointments}
                  duration={3}
                  redraw={true}
                ></CountUp>
              </span>
            </Tippy>
          </div>

          <div>
            <form className="mx-auto w-full mb-2">
              <div className="relative flex items-center flex-wrap gap-3 justify-between">
                <div>
                  <label
                    htmlFor="Date"
                    className="block text-gray-700 text-base dark:text-white-dark"
                  >
                    Select a date to view appointment
                  </label>
                </div>
                <div>
                  <input
                    id="Date"
                    type="date"
                    className="form-input"
                    value={selectedDate || ""}
                    onChange={handleDateChange}
                    disabled={loading}
                    // placeholder="Select a date to view appointment"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        {allAppointments && allAppointments.length > 0 ? (
          <>
            {loading ? (
              <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
            ) : (
              <div className="datatables">
                <DataTable
                  noRecordsText="Consultation not found"
                  noRecordsIcon={
                    <span className="mb-2">
                      <img src={emptyBox} alt="" className="w-10" />
                    </span>
                  }
                  mih={180}
                  highlightOnHover
                  className="whitespace-nowrap table-hover"
                  records={allAppointments}
                  idAccessor="booking_id"
                  onRowClick={(row) =>
                    navigate(`/patient-details/${row.booking_id}`)
                  }
                  columns={[
                    {
                      accessor: "booking_id",
                      title: "No.",
                      render: (row, rowIndex) => rowIndex + 1,
                    },
                    {
                      accessor: "Patient.name",
                      title: "Name",
                    },

                    {
                      accessor: "token",
                      title: "Token",
                    },

                    {
                      accessor: "Patient.phone",
                      title: "Phone",
                    },

                    {
                      accessor: "status",
                      title: "Status",
                    },
                    {
                      accessor: "schedule_date",
                      title: "Date",
                      render: (row) => formatDate(row?.schedule_date),
                    },
                    {
                      accessor: "schedule_time",
                      title: "Time",
                      render: (row) => formatTime(row?.schedule_time),
                    },
                  ]}
                  totalRecords={totalAppointments}
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
          </>
        ) : (
          <div className="text-md text-gray-600 text-center mt-10">
            <span className="mb-2 flex justify-center">
              <img src={emptyBox} alt="" className="w-10" />
            </span>
            No Consultations Found
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;

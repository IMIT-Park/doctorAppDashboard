import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import IconSearch from "../../../components/Icon/IconSearch";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import IconMenuScrumboard from "../../../components/Icon/Menu/IconMenuScrumboard";
import AddLeave from "./AddLeaveModal";
import AnimateHeight from "react-animate-height";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import { formatDate } from "../../../utils/formatDate";
import { formatTime } from "../../../utils/formatTime";
import DeleteLeaveModal from "./DeleteLeaveModal";
import DeleteLeave from "../../../pages/DoctorSingleView/components/DeleteLeave";

const ClinicDoctorLeave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [allLeaves, setAllLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [allDoctorNames, setAllDoctorNames] = useState([]);
  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const [active, setActive] = useState("");

  const [deleteLeaveModal, setDeleteLeaveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  const togglePara = (value) => {
    setActive((oldValue) => (oldValue === value ? "" : value));
  };

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  const openAddLeaveModal = () => {
    setAddLeaveModal(true);
  };

  const closeAddLeaveModal = () => {
    setAddLeaveModal(false);
  };

  // Get Leave by Clinic
  const fetchLeaveData = async () => {
    const clinicId = userData?.UserClinic[0]?.clinic_id;
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/leave/getleave/${clinicId}`
      );

      setAllLeaves(response.data?.leaveDetails || []);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching Leave
  useEffect(() => {
    fetchLeaveData();
  }, [page, pageSize]);

  const fetchDoctorData = async () => {
    const clinicId = userData?.UserClinic[0]?.clinic_id;
    let allDoctors = [];
    let page = 1;
    let hasMorePages = true;

    try {
      while (hasMorePages) {
        const response = await NetworkHandler.makeGetRequest(
          `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
        );

        const doctorData = response.data?.alldoctors;
        allDoctors = allDoctors.concat(doctorData);

        hasMorePages = doctorData.length === pageSize;
        page += 1;
      }

      setAllDoctorNames(allDoctors);
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
    fetchDoctorData();
  }, []);

  const openDeleteLeaveModal = (leave, leaveDate) => {
    const leaveWithDate = { ...leave, leave_date: leaveDate };
    setSelectedLeave(leaveWithDate);
    setDeleteLeaveModal(true);
  };

  const closeDeleteLeaveModal = () => {
    setDeleteLeaveModal(false);
    setSelectedTimeSlots([]);
    setSelectedLeave(null);
  };

  return (
    <div>
      <ScrollToTop />

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Leaves
            </h5>
          </div>

          <div className="flex  text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <button
              type="button"
              className="btn btn-green"
              onClick={openAddLeaveModal}
            >
              <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
              New Leave
            </button>
          </div>
        </div>

        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : allLeaves && allLeaves?.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <img src={emptyBox} alt="" className="w-10" />
            <p className="text-gray-500 dark:text-white-dark mt-4">
              No leaves to show.
            </p>
          </div>
        ) : (
          <div className="panel" id="basic">
            <div className="mb-5">
              <div className="space-y-2 font-semibold">
                {allLeaves?.map((leaveDetail, index) => (
                  <div
                    key={index}
                    className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]"
                  >
                    <button
                      type="button"
                      className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${
                        active === index
                          ? "!text-[#006241] dark:!text-[#4ec37bfb]"
                          : ""
                      }`}
                      onClick={() => togglePara(index)}
                    >
                      {formatDate(leaveDetail?.date)}

                      <div
                        className={`ltr:ml-auto rtl:mr-auto ${
                          active === index ? "rotate-180" : ""
                        }`}
                      >
                        <IconCaretDown />
                      </div>
                    </button>
                    <div>
                      <AnimateHeight
                        duration={300}
                        height={active === index ? "auto" : 0}
                      >
                        <div className="p-4 text-white-dark text-[15px] border-t border-[#D3D3D3] dark:border-[#1B2E4B] flex items-center justify-start flex-wrap gap-3 sm:gap-4">
                          {leaveDetail?.doctors?.map((doctor, docIndex) => (
                            <div
                              key={docIndex}
                              className="flex flex-col items-start gap-2 border border-slate-300 dark:border-slate-500 pt-4 pl-3 pr-2 pb-2 rounded w-full max-w-[350px]"
                            >
                              <button
                                type="button"
                                className="btn btn-danger btn-sm rounded py-1 min-w-10 sm:min-w-20 ml-auto"
                                onClick={() =>
                                  openDeleteLeaveModal(
                                    doctor,
                                    leaveDetail?.date
                                  )
                                }
                              >
                                Delete
                              </button>

                              <div className="flex items-start gap-1 flex-wrap mt-3">
                                <p className="min-w-[75px]">Dr.Name : </p>{" "}
                                <div className="text-slate-700 dark:text-slate-300 capitalize">
                                  {doctor?.doctor_name}
                                </div>
                              </div>
                              <div className="flex items-start gap-1 flex-wrap">
                                <p className="min-w-[75px]">Duration :</p>
                                <div className="text-slate-700 dark:text-slate-300">
                                  {doctor?.fullday ? "Full Day" : "By Shift"}
                                </div>{" "}
                              </div>
                              <div className="w-full flex items-start flex-wrap gap-2">
                                {doctor?.leaves?.map((leave, leaveIndex) => (
                                  <span
                                    key={leaveIndex}
                                    className="text-[#006241] text-xs sm:text-sm border border-[#006241] py-1 rounded min-w-[130px] sm:min-w-40 text-center"
                                  >
                                    {formatTime(
                                      leave?.DoctorTimeSlot?.startTime
                                    )}{" "}
                                    -{" "}
                                    {formatTime(leave?.DoctorTimeSlot?.endTime)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AnimateHeight>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <AddLeave
        addLeaveModal={addLeaveModal}
        setAddLeaveModal={setAddLeaveModal}
        closeAddLeaveModal={closeAddLeaveModal}
        buttonLoading={buttonLoading}
        allDoctorNames={allDoctorNames}
        fetchLeaveData={fetchLeaveData}
      />

      {/* <DeleteLeaveModal
        open={deleteLeaveModal}
        closeModal={closeDeleteLeaveModal}
        leave={selectedLeave}
        fetchLeaveData={fetchLeaveData}
        selectedTimeSlots={selectedTimeSlots}
        setSelectedTimeSlots={setSelectedTimeSlots}
      /> */}
      <DeleteLeave
        open={deleteLeaveModal}
        closeModal={closeDeleteLeaveModal}
        leaveData={selectedLeave}
        fetchLeaveData={fetchLeaveData}
        selectedTimeSlots={selectedTimeSlots}
        setSelectedTimeSlots={setSelectedTimeSlots}
      />
    </div>
  );
};

export default ClinicDoctorLeave;

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
    console.log(clinicId);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getleave/${clinicId}`
      );
      console.log(response);
      // setTotalLeaves(response.data?.count);
      setAllLeaves(response.data?.leaveDetails);

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

        const doctorData = response.data?.Doctors?.rows || [];
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

  return (
    <div>
      <ScrollToTop />

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Leaves
            </h5>
            <Tippy content="Total Doctors">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                {/* <CountUp start={0} end={totalLeaves} duration={3}></CountUp> */}
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
                  className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center"
                >
                  <IconSearch className="mx-auto" />
                </button>
              </div>
            </form>
          </div>

          <div className="flex  text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Add Doctor">
              <button
                type="button"
                className="btn btn-green"
                onClick={openAddLeaveModal}
              >
                <IconMenuScrumboard className="ltr:mr-2 rtl:ml-2" />
                New Leave
              </button>
            </Tippy>
          </div>
        </div>

        {/* basic */}
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="panel" id="basic">
            <div className="mb-5">
              <div className="space-y-2 font-semibold">
                {allLeaves.map((leaveDetail, index) => (
                  <div
                    key={index}
                    className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]"
                  >
                    <button
                      type="button"
                      className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${
                        active === index ? "!text-[#006241] dark:!text-[#4ec37bfb]" : ""
                      }`}
                      onClick={() => togglePara(index)}
                    >
                      {formatDate(new Date(leaveDetail.date))}

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
                          {leaveDetail.doctors.map((doctor, docIndex) => (
                            <div
                              key={docIndex}
                              className="flex flex-col items-center gap-2 border border-slate-300 dark:border-slate-500 pt-4 px-3 pb-2 rounded"
                            >
                              <div className="ml-auto">
                                <IconTrashLines />
                              </div>{" "}
                              <div className="flex items-center gap-1 mt-3">
                                <p>Dr.Name : </p>{" "}
                                <div className="text-slate-700 dark:text-slate-300">
                                  {doctor.doctor_name}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                Duration :
                                <div className="text-slate-700 dark:text-slate-300">
                                  {doctor.fullday ? "Full Day" : "By Shift"}
                                </div>{" "}
                              </div>
                              {doctor.leaves.map((leave, leaveIndex) => (
                                <span
                                  key={leaveIndex}
                                  className="text-[#006241] font-bold border border-[#006241] px-4 py-1 rounded mb-2"
                                >
                                  {/* {formatDate(leave.leave_date)} :{" "} */}
                                  {formatTime(
                                    leave.DoctorTimeSlot.startTime
                                  )} -{" "}
                                  {formatTime(leave.DoctorTimeSlot.endTime)}
                                </span>
                              ))}
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
    </div>
  );
};

export default ClinicDoctorLeave;

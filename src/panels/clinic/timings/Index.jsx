import React, { useEffect, useState } from "react";
import ScrollToTop from "../../../components/ScrollToTop";
import AddTiming from "./AddTiming";
import IconPlus from "../../../components/Icon/IconPlus";
import CustomButton from "../../../components/CustomButton";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";
import { showMessage } from "../../../utils/showMessage";
import NetworkHandler from "../../../utils/NetworkHandler";
import { formatTime } from "../../../utils/formatTime";

const Timings = () => {
  const userDetails = localStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic?.[0]?.clinic_id || 0;

  const [addTimingModal, setAddTimingModal] = useState(false);
  const [editTimingModal, setEditTimingModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
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

  return (
    <div>
      <ScrollToTop />

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <h5 className="font-semibold text-lg dark:text-white-light">
            Timings
          </h5>
          <CustomButton onClick={openAddTimingModal}>
            <IconPlus className="ltr:mr-2 rtl:ml-2 " />
            Add Timing
          </CustomButton>
        </div>
        <div className="space-y-2 font-semibold">
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
                          className="flex flex-col items-center gap-2 border border-slate-300 dark:border-slate-700 pt-4 px-3 pb-2 rounded"
                        >
                          <span className="text-[#006241] font-bold border border-[#006241] px-4 py-1 rounded">
                            {timing?.start ? formatTime(timing.start) : ""} -{" "}
                            {timing?.end ? formatTime(timing.end) : ""}
                          </span>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm rounded-sm py-1 min-w-20 sm:min-w-24"
                            onClick={() =>
                              openEditTimingModal({ ...timing, dayId: dayId })
                            }
                          >
                            Edit
                          </button>
                        </div>
                      ))}
                    </div>
                  </AnimateHeight>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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

export default Timings;

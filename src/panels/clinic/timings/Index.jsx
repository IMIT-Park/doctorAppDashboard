import React, { useState } from "react";
import ScrollToTop from "../../../components/ScrollToTop";
import AddTiming from "./AddTiming";
import IconPlus from "../../../components/Icon/IconPlus";
import CustomButton from "../../../components/CustomButton";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";
import { showMessage } from "../../../utils/showMessage";
import NetworkHandler from "../../../utils/NetworkHandler";

const Timings = () => {
  const userDetails = localStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic?.[0]?.clinic_id || 0;

  const [addTimingModal, setAddTimingModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [timesInput, setTimesInput] = useState({
    day_id: "",
    timing: {
      start: "",
      end: "",
    },
  });

  const days = [
    { name: "Sunday", id: 0 },
    { name: "Monday", id: 1 },
    { name: "Tuesday", id: 2 },
    { name: "Wednesday", id: 3 },
    { name: "Thursday", id: 4 },
    { name: "Friday", id: 5 },
    { name: "Saturday", id: 6 },
  ];

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

  const addClinicTiming = async () => {
    if (!timesInput.day_id) {
      showMessage("Please select a day", "warning");
      return true;
    }

    if (!timesInput.timing.start) {
      showMessage("Please add the start time", "warning");
      return true;
    }

    if (!timesInput.timing.start) {
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
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
      setButtonLoading(false);
    } finally {
      setButtonLoading(false);
    }
  };

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

        <div className="mb-5">
          <div className="space-y-2 font-semibold">
            <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
              <button
                type="button"
                // className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${
                //   active === index
                //     ? "!text-[#006241] dark:!text-[#4ec37bfb]"
                //     : ""
                // }`}
                // onClick={() => togglePara(index)}
              >
                Sunday
                <div
                // className={`ltr:ml-auto rtl:mr-auto ${
                //   active === index ? "rotate-180" : ""
                // }`}
                >
                  <IconCaretDown />
                </div>
              </button>
              <div>
                <AnimateHeight
                  duration={300}
                  // height={active === index ? "auto" : 0}
                >
                  <div className="p-4 text-white-dark text-[15px] border-t border-[#D3D3D3] dark:border-[#1B2E4B] flex items-center justify-start flex-wrap gap-3 sm:gap-4">
                    hello
                  </div>
                </AnimateHeight>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default Timings;

import React, { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

const SelectDays = ({ input, setInput,timeSlotInput, setTimeSlotInput }) => {
  const [active, setActive] = useState("");
  const [sameForAll, setSameForAll] = useState(false);

  const days = [
    { name: "Sunday", id: "0" },
    { name: "Monday", id: "1" },
    { name: "Tuesday", id: "2" },
    { name: "Wednesday", id: "3" },
    { name: "Thursday", id: "4" },
    { name: "Friday", id: "5" },
    { name: "Saturday", id: "6" },
  ];

  useEffect(() => {
    // Initialize with a default time slot for each day
    const initialTimeSlots = {};
    days.forEach((day) => {
      initialTimeSlots[day.id] = [
        { startTime: "", endTime: "", noOfConsultationsPerDay: 0 },
      ];
    });
    setTimeSlotInput(initialTimeSlots);
  }, []);

  const togglePara = (value) => {
    setActive((oldValue) => (oldValue === value ? "" : value));
  };

  const handleAddTimeSlot = (dayId) => {
    const newTimeSlot = {
      startTime: "",
      endTime: "",
      noOfConsultationsPerDay: 0,
    };
    setTimeSlotInput((prev) => ({
      ...prev,
      [dayId]: [...(prev[dayId] || []), newTimeSlot],
    }));
  };

  const handleTimeSlotChange = (dayId, index, field, value) => {
    const updatedTimeSlots = [...(timeSlotInput[dayId] || [])];
    updatedTimeSlots[index][field] = value;
    setTimeSlotInput((prev) => ({ ...prev, [dayId]: updatedTimeSlots }));

    const updatedInputTimeSlots = [...input.timeSlots];
    const timeSlotIndex = updatedInputTimeSlots.findIndex(
      (slot) =>
        slot.day_id === dayId &&
        slot.startTime === updatedTimeSlots[index].startTime
    );

    if (timeSlotIndex !== -1) {
      updatedInputTimeSlots[timeSlotIndex] = {
        ...updatedInputTimeSlots[timeSlotIndex],
        [field]: value,
      };
    } else {
      updatedInputTimeSlots.push({
        day_id: dayId,
        startTime: updatedTimeSlots[index].startTime,
        endTime: updatedTimeSlots[index].endTime,
        noOfConsultationsPerDay:
          updatedTimeSlots[index].noOfConsultationsPerDay,
      });
    }

    setInput({ ...input, timeSlots: updatedInputTimeSlots });
  };

  const handleSameForAll = () => {
    setSameForAll(!sameForAll);
    if (!sameForAll) {
      const firstDayTimeSlots = timeSlotInput["0"];
      const updatedTimeSlots = {};
      days.forEach((day) => {
        updatedTimeSlots[day.id] = firstDayTimeSlots;
      });
      setTimeSlotInput(updatedTimeSlots);

      const updatedInputTimeSlots = [];
      days.forEach((day) => {
        firstDayTimeSlots.forEach((slot) => {
          updatedInputTimeSlots.push({
            day_id: day.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            noOfConsultationsPerDay: slot.noOfConsultationsPerDay,
          });
        });
      });
      setInput({ ...input, timeSlots: updatedInputTimeSlots });
    }
  };

  const hasValues = (dayId) => {
    const slots = timeSlotInput[dayId];
    return (
      slots &&
      slots.some(
        (slot) => slot.startTime || slot.endTime || slot.noOfConsultationsPerDay
      )
    );
  };


  return (
    <div className="w-full">
      <div className="mt-4">
        <div className="text-lg font-bold  py-1 ltr:pr-[50px] rtl:pl-[50px]">
          Select Days
        </div>
      </div>

      <div>
        <form>
          <div className="">
            {days.map((day, dayIndex) => (
              <div className="panel p-1" key={day.id}>
                <div className="flex items-center justify-between">
                  <button
                    className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600"
                    onClick={() => togglePara(day.id)}
                  ></button>
                </div>
                <div>
                  <div className="space-y-2 font-semibold">
                    <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                      <button
                        type="button"
                        className={`p-3 w-full flex items-center justify-between text-white-dark dark:bg-[#1b2e4b] ${
                          active === day.id ? "!text-primary" : ""
                        }`}
                        onClick={() => togglePara(day.id)}
                      >
                        <span>{day.name}</span>
                        {/* <div
                          className={`ml-2 w-4 h-4 rounded-full border ${
                            active === day.id
                              ? " bg-primary"
                              : "border-gray-400"
                          }`}
                        /> */}
                        <div
                          className={`ml-2 w-4 h-4 rounded-full border ${
                            hasValues(day.id) ? "bg-primary" : "border-gray-400"
                          }`}
                        />
                      </button>

                      <div>
                        <AnimateHeight
                          duration={300}
                          height={active === day.id ? "auto" : 0}
                        >
                          <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                            <p className="text-sm font-small pb-5">
                              <span className="bg-[#f3f2f2] dark:bg-[#121c2c] pl-3 py-1 pr-[10px] ">
                                Select Time
                              </span>
                            </p>

                            {(timeSlotInput[day.id] || []).map(
                              (slot, index) => (
                                <div
                                  key={index}
                                  className="pb-1 flex flex-col justify-start border-b border-blue-950"
                                >
                                  <div className="grid grid-cols-1 sm:flex justify-between gap-5">
                                    <Flatpickr
                                      options={{
                                        noCalendar: true,
                                        enableTime: true,
                                        dateFormat: "h:i K",
                                        position: "auto left",
                                      }}
                                      className="form-input"
                                      placeholder="Select Time"
                                      value={slot?.startTime || ""}
                                      onChange={(date) =>
                                        handleTimeSlotChange(
                                          day.id,
                                          index,
                                          "startTime",
                                          date[0]
                                        )
                                      }
                                    />
                                    <p className="mt-2">To</p>
                                    <Flatpickr
                                      options={{
                                        noCalendar: true,
                                        enableTime: true,
                                        dateFormat: "h:i K",
                                        position: "auto left",
                                      }}
                                      className="form-input"
                                      placeholder="Select Time"
                                      value={slot.endTime || ""}
                                      onChange={(date) =>
                                        handleTimeSlotChange(
                                          day.id,
                                          index,
                                          "endTime",
                                          date[0]
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="my-3">
                                    <label className="text-white-dark">
                                      No of Consultations:
                                    </label>
                                    <input
                                      type="number"
                                      className="form-input w-36"
                                      value={slot.noOfConsultationsPerDay || 0}
                                      onChange={(e) =>
                                        handleTimeSlotChange(
                                          day.id,
                                          index,
                                          "noOfConsultationsPerDay",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )
                            )}

                            <button
                              type="button"
                              className="btn btn-info ml-auto"
                              onClick={() => handleAddTimeSlot(day.id)}
                            >
                              Add Another
                            </button>
                            {dayIndex === 0 && (
                              <div className="mb-5">
                                <label className="inline-flex cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={sameForAll}
                                    onChange={handleSameForAll}
                                  />
                                  <span className="text-white-dark relative checked:bg-none">
                                    Same for all selected days
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>
                        </AnimateHeight>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectDays;

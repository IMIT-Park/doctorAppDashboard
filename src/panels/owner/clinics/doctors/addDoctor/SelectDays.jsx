import React, { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconX from "../../../../../components/Icon/IconX";

const SelectDays = ({
  input,
  setInput,
  timeSlotInput,
  setTimeSlotInput,
  clinicId,
}) => {
  const [active, setActive] = useState("");

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
    const initialTimeSlots = {};
    days.forEach((day) => {
      initialTimeSlots[day.id] = input.timeSlots
        .filter((slot) => slot.day_id === day.id)
        .map((slot) => ({
          ...slot,
          clinic_id: clinicId,
        }));
      if (initialTimeSlots[day.id].length === 0) {
        initialTimeSlots[day.id] = [
          {
            id: Date.now(),
            startTime: "",
            endTime: "",
            noOfConsultationsPerDay: 0,
            time_slot: 0,
            clinic_id: clinicId,
          },
        ];
      }
    });
    setTimeSlotInput(initialTimeSlots);
  }, [clinicId, input.timeSlots, setTimeSlotInput]);

  const togglePara = (value) => {
    setActive((oldValue) => (oldValue === value ? "" : value));
  };

  // time slot add function
  const handleAddTimeSlot = (dayId) => {
    const newTimeSlot = {
      id: Date.now(),
      startTime: "",
      endTime: "",
      noOfConsultationsPerDay: 0,
      time_slot: 0,
      clinic_id: clinicId,
    };
    setTimeSlotInput((prev) => ({
      ...prev,
      [dayId]: [...(prev[dayId] || []), newTimeSlot],
    }));
  };

  // time slot remove function
  const handleRemoveTimeSlot = (dayId, slotId) => {
    setTimeSlotInput((prev) => ({
      ...prev,
      [dayId]: prev[dayId].filter((slot) => slot.id !== slotId),
    }));

    setInput((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((slot) => slot.id !== slotId),
    }));
  };

  const handleTimeSlotChange = (dayId, index, field, value) => {
    const updatedTimeSlots = [...(timeSlotInput[dayId] || [])];
    updatedTimeSlots[index][field] = value;
    setTimeSlotInput((prev) => ({ ...prev, [dayId]: updatedTimeSlots }));

    const updatedInputTimeSlots = [...input.timeSlots];
    const slotId = updatedTimeSlots[index].id;

    const timeSlotIndex = updatedInputTimeSlots.findIndex(
      (slot) => slot.id === slotId
    );

    if (timeSlotIndex !== -1) {
      updatedInputTimeSlots[timeSlotIndex] = {
        ...updatedInputTimeSlots[timeSlotIndex],
        [field]: value,
        clinic_id: clinicId,
      };
    } else {
      updatedInputTimeSlots.push({
        id: slotId,
        day_id: dayId,
        startTime: updatedTimeSlots[index].startTime,
        endTime: updatedTimeSlots[index].endTime,
        noOfConsultationsPerDay:
          updatedTimeSlots[index].noOfConsultationsPerDay,
        time_slot: updatedTimeSlots[index].time_slot,
        clinic_id: clinicId,
      });
    }

    setInput({ ...input, timeSlots: updatedInputTimeSlots });
  };

  const hasValues = (dayId) => {
    const slots = timeSlotInput[dayId];
    return (
      slots &&
      slots.some(
        (slot) =>
          slot.startTime ||
          slot.endTime ||
          slot.noOfConsultationsPerDay ||
          slot.time_slot
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
                            {(timeSlotInput[day.id] || []).map(
                              (slot, index) => (
                                <div
                                  key={index}
                                  className="pb-1 flex flex-col justify-start border-b border-blue-950 mb-4 relative"
                                >
                                  <button
                                    type="button"
                                    className="absolute -top-2 right-0 btn btn-outline-danger btn-sm"
                                    onClick={() =>
                                      handleRemoveTimeSlot(day.id, slot.id)
                                    }
                                  >
                                    <IconX className="w-5 h-5" />
                                  </button>
                                  <p className="text-sm font-small pb-4">
                                    <span className="bg-[#f3f2f2] dark:bg-[#121c2c] pl-3 py-1 pr-[10px] ">
                                      Select Time
                                    </span>
                                  </p>
                                  <div className="grid grid-cols-1 sm:flex justify-between gap-2">
                                    <p className="mt-2">Start:</p>
                                    <input
                                      type="time"
                                      className="form-input"
                                      value={slot?.startTime || ""}
                                      onChange={(e) =>
                                        handleTimeSlotChange(
                                          day.id,
                                          index,
                                          "startTime",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                    <p className="mt-2">End:</p>
                                    <input
                                      type="time"
                                      className="form-input"
                                      value={slot.endTime || ""}
                                      onChange={(e) =>
                                        handleTimeSlotChange(
                                          day.id,
                                          index,
                                          "endTime",
                                          e.target.value
                                        )
                                      }
                                      required
                                    />
                                  </div>
                                  <div className="my-4 flex items-start gap-3">
                                    <div>
                                      <label className="text-white-dark">
                                        No. of Consultations:
                                      </label>
                                      <input
                                        type="number"
                                        className="form-input w-full"
                                        value={
                                          slot.noOfConsultationsPerDay || 0
                                        }
                                        onChange={(e) =>
                                          handleTimeSlotChange(
                                            day.id,
                                            index,
                                            "noOfConsultationsPerDay",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="text-white-dark">
                                        Time of Consultation:
                                      </label>
                                      <input
                                        type="number"
                                        className="form-input w-full"
                                        value={slot.time_slot || 0}
                                        onChange={(e) =>
                                          handleTimeSlotChange(
                                            day.id,
                                            index,
                                            "time_slot",
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </div>
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

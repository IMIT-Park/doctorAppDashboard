import React, { useEffect, useState } from "react";
import IconPlus from "../../../components/Icon/IconPlus";
import NetworkHandler from "../../../utils/NetworkHandler";

const BasicDetails = ({ input, setInput, handleFileChange }) => {
  const [specializations, setSpecializations] = useState([]);

  const handleCheckboxChange = (e) => {
    setInput({ ...input, visibility: !e.target.checked });
  };


  const fetchSpecialization = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        "/v1/doctor/specializations"
      );
      setSpecializations(response?.data?.specializations);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch clinic details
  useEffect(() => {
    fetchSpecialization();
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-center pt-8">
        <div className="relative w-24 h-24 rounded-full dark:bg-[#121c2c] bg-gray-200 mb-5 flex justify-center items-center">
          <label
            htmlFor="fileInput"
            className="cursor-pointer"
            title="Upload profile picture"
          >
            {input.photo ? (
              <img
                src={URL.createObjectURL(input.photo)}
                alt="Selected"
                className=" w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <IconPlus className="text-slate-600 w-12 h-12" />
            )}
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </div>
      </div>
      <div className="mb-5">
        <label htmlFor="dr-name">Doctor Name</label>
        <input
          id="dr-name"
          type="text"
          placeholder="Enter Doctor Name"
          className="form-input"
          value={input.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="dr-phone">Phone</label>
        <input
          id="dr-phone"
          type="number"
          placeholder="Enter Phone Number"
          className="form-input"
          value={input.phone}
          onChange={(e) => setInput({ ...input, phone: e.target.value })}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter Email"
          className="form-input"
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
        />
      </div>
      <div className="mb-5">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          className="form-select text-white-dark"
          required
          value={input.gender}
          onChange={(e) => setInput({ ...input, gender: e.target.value })}
        >
          <option>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input
        id="dateOfBirth"
          type="date"
          className="form-input"
          value={input.dateOfBirth}
          onChange={(e) => setInput({ ...input, dateOfBirth: e.target.value })}
        />
      </div>
      <div className="mb-5">
        <label htmlFor="dr-qualification">Qualification</label>
        <input
          id="dr-qualification"
          type="text"
          placeholder="Enter Qualification"
          className="form-input"
          value={input.qualification}
          onChange={(e) =>
            setInput({
              ...input,
              qualification: e.target.value,
            })
          }
        />
      </div>
      <div className="mb-5">
        <label htmlFor="dr-specialization">Specialization</label>
        <select
          id="dr-specialization"
          className="form-select text-white-dark"
          required
          value={input.specialization}
          onChange={(e) =>
            setInput({
              ...input,
              specialization: e.target.value,
            })
          }
        >
          <option>Select Specializtion</option>
          {specializations?.map((specialization) => (
            <option key={specialization?.id} value={specialization?.name}>
              {specialization?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="dr-fees">Fees</label>
        <input
          id="dr-fees"
          type="number"
          placeholder="Enter Fess"
          className="form-input"
          value={input.fees}
          onChange={(e) => setInput({ ...input, fees: e.target.value })}
        />
      </div>
      <div className="mb-5">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          rows={3}
          className="form-textarea resize-none min-h-[130px]"
          placeholder="Enter Address"
          value={input.address}
          onChange={(e) => setInput({ ...input, address: e.target.value })}
        ></textarea>
      </div>

      <div className="mb-5">
        <label className="inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={!input.visibility}
            onChange={handleCheckboxChange}
          />
          <span className="text-white-dark relative checked:bg-none">
            Hide Profile in Website
          </span>
        </label>
      </div>
    </div>
  );
};

export default BasicDetails;

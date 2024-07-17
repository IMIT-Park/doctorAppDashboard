import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import { useNavigate } from "react-router-dom";

const SelectDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  }, [dispatch]);

 
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleDoctorClick = (doctorId) => {
    setSelectedDoctor(doctorId);
  }

  return (
    <div>
      <ScrollToTop />

      <div className="panel">
        <h1 className="text-center font-bold text-2xl text-black m-8 dark:text-[#fbfbfb]">
          Select Doctors
        </h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          navigate("/clinic/bookings/SelectDateAndTime")
        }}>
          <div className="flex flex-wrap justify-center mb-6 space-x-4">
            <div
              className= {`text-center p-4 bg-gray-100 dark:bg-gray-800 ${selectedDoctor === 1 ? "border-4 border-green-500" : ""}`}
              style={{
                borderRadius: "8px",
                minWidth: "223px",
                flexBasis: "223px",
              }}
              onClick={() => handleDoctorClick(1)}
            >
              <img
                src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Doctor 1"
                className="rounded"
                style={{ width: "223px", height: "240px" }}
              />
              <p className="font-bold text-lg mt-2 dark:text-white">Dr. Anitta Charly</p>
              <p className="text-sm text-gray-700 font-normal dark:text-slate-300">
                General Surgery
              </p>
            </div>

            <div
              className={`text-center p-4 bg-gray-100 dark:bg-gray-800 ${selectedDoctor === 2 ? "border-4 border-green-500" : ""}`}
              style={{
                // backgroundColor: "#F3F3F3",
                borderRadius: "8px",
                minWidth: "223px",
                flexBasis: "223px",
              }}
              onClick={() => handleDoctorClick(2)}
            >
              <img
                src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Doctor 1"
                className="rounded"
                style={{ width: "223px", height: "240px" }}
              />
              <p className="font-bold text-lg mt-2 dark:text-white">Dr. Charly TP</p>
              <p className="text-sm text-gray-700 font-normal dark:text-slate-300">
                General Surgery
              </p>
            </div>
            <div
              className={`text-center p-4 bg-gray-100 dark:bg-gray-800 ${selectedDoctor === 3 ? "border-4 border-green-500" : ""} `}
              style={{
                // backgroundColor: "#F3F3F3",
                borderRadius: "8px",
                minWidth: "223px",
                flexBasis: "223px",
              }}
              onClick={() => handleDoctorClick(3)}
            >
              <img
                src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Doctor 1"
                className="rounded"
                style={{ width: "223px", height: "240px" }}
              />
              <p className="font-bold text-lg mt-2 dark:text-white">Dr. Praveena MV</p>
              <p className="text-sm text-gray-700 font-normal dark:text-slate-300">
                General Surgery
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn btn-green inline-flex justify-center w-40 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{ fontSize: "19px" }}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectDoctor;

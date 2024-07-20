import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import ScrollToTop from "../../../components/ScrollToTop";
import IconSearch from "../../../components/Icon/IconSearch";
import IconLoader from "../../../components/Icon/IconLoader";
import bookingDirection from "/assets/images/booking-direction.png";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";
import { useNavigate, Link } from "react-router-dom";

const rowData = [];
const ClinicBookingDoctor = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("ownerDoctor"));
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchModal, setSearchModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic[0]?.clinic_id;

  const closeSearchModal = () => {
    setSearchModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setShowSuggestions(false);
  };

  return (
    <div>
      <ScrollToTop />
      <div className="flex items-start gap-2 flex-wrap mb-1">
        <label
          className="bg-white dark:bg-slate-900 text-[#006241] py-2 px-4 rounded"
          style={{ boxShadow: "0 0 4px 2px #00000026" }}
        >
          Direct Booking
        </label>
      </div>

      <div className="panel">
        <div className="flex justify-center items-center">
          <img
            src={bookingDirection}
            alt=""
            className="w-full max-w-52 sm:max-w-64 md:max-w-80"
          />
        </div>
        <div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="mx-auto w-full mb-2"
          >
            <div className="flex flex-col items-center mt-10 md:mt-20">
              <div className="relative mb-4 w-full max-w-md">
                <input
                  type="text"
                  value={search}
                  placeholder="Search by Name, Email, Phone no"
                  className="form-input form-input-green shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] rounded-full h-11 pr-10 pl-5  w-full"
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="submit"
                  className="btn-grey absolute right-0 top-0 bottom-0 rounded-full w-9 h-full p-0 flex items-center justify-center"
                  style={{ color: "#AAAAAA", right: "10px" }}
                >
                  <IconSearch className="mx-auto" style={{ fill: "#AAAAAA" }} />
                </button>
                {showSuggestions && (
                  <ul className="z-10 absolute top-11 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-800 rounded-md w-full p-2">
                    {[
                      "Muhammed Jasil",
                      "Amal Pradeep",
                      "Prince",
                      "Muhammed Jasil",
                      "Muhammed Jasil",
                    ].map((item) => (
                      <li
                        key={item}
                        className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                        onMouseDown={() => setSearch(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex text-gray-500 font-semibold dark:text-white-dark gap-y-4 w-full max-w-md">
                <button
                  type="button"
                  className="btn btn-green w-full text-base"
                  onClick={() => navigate("/clinic/bookings/patient-details")}
                >
                  New User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicBookingDoctor;

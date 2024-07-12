import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
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

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchModal, setSearchModal] = useState(false);
  const [singleDetails, setSingleDetails] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);
  const clinicId = userData?.UserClinic[0]?.clinic_id;

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  const openSearchModal = (user) => {
    setSingleDetails(user);
    setSearchModal(true);
  };

  const closeSearchModal = () => {
    setSearchModal(false);
  };

  // fetch Doctors function
  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/doctor/getalldr/${clinicId}?pageSize=${pageSize}&page=${page}`
      );
      setTotalDoctors(response.data?.count);
      setAllDoctors(response.data?.alldoctors);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // fetching Loans
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

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
          className="bg-white text-[#006241] py-2 px-4 rounded"
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
            className="w-full sm:w-1/2 md:w-1/3"
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
                  className="form-input form-input-green shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-[#F3F3F3] rounded-full h-11 placeholder-gray-400 pr-10 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ border: "none" }}
                />
                <button
                  type="submit"
                  className="btn-grey absolute right-0 top-0 bottom-0 rounded-full w-9 h-9 p-0 flex items-center justify-center"
                  style={{ color: "#AAAAAA", right: "10px" }}
                >
                  <IconSearch className="mx-auto" style={{ fill: "#AAAAAA" }} />
                </button>
                {showSuggestions && (
                  <ul className="z-10 absolute top-10 bg-white border border-gray-300 rounded-md mt-1 w-full">
                    {["Muhammed Jasil", "Amal Pradeep", "Prince"].map(
                      (item) => (
                        <li
                          key={item}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                          onMouseDown={() => setSearch(item)}
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>

              <div className="flex text-gray-500 font-semibold dark:text-white-dark gap-y-4 w-full max-w-md">
                <button type="button" className="btn btn-green w-full"
                style={{ fontSize: "17px" }}
                onClick={()=> navigate("/clinic/booking/PatientDetails")}
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

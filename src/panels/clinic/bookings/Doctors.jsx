import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Swal from "sweetalert2";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { Link, useLocation, useNavigate } from "react-router-dom";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const previousUrl = location?.state?.previousUrl;

  useEffect(() => {
    dispatch(setPageTitle("Doctor"));
  });

  const showBlockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to block this Owner!",
      showCancelButton: true,
      confirmButtonText: "Block",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: "Blocked!",
          text: "The Owner has been blocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  const showUnblockAlert = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You want to unblock this Owner!",
      showCancelButton: true,
      confirmButtonText: "Unblock",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: "Unblocked!",
          text: "The Owner has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  const [active, setActive] = useState(null);
  const [date1, setDate1] = useState("2022-07-05");
  

  const togglePara = (value) => {
    setActive((oldValue) => (oldValue === value ? null : value));
  };

  return (
    <div>
      <ScrollToTop />
      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
        <ul className="flex space-x-2 rtl:space-x-reverse mb-2">
          <li>
            <Link to="/clinic/doctors" className="text-primary hover:underline">
              Clinics
            </Link>
          </li>
          <li className="before:content-['/'] before:mr-2">
            <span>Doctors</span>
          </li>
        </ul>
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-start gap-1">
            <h5 className="text-base font-semibold dark:text-white-light">
              Active
            </h5>
            <label className="w-11 h-5 relative">
              <input
                type="checkbox"
                className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                id="custom_switch_checkbox_active"
                checked
                readOnly
              />
              <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
            </label>
          </div>
          <div className="flex items-start gap-1">
            <h5 className="text-base font-semibold dark:text-white-light">
              Blocked
            </h5>
            <label className="w-11 h-5 relative">
              <input
                type="checkbox"
                className="custom_switch absolute w-full h-full opacity-0 z-10 peer"
                id="custom_switch_checkbox_active"
                checked={false}
                readOnly
              />
              <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-3 before:h-3 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="panel mb-1">
        <div className="flex justify-between flex-wrap gap-4 sm:px-4">
          <div>
            <img
              src="/assets/images/profile-4.jpeg"
              alt="img"
              className="w-36 h-36 rounded-full object-cover mb-2"
            />
            <div className="text-2xl font-semibold capitalize">Doctor</div>
          </div>
          <label
            className="w-12 h-6 relative"
            onClick={(e) => {
              e.stopPropagation();
              showBlockAlert();
            }}
          >
            <input
              type="checkbox"
              className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
              id={`custom_switch_checkbox`}
              checked={true}
            />
            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
          </label>
        </div>
        <div className="text-left sm:px-4">
          <div className="mt-5">
            <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
              <div className="text-white-dark">Address :</div>
              <div>13 Tetrick Road, Cypress Gardens, Florida, 33884, US</div>
            </div>
            <div className="flex items-center sm:gap-2 flex-wrap mb-2 sm:mb-1">
              <div className="text-white-dark">Email :</div>
              <div>vristo@gmail.com</div>
            </div>
            <div className="flex items-center sm:gap-2 flex-wrap">
              <div className="text-white-dark">Phone :</div>
              <div>+1 (070) 123-4567</div>
            </div>
          </div>
        </div>
        <div className="my-5">
          <div className="form-input-wrapper">
            <Flatpickr
              value={date1}
              onChange={(date) => setDate1(date)}
              options={{
                dateFormat: "Y-m-d",
                position: "auto left",
                inline: true,
              }}
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;

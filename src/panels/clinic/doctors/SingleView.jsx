import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import Swal from "sweetalert2";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import { Link, useLocation, useNavigate } from "react-router-dom";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import AnimateHeight from "react-animate-height";

const SinglePage = () => {
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

  const togglePara = (value) => {
    setActive((oldValue) => (oldValue === value ? null : value));
  };

  // Array of weekdays
  const weekdays = [
    {
      id: "1",
      name: "Sunday",
      timings: [
        { time: "10:30 AM", period: "Morning" },
        { time: "2:00 PM", period: "Afternoon" },
      ],
    },
    {
      id: "2",
      name: "Monday",
      timings: [
        { time: "11:00 AM", period: "Morning" },
        { time: "2:30 PM", period: "Afternoon" },
      ],
    },
    {
      id: "3",
      name: "Tuesday",
      timings: [
        { time: "10:30 AM", period: "Morning" },
        { time: "2:00 PM", period: "Afternoon" },
      ],
    },
    {
      id: "4",
      name: "Wednesday",
      timings: [
        { time: "11:00 AM", period: "Morning" },
        { time: "2:30 PM", period: "Afternoon" },
      ],
    },
    {
      id: "5",
      name: "Thursday",
      timings: [
        { time: "10:30 AM", period: "Morning" },
        { time: "2:00 PM", period: "Afternoon" },
      ],
    },
    {
      id: "6",
      name: "Friday",
      timings: [
        { time: "11:00 AM", period: "Morning" },
        { time: "2:30 PM", period: "Afternoon" },
      ],
    },
    {
      id: "7",
      name: "Saturday",
      timings: [
        { time: "10:30 AM", period: "Morning" },
        { time: "2:00 PM", period: "Afternoon" },
      ],
    },
  ];

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
        <div className="my-6">
          <h5 className="text-base font-semibold mb-1 dark:text-white-light">
            Available Days:
          </h5>
          <div className="space-y-2 font-semibold">
            {weekdays.map((weekday) => (
              <div
                key={weekday.id}
                className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded"
              >
                <button
                  type="button"
                  className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${
                    active === weekday.id ? "!text-primary" : ""
                  }`}
                  onClick={() => togglePara(weekday.id)}
                >
                  {weekday.name}
                  <div
                    className={`ltr:ml-auto rtl:mr-auto ${
                      active === weekday.id ? "rotate-180" : ""
                    }`}
                  >
                    <IconCaretDown />
                  </div>
                </button>
                <div>
                  <AnimateHeight
                    duration={300}
                    height={active === weekday.id ? "auto" : 0}
                  >
                    <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                      <div className="flex items-center sm:justify-evenly flex-wrap gap-2 w-full">
                        {weekday.timings.map((timing, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <h5 className="text-sm font-semibold dark:text-white-light">
                              {timing.period}:
                            </h5>
                            <span className="text-slate-900 dark:text-slate-50 font-normal border border-primary px-2 py-0.5 rounded-md">
                              {timing.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimateHeight>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;

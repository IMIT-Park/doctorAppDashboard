import React, { useState, useEffect, useContext } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import AnimateHeight from "react-animate-height";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { toggleSidebar } from "../../store/themeConfigSlice";
import IconCaretDown from "../Icon/IconCaretDown";
import IconMenuDashboard from "../Icon/Menu/IconMenuDashboard";
import IconMenuDocumentation from "../Icon/Menu/IconMenuDocumentation";
import IconMenuUsers from "../Icon/Menu/IconMenuUsers";
import IconMenuChat from "../Icon/Menu/IconMenuChat";
import IconMenuDatatables from "../Icon/Menu/IconMenuDatatables";
import IconMenuMailbox from "../Icon/Menu/IconMenuMailbox";
import IconCaretsDown from "../Icon/IconCaretsDown";
import IconMenuInvoice from "../Icon/Menu/IconMenuInvoice";
import IconMenuTodo from "../Icon/Menu/IconMenuTodo";
import IconUserPlus from "../Icon/IconUserPlus";
import IconUser from "../Icon/IconUser";
import { UserContext } from "../../contexts/UseContext";

const Sidebar = () => {
  // role handler
  const { userDetails } = useContext(UserContext);
  const roleMap = {
    1: "superAdmin",
    2: "owner",
    3: "clinic",
    4: "doctor",
    5: "salesPerson",
    6: "supportUser",
  };
  const role = roleMap[userDetails?.role_id] || "superAdmin";


  const [currentMenu, setCurrentMenu] = useState("dashboard");
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const themeConfig = useSelector((state) => state.themeConfig);
  const semidark = useSelector((state) => state.themeConfig.semidark);
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleMenu = (value) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? "" : value;
    });
  };

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul = selector.closest("ul.sub-menu");
      if (ul) {
        let ele = ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    // Check the pathname and set the current menu accordingly
    if (location.pathname === "/admin/dashboard") {
      setCurrentMenu("admin-dashboard");
    } else if (location.pathname.includes("/admin/owners")) {
      setCurrentMenu("admin-owners");
    } else if (location.pathname === "/admin/reports") {
      setCurrentMenu("admin-reports");
    } else if (location.pathname === "/admin/sales") {
      setCurrentMenu("admin-sales");
    } else if (location.pathname === "/owner/dashboard") {
      setCurrentMenu("owner-dashboard");
    } else if (location.pathname === "/owner/clinics") {
      setCurrentMenu("owner-clinics");
    } else if (location.pathname === "/owner/subscription-plans") {
      setCurrentMenu("owner-subscription-plans");
    } else if (location.pathname === "/clinic/dashboard") {
      setCurrentMenu("clinic-dashboard");
    } else if (location.pathname === "/clinic/doctors") {
      setCurrentMenu("clinic-doctors");
    } else if (location.pathname === "/clinic/leaves") {
      setCurrentMenu("clinic-leaves");
    } else if (location.pathname === "/clinic/profile") {
      setCurrentMenu("clinic-profile");
    } else if (location.pathname === "/clinic/requestToDoctor") {
      setCurrentMenu("clinic-requestToDoctor");
    } else if (location.pathname === "/doctor/dashboard") {
      setCurrentMenu("doctor-dashboard");
    } else if (location.pathname === "/doctor/requests") {
      setCurrentMenu("doctor-requests");
    } else if (location.pathname === "/sales/dashboard") {
      setCurrentMenu("sales-dashboard");
    } else {
      setCurrentMenu("admin-dashboard");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [location]);

  return (
    <div className={semidark ? "dark" : ""}>
      <nav
        className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
          semidark ? "text-white-dark" : ""
        }`}
      >
        <div className="bg-white dark:bg-black h-full">
          <div className="flex justify-between items-center px-4 py-3">
            <NavLink
              to="/admin/dashboard"
              className="main-logo flex items-center shrink-0"
            >
              <img
                className="w-8 ml-[5px] flex-none"
                src="/assets/images/logo.png"
                alt="logo"
              />
              <span className="text-xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">
                {"MyDoctorsTime"}
              </span>
            </NavLink>

            <button
              type="button"
              className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="mt-10 h-[calc(100vh-80px)] relative">
            {role === "owner" ? (
              <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                <li className="nav-item">
                  <NavLink to="/owner/dashboard" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "owner-dashboard"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Dashboard"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/owner/clinics" className="group">
                    <div className="flex items-center">
                      <IconMenuTodo
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "owner-clinics" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Clinics"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/owner/chat" className="group">
                    <div className="flex items-center">
                      <IconMenuChat
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "owner-subscription-plans"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Chat"}
                      </span>
                    </div>
                  </NavLink>
                </li>
              </ul>
            ) : role === "clinic" ? (
              <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                <li className="nav-item">
                  <NavLink to="/clinic/dashboard" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "clinic-dashboard"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Dashboard"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/clinic/profile" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "clinic-profile"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Profile"}
                      </span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/clinic/doctors" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "clinic-doctors"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Doctors"}
                      </span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/clinic/bookings" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "clinic-bookings"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Bookings"}
                      </span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/clinic/leaves" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "clinic-leaves" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Leaves"}
                      </span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/clinic/requestToDoctor" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "clinic-requestToDoctor" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Request To Doctor"}
                      </span>
                    </div>
                  </NavLink>
                </li>
              </ul>
            ) : role === "doctor" ? (
              <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                <li className="nav-item">
                  <NavLink to="/doctor/dashboard" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "doctor-dashboard"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Dashboard"}
                      </span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/doctor/requests" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "doctor-requests"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Requests"}
                      </span>
                    </div>
                  </NavLink>
                </li>

              </ul>
            ) : role === "salesPerson" ? (
              <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                <li className="nav-item">
                  <NavLink to="/sales/dashboard" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "sales-dashboard"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Dashboard"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/sales/owners" className="group">
                    <div className="flex items-center">
                      <IconMenuUsers
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "sales-owners" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Owners"}
                      </span>
                    </div>
                  </NavLink>
                </li>
              </ul>
            ) : role === "supportUser" ? (
              <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                <li className="nav-item">
                  <NavLink to="/supportuser/dashboard" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "sales-dashboard"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Dashboard"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/supportuser/chats" className="group">
                    <div className="flex items-center">
                      <IconMenuChat
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "sales-dashboard"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Chats"}
                      </span>
                    </div>
                  </NavLink>
                </li>
              </ul>
            ) : (
              <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                <li className="nav-item">
                  <NavLink to="/admin/dashboard" className="group">
                    <div className="flex items-center">
                      <IconMenuDashboard
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "admin-dashboard"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Dashboard"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/owners" className="group">
                    <div className="flex items-center">
                      <IconMenuUsers
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "admin-owners" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Owners"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/clinics" className="group">
                    <div className="flex items-center">
                      <IconMenuTodo
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "admin-clinics" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Clinics"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/doctors" className="group">
                    <div className="flex items-center">
                      <IconMenuUsers
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "admin-doctors" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Doctors"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/sales" className="group">
                    <div className="flex items-center">
                      <IconMenuUsers
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "admin-sales" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Sales Persons"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/subscription-plans" className="group">
                    <div className="flex items-center">
                      <IconMenuDatatables
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "admin-doctors" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Subscription Plans"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/supportuser" className="group">
                    <div className="flex items-center">
                      <IconUser
                        fill
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "clinic-chats" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Support User"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/complaints" className="group">
                    <div className="flex items-center">
                      <IconMenuDocumentation
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "admin-complaints"
                            ? "!text-primary"
                            : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Complaints"}
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin/messages" className="group">
                    <div className="flex items-center">
                      <IconMenuChat
                        className={`group-hover:!text-primary shrink-0 ${
                          currentMenu === "admin-doctors" ? "!text-primary" : ""
                        }`}
                      />
                      <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {"Messages"}
                      </span>
                    </div>
                  </NavLink>
                </li>
              </ul>
            )}
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

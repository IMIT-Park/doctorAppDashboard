import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toggleTheme, toggleSidebar } from "../../store/themeConfigSlice";
import Dropdown from "../Dropdown";
import IconMenu from "../Icon/IconMenu";
import IconXCircle from "../Icon/IconXCircle";
import IconSun from "../Icon/IconSun";
import IconMoon from "../Icon/IconMoon";
import IconLaptop from "../Icon/IconLaptop";
import IconInfoCircle from "../Icon/IconInfoCircle";
import IconBellBing from "../Icon/IconBellBing";
import IconUser from "../Icon/IconUser";
import IconLogout from "../Icon/IconLogout";
import IconMailDot from "../Icon/IconMailDot";
import IconArrowLeft from "../Icon/IconArrowLeft";
import { UserContext } from "../../contexts/UseContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    userDetails,
    setUserDetails,
    setIds,
    setPatientDetails,
    setBookingDetails,
  } = useContext(UserContext);

  const createUserData = (userDetails) => {
    const userData = {
      user_id: userDetails?.user_id,
      role_id: userDetails?.role_id,
      user_name: userDetails?.user_name,
      password: userDetails?.password,
      email: userDetails?.email,
      status: userDetails?.status,
      additionalDetails: {},
    };

    if (userDetails?.UserClinic?.length > 0) {
      userData.additionalDetails = userDetails?.UserClinic[0];
    }
    if (userDetails?.UserOwner?.length > 0) {
      userData.additionalDetails = userDetails?.UserOwner[0];
    }
    if (userDetails?.UserDoctor?.length > 0) {
      userData.additionalDetails = userDetails?.UserDoctor[0];
    }
    if (userDetails?.UserSalesperson?.length > 0) {
      userData.additionalDetails = userDetails?.UserSalesperson[0];
    }
    if (userDetails?.UserSupportuser?.length > 0) {
      userData.additionalDetails = userDetails?.UserSupportuser[0];
    }

    return userData;
  };

  const userData = createUserData(userDetails);

  useEffect(() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const all = document.querySelectorAll(
        "ul.horizontal-menu .nav-link.active"
      );
      for (let i = 0; i < all.length; i++) {
        all[i]?.classList.remove("active");
      }
      const ul = selector.closest("ul.sub-menu");
      if (ul) {
        let ele = ul.closest("li.menu").querySelectorAll(".nav-link");
        if (ele.length > 0) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add("active");
          });
        }
      }
    }
  }, [location]);

  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;

  const themeConfig = useSelector((state) => state.themeConfig);
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      profile: "user-profile.jpeg",
      message:
        '<strong className="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
      time: "45 min ago",
    },
    {
      id: 2,
      profile: "profile-34.jpeg",
      message:
        '<strong className="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
      time: "9h Ago",
    },
    {
      id: 3,
      profile: "profile-16.jpeg",
      message:
        '<strong className="text-sm mr-1">Anna Morgan</strong>Upload a file',
      time: "9h Ago",
    },
  ]);

  const removeNotification = (value) => {
    setNotifications(notifications.filter((user) => user.id !== value));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setUserDetails(null);
    setIds(null);
    setBookingDetails(null);
    setPatientDetails(null);
    navigate("/");
  };

  function createMarkup(messages) {
    return { __html: messages };
  }

  const [messages, setMessages] = useState([
    {
      id: 1,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
      title: "Congratulations!",
      message: "Your OS has been updated.",
      time: "1hr",
    },
    {
      id: 2,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg g xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
      title: "Did you know?",
      message: "You can switch between artboards.",
      time: "2hr",
    },
    {
      id: 3,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
      title: "Something went wrong!",
      message: "Send Reposrt",
      time: "2days",
    },
    {
      id: 4,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
      title: "Warning",
      message: "Your password strength is low.",
      time: "5days",
    },
  ]);

  return (
    <header
      className={`z-40 ${
        themeConfig.semidark && themeConfig.menu === "horizontal" ? "dark" : ""
      }`}
    >
      <div className="shadow-sm">
        <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
            <Link
              to="/admin/dashboard"
              className="main-logo flex items-center shrink-0"
            >
              <img
                className="w-8 ltr:-ml-1 rtl:-mr-1 inline"
                src="/assets/images/logo.png"
                alt="logo"
              />
              <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">
                My Doctors Time
              </span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
              onClick={() => {
                dispatch(toggleSidebar());
              }}
            >
              <IconMenu className="w-5 h-5" />
            </button>
          </div>
          <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex justify-end items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
            <div>
              {themeConfig.theme === "light" ? (
                <button
                  className={`${
                    themeConfig.theme === "light" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-[#3f9679] hover:bg-white-light/90 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => {
                    dispatch(toggleTheme("dark"));
                  }}
                >
                  <IconSun />
                </button>
              ) : (
                ""
              )}
              {themeConfig.theme === "dark" && (
                <button
                  className={`${
                    themeConfig.theme === "dark" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-[#3f9679] hover:bg-white-light/90 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => {
                    dispatch(toggleTheme("system"));
                  }}
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === "system" && (
                <button
                  className={`${
                    themeConfig.theme === "system" &&
                    "flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-[#3f9679] hover:bg-white-light/90 dark:hover:bg-dark/60"
                  }`}
                  onClick={() => {
                    dispatch(toggleTheme("light"));
                  }}
                >
                  <IconLaptop />
                </button>
              )}
            </div>

            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={<IconMailDot />}
              >
                <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[375px] text-xs">
                  <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                    <div className="hover:!bg-transparent overflow-hidden relative rounded-t-md p-5 text-white w-full !h-[68px]">
                      <div
                        className="absolute h-full w-full bg-no-repeat bg-center bg-cover inset-0 bg-"
                        style={{
                          backgroundImage: `url('/assets/images/menu-heade.jpg')`,
                          backgroundRepeat: "no-repeat",
                          width: "100%",
                          height: "100%",
                        }}
                      ></div>
                      <h4 className="font-semibold relative z-10 text-lg">
                        Messages
                      </h4>
                    </div>
                  </li>
                  {messages.length > 0 ? (
                    <>
                      <li onClick={(e) => e.stopPropagation()}>
                        {messages.map((message) => {
                          return (
                            <div
                              key={message.id}
                              className="flex items-center py-3 px-5"
                            >
                              <div
                                dangerouslySetInnerHTML={createMarkup(
                                  message.image
                                )}
                              ></div>
                              <span className="px-3 dark:text-gray-500">
                                <div className="font-semibold text-sm dark:text-white-light/90">
                                  {message.title}
                                </div>
                                <div>{message.message}</div>
                              </span>
                              <span className="font-semibold bg-white-dark/20 rounded text-dark/60 px-1 ltr:ml-auto rtl:mr-auto whitespace-pre dark:text-white-dark ltr:mr-2 rtl:ml-2">
                                {message.time}
                              </span>
                              <button
                                type="button"
                                className="text-neutral-300 hover:text-danger"
                                onClick={() => removeMessage(message.id)}
                              >
                                <IconXCircle />
                              </button>
                            </div>
                          );
                        })}
                      </li>
                      <li className="border-t border-white-light text-center dark:border-white/10 mt-5">
                        <button
                          type="button"
                          className="text-primary font-semibold group dark:text-gray-400 justify-center !py-4 !h-[48px]"
                        >
                          <span className="group-hover:underline ltr:mr-1 rtl:ml-1">
                            VIEW ALL ACTIVITIES
                          </span>
                          <IconArrowLeft className="group-hover:translate-x-1 transition duration-300 ltr:ml-1 rtl:mr-1" />
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]"
                      >
                        <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4 text-primary">
                          <IconInfoCircle fill={true} className="w-10 h-10" />
                        </div>
                        No data available.
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div>

            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement="bottom-end"
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <span>
                    <IconBellBing />
                    <span className="flex absolute w-3 h-3 ltr:right-0 rtl:left-0 top-0">
                      <span className="animate-ping absolute ltr:-left-[3px] rtl:-right-[3px] -top-[3px] inline-flex h-full w-full rounded-full bg-success/50 opacity-75"></span>
                      <span className="relative inline-flex rounded-full w-[6px] h-[6px] bg-success"></span>
                    </span>
                  </span>
                }
              >
                <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[350px] divide-y dark:divide-white/10">
                  <li onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center px-4 py-2 justify-between font-semibold">
                      <h4 className="text-lg">Notification</h4>
                      {notifications.length ? (
                        <span className="badge bg-primary/80">
                          {notifications.length}New
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </li>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notification) => {
                        return (
                          <li
                            key={notification.id}
                            className="dark:text-white-light/90"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="group flex items-center px-4 py-2">
                              <div className="grid place-content-center rounded">
                                <div className="w-12 h-12 relative">
                                  <img
                                    className="w-12 h-12 rounded-full object-cover"
                                    alt="profile"
                                    src={`/assets/images/${notification.profile}`}
                                  />
                                  <span className="bg-success w-2 h-2 rounded-full block absolute right-[6px] bottom-0"></span>
                                </div>
                              </div>
                              <div className="ltr:pl-3 rtl:pr-3 flex flex-auto">
                                <div className="ltr:pr-3 rtl:pl-3">
                                  <h6
                                    dangerouslySetInnerHTML={{
                                      __html: notification.message,
                                    }}
                                  ></h6>
                                  <span className="text-xs block font-normal dark:text-gray-500">
                                    {notification.time}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="ltr:ml-auto rtl:mr-auto text-neutral-300 hover:text-danger opacity-0 group-hover:opacity-100"
                                  onClick={() =>
                                    removeNotification(notification.id)
                                  }
                                >
                                  <IconXCircle />
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                      <li>
                        <div className="p-4">
                          <button
                            className="btn btn-primary block w-full btn-small"
                            onClick={() => navigate(`/admin/chats`)}
                          >
                            Read All Notifications
                          </button>
                        </div>
                      </li>
                    </>
                  ) : (
                    <li onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]"
                      >
                        <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4 text-primary">
                          <IconInfoCircle fill={true} className="w-10 h-10" />
                        </div>
                        No data available.
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div>
            <div className="dropdown shrink-0 flex">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
                btnClassName="relative group block"
                button={
                  <img
                    className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                    src="/assets/images/empty-user.png"
                    alt="userProfile"
                  />
                }
              >
                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-2 py-4">
                      <img
                        className="rounded-md w-10 h-10 object-cover"
                        src="/assets/images/empty-user.png"
                        alt="userProfile"
                      />
                      <div className="pl-2 truncate">
                        <h4 className="text-xs">
                          {userData?.email ? userData?.email : ""}
                        </h4>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white capitalize"
                        >
                          {userData?.additionalDetails?.name
                            ? userData?.additionalDetails?.name
                            : "Admin"}
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link to="/profile" className="dark:hover:text-white">
                      <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                      Profile
                    </Link>
                  </li>

                  <li className="border-t border-white-light dark:border-white-light/10">
                    <button
                      className="text-danger !py-3"
                      onClick={handleLogout}
                    >
                      <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

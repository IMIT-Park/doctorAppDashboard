import { setPageTitle } from "../../store/themeConfigSlice";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../../components/Dropdown";
import IconHorizontalDots from "../../components/Icon/IconHorizontalDots";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";
import IconMenuUsers from "../../components/Icon/Menu/IconMenuUsers";
import IconMenuDatatables from "../../components/Icon/Menu/IconMenuDatatables";
import IconMenuInvoice from "../../components/Icon/Menu/IconMenuInvoice";
import IconLoader from "../../components/Icon/IconLoader";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isDark = useSelector(
    (state) =>
      state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
  );

  useEffect(() => {
    dispatch(setPageTitle("Dashboard"));
  });

  const revenueChart = {
    series: [
      {
        name: "Income",
        data: [
          16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000,
          14000, 17000,
        ],
      },
      {
        name: "Expenses",
        data: [
          16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000,
          18000, 19000,
        ],
      },
    ],
    options: {
      chart: {
        height: 325,
        type: "area",
        fontFamily: "Nunito, sans-serif",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: "smooth",
        width: 2,
        lineCap: "square",
      },
      dropShadow: {
        enabled: true,
        opacity: 0.2,
        blur: 10,
        left: -7,
        top: 22,
      },
      colors: isDark ? ["#2196F3", "#E7515A"] : ["#1B55E2", "#E7515A"],
      markers: {
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 6,
            fillColor: "#1B55E2",
            strokeColor: "transparent",
            size: 7,
          },
          {
            seriesIndex: 1,
            dataPointIndex: 5,
            fillColor: "#E7515A",
            strokeColor: "transparent",
            size: 7,
          },
        ],
      },
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
        },
        labels: {
          offsetX: 0,
          offsetY: 5,
          style: {
            fontSize: "12px",
            cssClass: "apexcharts-xaxis-title",
          },
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: (value) => {
            return value / 1000 + "K";
          },
          offsetX: -10,
          offsetY: 0,
          style: {
            fontSize: "12px",
            cssClass: "apexcharts-yaxis-title",
          },
        },
        opposite: false,
      },
      grid: {
        borderColor: isDark ? "#191E3A" : "#E0E6ED",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "16px",
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      tooltip: {
        marker: {
          show: true,
        },
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: isDark ? 0.19 : 0.28,
          opacityTo: 0.05,
          stops: isDark ? [100, 100] : [45, 100],
        },
      },
    },
  };

  //Sales By Category
  const salesByCategory = {
    series: [985, 737, 270],
    options: {
      chart: {
        type: "donut",
        height: 460,
        fontFamily: "Nunito, sans-serif",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 25,
        colors: isDark ? "#0e1726" : "#fff",
      },
      colors: isDark
        ? ["#5c1ac3", "#e2a03f", "#e7515a", "#e2a03f"]
        : ["#e2a03f", "#5c1ac3", "#e7515a"],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        height: 50,
        offsetY: 20,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            background: "transparent",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "29px",
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "26px",
                color: isDark ? "#bfc9d4" : undefined,
                offsetY: 16,
                formatter: (val) => {
                  return val;
                },
              },
              total: {
                show: true,
                label: "Total",
                color: "#888ea8",
                fontSize: "29px",
                formatter: (w) => {
                  return w.globals.seriesTotals.reduce(function (a, b) {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      labels: ["Apparel", "Sports", "Others"],
      states: {
        hover: {
          filter: {
            type: "none",
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: "none",
            value: 0.15,
          },
        },
      },
    },
  };

  // const clinicsData = [
  //   {
  //     id: 1,
  //     name: "Dr. Luffy Clinic",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
  //     daysLeft: 10,
  //     imageUrl:
  //       "https://wallpapers-clan.com/wp-content/uploads/2024/02/monkey-d-luffy-clouds-one-piece-desktop-wallpaper-preview.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "Dr. Luffy Clinic",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
  //     daysLeft: 10,
  //     imageUrl:
  //       "https://wallpapers-clan.com/wp-content/uploads/2024/02/monkey-d-luffy-clouds-one-piece-desktop-wallpaper-preview.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "Dr. Sanji Clinic",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
  //     daysLeft: 5,
  //     imageUrl:
  //       "https://wallpapers-clan.com/wp-content/uploads/2024/04/sanji-smoking-one-piece-desktop-wallpaper-preview.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "Dr. Usopp Clinic",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
  //     daysLeft: 5,
  //     imageUrl:
  //       "https://e1.pxfuel.com/desktop-wallpaper/292/261/desktop-wallpaper-70-god-usopp-god-usopp-thumbnail.jpg",
  //   },
  //   {
  //     id: 5,
  //     name: "Dr. Zoro Clinic",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
  //     daysLeft: 8,
  //     imageUrl:
  //       "https://wallpapers-clan.com/wp-content/uploads/2024/02/one-piece-roronoa-zoro-with-sword-turquoise-desktop-wallpaper-cover.jpg",
  //   },
  // ];

  return (
    <div>
      {/* {loading ? (
        <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
      ) : (
        <>
          <div
            className={`w-full ${
              clinicsData.length > 1
                ? "grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 gap-2"
                : "flex flex-col lg:flex-row xl:flex-row border"
            }`}
          >
            {clinicsData.map((clinic) => (
              <div
                key={clinic.id}
                className={`w-full ${
                  clinicsData.length > 1
                    ? "text-sm md:text-base"
                    : "text-base md:text-lg"
                } flex flex-col lg:flex-row xl:flex-row ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                } rounded-lg p-4`}
              >
                <div
                  className={`relative w-full lg:w-1/2 aspect-video ${
                    clinicsData.length > 1 ? "h-full" : "h-full"
                  }`}
                >
                  {clinic.imageUrl ? (
                    <div className="relative w-full h-full rounded-lg aspect-video">
                      <img
                        src={clinic.imageUrl}
                        className="relative w-full h-full rounded-lg"
                        alt="Clinic Banner"
                      />
                      <div className="absolute lg:-right-2 lg:top-0 w-full h-full lg:bg-gradient-to-r from-transparent to-gray-100 dark:to-gray-800 bottom-0 left-0 bg-gradient-to-b"></div>
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg" />
                  )}
                </div>
                <div className="relative w-full lg:w-2/3 xl:w-2/3 flex flex-col justify-between lg:ml-0 xl:ml-0 mt-4 lg:mt-0 xl:mt-0">
                  <div
                    className={`text-[#000000] dark:text-green-800 font-semibold ${
                      clinicsData.length > 1
                        ? "text-xl"
                        : "text-2xl lg:text-2xl mt-5 sm:mt-5 lg:-mt-0"
                    } p-1`}
                  >
                    {clinic.name}
                  </div>
                  <div
                    className={`text-gray-600 dark:text-slate-300 p-1 ${
                      clinicsData.length > 1
                        ? "text-sm"
                        : "text-xl lg:text-xl sm:mt-5"
                    }`}
                  >
                    {clinic.description}
                  </div>
                  <div
                    className={`flex p-1 ${
                      clinicsData.length > 1
                        ? "sm:flex-col sm:items-center xl:items-start gap-2"
                        : "items-center justify-between sm:mt-5 lg:mb-10"
                    }`}
                  >
                    <div
                      className={`text-blue-800 font-bold ${
                        clinicsData.length > 1
                          ? "text-base"
                          : "text-xl lg:text-xl"
                      }`}
                    >
                      ({clinic.daysLeft} days left for subscription)
                    </div>
                    <div className="flex items-center">
                      <button
                        className={`bg-green-900 text-white px-4 py-2 rounded ${
                          clinicsData.length > 1
                            ? "text-sm"
                            : "text-xl lg:text-xl"
                        }`}
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )} */}
      <ul className="flex space-x-2 rtl:space-x-reverse mt-5">
        <li className="ltr:before:mr-2 rtl:before:ml-2">
          <span>Dashboard</span>
        </li>
      </ul>
      <div className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
          {/* Total Users */}
          <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">
                Clinics
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                <CountUp start={0} end={67} duration={4}></CountUp>{" "}
              </div>
            </div>
            <IconMenuUsers className="absolute top-[50%] translate-y-[-50%] right-5 size-8" />
          </div>

          {/* Total Transactions */}
          <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">
                Transactions
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                <CountUp start={0} end={74} duration={4}></CountUp>
              </div>
            </div>
            <IconMenuInvoice className="absolute top-[50%] translate-y-[-50%] right-5 size-8" />
          </div>

          {/*  Total Banners */}
          <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">
                Banners
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                <CountUp start={0} end={34} duration={4}></CountUp>
              </div>
            </div>
            <IconMenuDatatables className="absolute top-[50%] translate-y-[-50%] right-5 size-8" />
          </div>

          {/* Bounce Rate */}
          <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">
                Bounce Rate
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                <CountUp start={0} end={49} duration={4}></CountUp>%
              </div>
            </div>
            <IconMenuUsers className="absolute top-[50%] translate-y-[-50%] right-5 size-8" />
          </div>
        </div>

        <div className="pt-5">
          <div className="grid xl:grid-cols-3 gap-6 mb-6 w-100">
            <div className="panel h-full xl:col-span-2 min-w-0">
              <div className="flex items-center justify-between dark:text-white-light mb-5">
                <h5 className="font-semibold text-lg">Revenue</h5>
                <div className="dropdown">
                  <Dropdown
                    offset={[0, 1]}
                    placement="bottom-end"
                    button={
                      <IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />
                    }
                  >
                    <ul>
                      <li>
                        <button type="button">Weekly</button>
                      </li>
                      <li>
                        <button type="button">Monthly</button>
                      </li>
                      <li>
                        <button type="button">Yearly</button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>
              </div>
              <p className="text-lg dark:text-white-light/90">
                Total Profit <span className="text-primary ml-2">$10,840</span>
              </p>
              <div className="relative">
                <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                  {loading ? (
                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                      <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                    </div>
                  ) : (
                    <ReactApexChart
                      series={revenueChart.series}
                      options={revenueChart.options}
                      type="area"
                      height={325}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="panel h-full">
              <div className="flex items-center mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">
                  Sales By Category
                </h5>
              </div>
              <div>
                <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                  {loading ? (
                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                      <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                    </div>
                  ) : (
                    <ReactApexChart
                      series={salesByCategory.series}
                      options={salesByCategory.options}
                      type="donut"
                      height={460}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import IconSearch from "../../../components/Icon/IconSearch";
import NetworkHandler, { imageBaseUrl } from "../../../utils/NetworkHandler";

const Clinics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(setPageTitle("Clinics"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const [activeStatus, setActiveStatus] = useState({})

  
  const [search, setSearch] = useState("");
  const [totalClinics, setTotalClinics] = useState(0);
  const [allClinics, setAllClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  const userDetails = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDetails);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
  }, [page, pageSize]);

  // fetch Clininc function
  const fetchData = async () => {
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/clinic/getall?page=${page}&pagesize=${pageSize}`
      );
      console.log(response);
      setTotalClinics(response.data?.Clinic?.count);
      setAllClinics(response.data?.Clinic?.rows);
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

  

  const showMessage = (msg = "", type = "success") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

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
        setActiveStatus((prevState) => ({ ...prevState, [id]: false }));
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
        setActiveStatus((prevState) => ({ ...prevState, [id]: true }));
        Swal.fire({
          title: "Unblocked!",
          text: "The Owner has been unblocked.",
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  return (
    <div>
      <ScrollToTop />
      <div className="flex items-start justify-end gap-2 flex-wrap mb-1">
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

      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Clinics
            </h5>
            <Tippy content="Total Clinics">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalClinics} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>
          <div>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="mx-auto w-full mb-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Search Clinic..."
                  className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center"
                >
                  <IconSearch className="mx-auto" />
                </button>
              </div>
            </form>
          </div>
        </div>
        {loading ? (
          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
        ) : (
          <div className="datatables">
            <DataTable
              noRecordsText="No Clinics to show"
              noRecordsIcon={
                <span className="mb-2">
                  <img src={emptyBox} alt="" className="w-10" />
                </span>
              }
              mih={180}
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={allClinics}
              onRowClick={() =>
                navigate("/admin/clinics/doctors", {
                  state: { previousUrl: location.pathname },
                })
              }
              columns={[
                {
                  accessor: "No",
                  title: "No",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                {
                  accessor: "owner_id",
                  title: "Owner Id",
                },
                { accessor: "name", title: "Name" },
                { accessor: "phone" },
                { accessor: "place", title: "Place" },
                { accessor: "address", title: "Address" },
                {
                  accessor: "googleLocation",
                  title: "Location",
                  render: (rowData) => {
                    const { lat, long } = JSON.parse(rowData.googleLocation);
                    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
                    return (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        Clinic Location
                      </a>
                    );
                  },
                },
                {
                  accessor: "banner_img_url",
                  title: "Banner Image",
                  render: (rowData) => (
                    <img
                      src={imageBaseUrl + rowData?.banner_img_url}
                      alt="Banner"
                      className="h-10 w-auto object-cover"
                    />
                  ),
                },

                {
                  accessor: "Actions",
                  textAlignment: "center",
                  render: (rowData) => (
                    <Tippy content="Block/Unblock">
                      <label
                        className="w-[46px] h-[22px] relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleClinicStatus(rowData.User.status);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                          id={`custom_switch_checkbox${rowData.User.user_id}`}
                          checked={rowData.User.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (rowData.User.status) {
                              showBlockAlert(rowData.id);
                            } else {
                              showUnblockAlert(rowData.id);
                            }
                          }}
                        />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-[14px] before:h-[14px] before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                      </label>
                    </Tippy>
                  ),
                },
              ]}
              totalRecords={totalClinics}
              recordsPerPage={pageSize}
              page={page}
              onPageChange={(p) => setPage(p)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setPageSize}
              minHeight={200}
              paginationText={({ from, to, totalRecords }) =>
                `Showing  ${from} to ${to} of ${totalRecords} entries`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Clinics;

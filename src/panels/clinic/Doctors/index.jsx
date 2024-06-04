import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconEdit from "../../../components/Icon/IconEdit";
import Swal from "sweetalert2";
import IconUserPlus from "../../../components/Icon/IconUserPlus";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { Link, useNavigate } from "react-router-dom";
import IconEye from "../../../components/Icon/IconEye";

const rowData = [
  {
    id: 1,
    firstName: "Caroline",
    lastName: "Jensen",
    email: "carolinejensen@zidant.com",
    dob: "2004-05-28",
    address: {
      street: "529 Scholes Street",
      city: "Temperanceville",
      zipcode: 5235,
      geo: {
        lat: 23.806115,
        lng: 164.677197,
      },
    },
    phone: "+1 (821) 447-3782",
    isActive: true,
    age: 39,
    company: "POLARAX",
  },
  {
    id: 2,
    firstName: "Celeste",
    lastName: "Grant",
    email: "celestegrant@polarax.com",
    dob: "1989-11-19",
    address: {
      street: "639 Kimball Street",
      city: "Bascom",
      zipcode: 8907,
      geo: {
        lat: 65.954483,
        lng: 98.906478,
      },
    },
    phone: "+1 (838) 515-3408",
    isActive: false,
    age: 32,
    company: "MANGLO",
  },
  {
    id: 3,
    firstName: "Tillman",
    lastName: "Forbes",
    email: "tillmanforbes@manglo.com",
    dob: "2016-09-05",
    address: {
      street: "240 Vandalia Avenue",
      city: "Thynedale",
      zipcode: 8994,
      geo: {
        lat: -34.949388,
        lng: -82.958111,
      },
    },
    phone: "+1 (969) 496-2892",
    isActive: false,
    age: 26,
    company: "APPLIDECK",
  },
  {
    id: 4,
    firstName: "Daisy",
    lastName: "Whitley",
    email: "daisywhitley@applideck.com",
    dob: "1987-03-23",
    address: {
      street: "350 Pleasant Place",
      city: "Idledale",
      zipcode: 9369,
      geo: {
        lat: -54.458809,
        lng: -127.476556,
      },
    },
    phone: "+1 (861) 564-2877",
    isActive: true,
    age: 21,
    company: "VOLAX",
  },
  {
    id: 5,
    firstName: "Weber",
    lastName: "Bowman",
    email: "weberbowman@volax.com",
    dob: "1983-02-24",
    address: {
      street: "154 Conway Street",
      city: "Broadlands",
      zipcode: 8131,
      geo: {
        lat: 54.501351,
        lng: -167.47138,
      },
    },
    phone: "+1 (962) 466-3483",
    isActive: false,
    age: 26,
    company: "ORBAXTER",
  },
  {
    id: 6,
    firstName: "Buckley",
    lastName: "Townsend",
    email: "buckleytownsend@orbaxter.com",
    dob: "2011-05-29",
    address: {
      street: "131 Guernsey Street",
      city: "Vallonia",
      zipcode: 6779,
      geo: {
        lat: -2.681655,
        lng: 3.528942,
      },
    },
    phone: "+1 (884) 595-2643",
    isActive: true,
    age: 40,
    company: "OPPORTECH",
  },
  {
    id: 7,
    firstName: "Latoya",
    lastName: "Bradshaw",
    email: "latoyabradshaw@opportech.com",
    dob: "2010-11-23",
    address: {
      street: "668 Lenox Road",
      city: "Lowgap",
      zipcode: 992,
      geo: {
        lat: 36.026423,
        lng: 130.412198,
      },
    },
    phone: "+1 (906) 474-3155",
    isActive: true,
    age: 24,
    company: "GORGANIC",
  },
  {
    id: 8,
    firstName: "Kate",
    lastName: "Lindsay",
    email: "katelindsay@gorganic.com",
    dob: "1987-07-02",
    address: {
      street: "773 Harrison Avenue",
      city: "Carlton",
      zipcode: 5909,
      geo: {
        lat: 42.464724,
        lng: -12.948403,
      },
    },
    phone: "+1 (930) 546-2952",
    isActive: true,
    age: 24,
    company: "AVIT",
  },
  {
    id: 9,
    firstName: "Marva",
    lastName: "Sandoval",
    email: "marvasandoval@avit.com",
    dob: "2010-11-02",
    address: {
      street: "200 Malta Street",
      city: "Tuskahoma",
      zipcode: 1292,
      geo: {
        lat: -52.206169,
        lng: 74.19452,
      },
    },
    phone: "+1 (927) 566-3600",
    isActive: false,
    age: 28,
    company: "QUILCH",
  },
  {
    id: 10,
    firstName: "Decker",
    lastName: "Russell",
    email: "deckerrussell@quilch.com",
    dob: "1994-04-21",
    address: {
      street: "708 Bath Avenue",
      city: "Coultervillle",
      zipcode: 1268,
      geo: {
        lat: -41.550295,
        lng: -146.598075,
      },
    },
    phone: "+1 (846) 535-3283",
    isActive: false,
    age: 27,
    company: "MEMORA",
  },
];

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Doctors"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = rowData.slice(0, pageSize);
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [addSalesPersonModal, setAddSalesPersonModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(rowData.slice(from, to));
  }, [page, pageSize]);

  // handle sales person modal
  const openAddSalesPersonModal = () => {
    setAddSalesPersonModal(true);
  };

  const closeAddSalesPersonModal = () => {
    setAddSalesPersonModal(false);
    setInput({
      ...input,
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    });
  };

  const saveSalesPerson = () => {
    if (
      !input.name ||
      !input.email ||
      !input.phone ||
      !input.address ||
      !input.password ||
      !input.confirmPassword
    ) {
      showMessage("Please fill in all required fields", "error");
      return true;
    }

    if (input.password !== input.confirmPassword) {
      showMessage("Passwords are not match", "error");
      return true;
    }

    showMessage("Sales Person has been added successfully.");
    setAddUserModal(false);
  };

  // handle Delete Modal
  const openDeleteConfirmModal = () => {
    setDeleteModal(true);
  };
  const closeDeleteConfirmModal = () => {
    setDeleteModal(false);
  };

  const deleteUser = () => {
    showMessage("User has been deleted successfully.");
    setDeleteModal(false);
  };

  const showMessage = (msg = "", type = "success") => {
    const toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      showCloseButton: true,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

  // handle view modal
  const openViewModal = () => {
    setViewModal(true);
  };

  const closeViewModal = () => {
    setViewModal(false);
  };

  return (
    <div>
      <ScrollToTop />
      <div className="panel mt-1">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Doctors
            </h5>
            <Tippy content="Total Doctor">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={rowData.length} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>
          <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Add Sales Person">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openAddSalesPersonModal()}
              >
                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                Add Doctors
              </button>
            </Tippy>
          </div>
        </div>
        {/* <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" /> */}
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
            records={recordsData}
            columns={[
              { accessor: "id", title: "ID" },
              {
                accessor: "firstName",
                title: "Name",
                render: (row) => row.firstName + " " + row.lastName,
              },
              { accessor: "email" },
              // { accessor: "email", title: "Username" },
              { accessor: "phone" },
              { accessor: "address.street", title: "Address" },
              {
                accessor: "Actions",
                textAlignment: "center",
                render: (rowData) => (
                  <div className="flex gap-4 items-center w-max mx-auto">
                    <Tippy content="Edit">
                      <button
                        className="flex hover:text-info"
                        onClick={(e) => {
                          e.stopPropagation();
                          addUser();
                        }}
                      >
                        <IconEdit className="w-4.5 h-4.5" />
                      </button>
                    </Tippy>
                    {/* <Tippy content="View">
                      <button
                        className="flex hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewModal();
                        }}
                      >
                        <IconEye />
                      </button>
                    </Tippy> */}
                    <Tippy content="Delete">
                      <button
                        type="button"
                        className="flex hover:text-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirmModal();
                        }}
                      >
                        <IconTrashLines />
                      </button>
                    </Tippy>
                  </div>
                ),
              },
            ]}
            totalRecords={rowData.length}
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
      </div>
      {/* add sales person modal */}
      {/* <AddSalesPerson
        open={addSalesPersonModal}
        closeModal={closeAddSalesPersonModal}
      /> */}

      {/* delete sales person modal */}
      {/* <DeleteSalesPerson
        open={deleteModal}
        closeModal={closeDeleteConfirmModal}
      /> */}
    </div>
  );
};

export default Doctors;

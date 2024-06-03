import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import IconTrashLines from "../../../components/Icon/IconTrashLines";
import IconEye from "../../../components/Icon/IconEye";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import Swal from "sweetalert2";
import IconPencilPaper from "../../../components/Icon/IconPencilPaper";
import IconCoffee from "../../../components/Icon/IconCoffee";
import IconCalendar from "../../../components/Icon/IconCalendar";
import IconMapPin from "../../../components/Icon/IconMapPin";
import IconMail from "../../../components/Icon/IconMail";
import IconPhone from "../../../components/Icon/IconPhone";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import { useNavigate } from "react-router-dom";
import SendMessage from "./SendMessage";
import ViewMessage from "./ViewMessage";

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

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Messages"));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = rowData.slice(0, pageSize);
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [addUserModal, setAddUserModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sendMessage, setSendMessage] = useState(false);


  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(rowData.slice(from, to));
  }, [page, pageSize]);

  // send message modal handler
  const openSendMessage = () => {
    setSendMessage(true);
  };
  const closeSendMessage = () => {
    setSendMessage(false);
  };

  const saveUser = () => {
    // if (!params.name) {
    //     showMessage('Name is required.', 'error');
    //     return true;
    // }
    showMessage("User has been saved successfully.");
    setAddUserModal(false);
  };

  const deleteConfirm = () => {
    setDeleteModal(true);
  };

  const deleteUser = () => {
    showMessage("User has been deleted successfully.");
    setDeleteModal(false);
  };

  // view message modal handler
  const openViewMessage = () => {
    setViewModal(true);
  };
  const closeViewMessage = () => {
    setViewModal(false);
  };

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

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Messages
            </h5>
            <Tippy content="Total Messages">
              <span className="badge bg-lime-600 p-0.5 px-1 rounded-full">
                <CountUp start={0} end={rowData.length} duration={3}></CountUp>
              </span>
            </Tippy>
          </div>
          <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <Tippy content="Click to Send Message">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openSendMessage()}
              >
                <IconPencilPaper className="ltr:mr-2 rtl:ml-2" />
                Send Message
              </button>
            </Tippy>
          </div>
        </div>
        {/* <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" /> */}
        <div className="datatables">
          <DataTable
            noRecordsText="No Owners to show"
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
              { accessor: "firstName", title: "First Name" },
              { accessor: "lastName", title: "Last Name" },
              { accessor: "email" },
              { accessor: "phone" },
              {
                accessor: "Actions",
                textAlignment: "center",
                render: (rowData) => (
                  <div className="flex gap-4 items-center w-max mx-auto">
                    <Tippy content="View">
                      <button
                        className="flex hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewMessage();
                        }}
                      >
                        <IconEye />
                      </button>
                    </Tippy>
                    <Tippy content="Delete">
                      <button
                        type="button"
                        className="flex hover:text-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConfirm();
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

      {/* send message modal */}
      <SendMessage open={sendMessage} closeModal={closeSendMessage}/>

      {/* view message modal */}
  <ViewMessage open={viewModal} closeModal={closeViewMessage}/>

      {/* delete user modal */}
      <Transition appear show={deleteModal} as={Fragment}>
        <Dialog
          as="div"
          open={deleteModal}
          onClose={() => setDeleteModal(false)}
          className="relative z-[51]"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                  <button
                    type="button"
                    onClick={() => setDeleteModal(false)}
                    className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                  >
                    <IconX />
                  </button>
                  <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                    Delete Notes
                  </div>
                  <div className="p-5 text-center">
                    <div className="text-white bg-danger ring-4 ring-danger/30 p-4 rounded-full w-fit mx-auto">
                      <IconTrashLines className="w-7 h-7 mx-auto" />
                    </div>
                    <div className="sm:w-3/4 mx-auto mt-5">
                      Are you sure you want to delete this User?
                    </div>

                    <div className="flex justify-center items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setDeleteModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={deleteUser}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Messages;

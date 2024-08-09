import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import { DataTable } from "mantine-datatable";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import ScrollToTop from "../../../components/ScrollToTop";
import emptyBox from "/assets/images/empty-box.svg";
import NetworkHandler from "../../../utils/NetworkHandler";
import AddModal from "./AddModal";
import IconPlus from "../../../components/Icon/IconPlus";

const Specialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Specialization"));
  }, [dispatch]);

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [loading, setLoading] = useState(true);
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [totalSpecializations, setTotalSpecializations] = useState(0);
  const [addOpen, setAddOpen] = useState(false); // opening modal
  const [selectedSpeciality, setSelectedSpeciality] = useState(null); // selecting speciality for editing

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  // Get API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/specialization/getall?pageSize=${pageSize}&page=${page}`
      );
      setAllSpecializations(response.data.Specialization.rows);
      setTotalSpecializations(response.data.Specialization.count);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  //Delete API
  const handleDelete = (specialization) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await NetworkHandler.makeDeleteRequest(
            `/v1/specialization/remove/${specialization.id}`
          );
          Swal.fire({
            title: "Deleted!",
            text: "The specialization has been deleted.",
            icon: "success",
            confirmButtonColor: "#006241",
          });
          fetchData();
        } catch (error) {
          Swal.fire("Error!", "Failed to delete specialization.", "error");
        }
      }
    });
  };

  const openAddModal = () => {
    setSelectedSpeciality(null);
    setAddOpen(true);
  };

  const openEditModal = (specialization) => {
    setSelectedSpeciality(specialization);
    setAddOpen(true);
  };

  const closeModal = () => {
    setAddOpen(false);
    setSelectedSpeciality(null);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  return (
    <div>
      <ScrollToTop />
      <div className="panel">
        <div className="flex items-center flex-wrap gap-3 justify-between mb-5">
          <div className="flex items-center gap-1">
            <h5 className="font-semibold text-lg dark:text-white-light">
              Specialization
            </h5>
            <Tippy content="Total Clinics">
              <span className="badge bg-[#006241] p-0.5 px-1 rounded-full">
                <CountUp start={0} end={totalSpecializations} duration={3} />
              </span>
            </Tippy>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-green"
              onClick={openAddModal}
            >
              <IconPlus className="ltr:mr-2 rtl:ml-2" />
              Add Specialization
            </button>
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
              records={allSpecializations}
              idAccessor="id"
              columns={[
                {
                  accessor: "No",
                  title: "No",
                  render: (row, rowIndex) => rowIndex + 1,
                },
                { accessor: "name", title: "Specialization" },
                {
                  accessor: "id",
                  title: <span className="mr-16">Actions</span>,
                  textAlignment: "end",
                  render: (rowData) => (
                    <div className="flex items-center gap-5 justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(rowData);
                        }}
                        className="btn btn-primary btn-sm min-w-20 py-1"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(rowData);
                        }}
                        className="btn btn-danger btn-sm min-w-20 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              totalRecords={totalSpecializations}
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

      {/* Add and Edit Modal */}
      <AddModal
        open={addOpen}
        close={closeModal}
        selectedSpeciality={selectedSpeciality}
        id={selectedSpeciality ? selectedSpeciality.id : null}
        isEditmode={!!selectedSpeciality}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Specialization;

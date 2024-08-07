import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../contexts/UseContext";
import ReceiptModal from "./ReceiptModal";
import { formatDate } from "../../../utils/formatDate";
import { useParams, useNavigate } from "react-router-dom";
import NetworkHandler from "../../../utils/NetworkHandler";
import IconCaretDown from "../../../components/Icon/IconCaretDown";
import IconLoader from "../../../components/Icon/IconLoader"; // Import the loader component

const SubscriptionDetails = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [paidBills, setPaidBills] = useState([]);
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [selectedTab, setSelectedTab] = useState("paid");
  const [loadingPaid, setLoadingPaid] = useState(false); // Loading state for paid bills
  const [loadingUnpaid, setLoadingUnpaid] = useState(false); // Loading state for unpaid bills
  const { userDetails } = useContext(UserContext);
  const { clinicId } = useParams();
  const navigate = useNavigate();

  const openView = () => {
    setModalOpen(true);
  };

  const closeView = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchPaidBills = async () => {
      setLoadingPaid(true); // Set loading to true
      try {
        const response = await NetworkHandler.makeGetRequest(
          `/v1/subscription/getPaidinvoice/${clinicId}?pageSize=10&page=1`
        );
        setPaidBills(response?.data?.Bills?.rows || []);
      } catch (error) {
        console.error("Error fetching paid bills:", error);
      } finally {
        setLoadingPaid(false); // Set loading to false
      }
    };

    const fetchUnpaidBills = async () => {
      setLoadingUnpaid(true); // Set loading to true
      try {
        const response = await NetworkHandler.makeGetRequest(
          `/v1/subscription/getNewinvoice/${clinicId}`
        );
        setUnpaidBills(response?.data?.Bills || []);
      } catch (error) {
        console.error("Error fetching unpaid bills:", error);
      } finally {
        setLoadingUnpaid(false); // Set loading to false
      }
    };

    if (clinicId) {
      fetchPaidBills();
      fetchUnpaidBills();
    }
  }, [clinicId]);

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        type="button"
        className="btn btn-green btn-sm mt-1 mb-4"
      >
        <IconCaretDown className="w-4 h-4 rotate-90" />
      </button>
      <h1 className="text-[#006241] text-2xl font-bold mb-4 mt-5">
        Bill History
      </h1>
      <div className="panel">
        <div className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
          <button
            className={`relative inline-flex items-center p-5 py-3 text-base font-semibold ${
              selectedTab === "paid"
                ? "text-[#006241] before:!w-full"
                : "text-slate-500 dark:text-slate-700"
            } before:inline-block relative -mb-[1px] before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:h-[1px] before:w-0 before:bg-[#006241] before:transition-all before:duration-700 hover:text-[#006241] hover:before:w-full`}
            onClick={() => setSelectedTab("paid")}
          >
            Paid Bills
          </button>
          <button
            className={`relative inline-flex items-center p-5 py-3 text-base font-semibold ${
              selectedTab === "unpaid"
                ? "text-[#006241] before:!w-full"
                : "text-slate-500 dark:text-slate-700"
            } before:inline-block relative -mb-[1px] before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:h-[1px] before:w-0 before:bg-[#006241] before:transition-all before:duration-700 hover:text-[#006241] hover:before:w-full`}
            onClick={() => setSelectedTab("unpaid")}
          >
            Unpaid Bills
          </button>
        </div>
        <div className="mt-2 shadow">
          {selectedTab === "paid" && (
            <div className="mt-1 p-4 rounded table-responsive">
              {loadingPaid ? (
                <div className="flex justify-center items-center h-32">
                  <IconLoader className="animate-[spin_2s_linear_infinite] w-7 h-7" />
                </div>
              ) : (
                <table className="w-full table-auto">
                  <thead className="bg-transparent">
                    <tr className="!bg-transparent dark:!bg-transparent whitespace-nowrap">
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">
                        Bill Date
                      </th>
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">
                        Amount
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {paidBills.length > 0 ? (
                      paidBills.map((bill) => (
                        <tr
                          key={bill.payment_id}
                          className="h-16 whitespace-nowrap"
                        >
                          <td className="px-4 py-2">{bill.billing_no}</td>
                          <td className="px-4 py-2 text-[#FF6A6A]">
                            {formatDate(bill.billing_date)}
                          </td>
                          <td className="px-4 py-2">
                            ₹ {bill.billing_price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <p
                              className="text-[#006241] underline cursor-pointer"
                              onClick={openView}
                            >
                              View Bill
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-2 text-center" colSpan="4">
                          <div className="flex items-center justify-center h-full mt-12 mb-12">
                            There are no paid bills here.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {selectedTab === "unpaid" && (
            <div className="mt-1 p-4 rounded table-responsive">
              {loadingUnpaid ? (
                <div className="flex justify-center items-center h-32">
                  <IconLoader className="animate-[spin_2s_linear_infinite] w-7 h-7" />
                </div>
              ) : (
                <table className="w-full table-auto">
                  <thead className="bg-transparent">
                    <tr className="!bg-transparent dark:!bg-transparent whitespace-nowrap">
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">
                        Bill Date
                      </th>
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">
                        Amount
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidBills.length > 0 ? (
                      unpaidBills.map((bill) => (
                        <tr
                          key={bill.payment_id}
                          className="h-16 whitespace-nowrap"
                        >
                          <td className="px-4 py-2">{bill.billing_no}</td>
                          <td className="px-4 py-2 text-[#FF6A6A]">
                            {formatDate(bill.billing_date)}
                          </td>
                          <td className="px-4 py-2">
                            ₹ {bill.billing_price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <p
                              className="text-[#006241] underline cursor-pointer"
                              onClick={openView}
                            >
                              View Bill
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-2 text-center" colSpan="4">
                          <div className="flex items-center justify-center h-full mt-12 mb-12">
                            There are no unpaid bills here.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
      <ReceiptModal open={modalOpen} close={closeView} />
    </>
  );
};

export default SubscriptionDetails;

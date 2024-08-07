import React, { useContext, useState, useEffect, Fragment } from "react";
import { Tab } from "@headlessui/react";
import ReceiptModal from "./ReceiptModal";
import NetworkHandler from "../../../utils/NetworkHandler";
import { UserContext } from "../../../contexts/UseContext";
import { formatDate } from "../../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import IconLoader from "../../../components/Icon/IconLoader"; // Import the loader component

const SubscriptionDetails = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { userDetails } = useContext(UserContext);
  const ownerId = userDetails?.UserOwner?.[0]?.owner_id || 0;

  const navigate = useNavigate();

  const openView = () => {
    setModalOpen(true);
  };

  const closeView = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await NetworkHandler.makeGetRequest(
          `/v1/subscription/getallsubscription/${ownerId}?page=${page}&pageSize=${pageSize}`
        );
        console.log(response.data);
        if (response.data && response.data.Subscriptions) {
          setSubscriptions(response.data.Subscriptions.rows);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchSubscriptions();
  }, [ownerId, page, pageSize]);

  const handleRowClick = (clinic_id) => {
    navigate(`/owner/subscriptiondetails/${clinic_id}`);
  };

  return (
    <>
      <Tab.Group>
        <div className="">
          <h1 className="text-[#006241] text-2xl font-bold mb-4 mt-5">
            Subscriptions
          </h1>
          <Tab.Panels>
            <Tab.Panel>
              <div className="mt-1 p-4 shadow table-responsive">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <IconLoader className="animate-[spin_2s_linear_infinite] w-7 h-7" />
                  </div>
                ) : (
                  <table className="table-hover">
                    <thead>
                      <tr className="!bg-transparent dark:!bg-transparent whitespace-nowrap">
                        <th className="px-4 py-2 text-left text-[20px] font-semibold">
                          Clinic Name
                        </th>
                        <th className="px-4 py-2 text-left text-[20px] font-semibold">
                          Bill Date
                        </th>
                        <th className="px-4 py-2 text-left text-[20px] font-semibold">
                          Plans
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.length > 0 ? (
                        subscriptions.map((subscription) => (
                          <tr
                            key={subscription.clinic_id}
                            className="h-16 whitespace-nowrap cursor-pointer"
                            onClick={() => handleRowClick(subscription.clinic_id)}
                          >
                            <td className="px-4 py-2">
                              {subscription.Clinic.name}
                              <span className="text-[#006241]">
                                {subscription.no_of_doctors
                                  ? ` (${subscription.no_of_doctors} Doctor${
                                      subscription.no_of_doctors > 1 ? "s" : ""
                                    } added)`
                                  : ""}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-[#FF6A6A]">
                              {formatDate(subscription.start_date)}
                            </td>
                            <td className="px-4 py-2">
                              {subscription.Plan.plan_name}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-2 text-center" colSpan="4">
                            <div className="flex items-center justify-center h-full mt-12 mb-12">
                              No subscriptions found.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>

      <ReceiptModal open={modalOpen} close={closeView} />
    </>
  );
};

export default SubscriptionDetails;

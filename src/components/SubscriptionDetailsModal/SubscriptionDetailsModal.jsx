import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../Icon/IconX";
import NetworkHandler from "../../utils/NetworkHandler";
import { formatDate } from "../../utils/formatDate";
import IconLoader from "../Icon/IconLoader";

const SubscriptionDetailsModal = ({ open, closeModal, clinicId }) => {
  const [planLoading, setPlanLoading] = useState(false);

  const [subscriptionData, setSubscriptionData] = useState(null);

  const fetchSubscriptionData = async () => {
    try {
      setPlanLoading(true);
      const response = await NetworkHandler.makeGetRequest(
        `/v1/subscription/getsubscription/${clinicId}`
      );
      console.log(response);
      if (response?.status === 201) {
        setSubscriptionData(response?.data?.Subscriptions);
      } else {
        setSubscriptionData(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSubscriptionData(null);
        fetchPlanDetails();
      } else {
        console.error("Error fetching subscription data:", error);
      }
    } finally {
      setPlanLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId && open) {
      fetchSubscriptionData();
    }
  }, [clinicId, open]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        open={open}
        onClose={closeModal}
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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-2xl text-black dark:text-white-dark">
                <div className="flex items-center justify-between px-3 py-5 border-b dark:border-slate-800">
                  <div className="text-lg font-semibold dark:text-slate-200">
                    Subscription Details
                  </div>
                  <div className="flex items-center gap-5">
                    {!planLoading && (
                      <>
                        {subscriptionData && (
                          <>
                            {subscriptionData?.Plan?.plan_name === "Premium" ? (
                              <div className="bg-yellow-600 text-center font-bold py-1 w-28 text-white rounded">
                                Premium
                              </div>
                            ) : (
                              <div className=" bg-green-800 text-center py-1 w-28 text-white rounded font-bold">
                                Basic
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    >
                      <IconX />
                    </button>
                  </div>
                </div>
                {planLoading ? (
                  <IconLoader className="animate-[spin_2s_linear_infinite]  w-7 h-28 my-5 align-middle shrink-0 mx-auto" />
                ) : (
                  <>
                    {subscriptionData ? (
                      <>
                        <div className="px-10 pb-5">
                          <div className="flex flex-col items-start gap-7 my-10">
                            <div className="flex flex-col sm:flex-row gap-5 w-full">
                              <div className="w-full">
                                <div className="text-gray-400 font-normal text-sm sm:text-base mb-1">
                                  Start Date
                                </div>
                                <div className="border border-gray-300 dark:border-gray-700 h-10 rounded flex items-center pl-4 text-sm sm:text-base dark:text-slate-200">
                                  {formatDate(subscriptionData?.start_date)}
                                </div>
                              </div>

                              <div className="w-full">
                                <div className="text-gray-400 font-normal text-sm sm:text-base mb-1">
                                  End Date
                                </div>
                                <div className="border border-gray-300 dark:border-gray-700 h-10 rounded flex items-center pl-4 text-sm sm:text-base dark:text-slate-200">
                                  {formatDate(subscriptionData?.end_date)}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-5 w-full">
                              <div className="w-full">
                                <div className="text-gray-400 font-normal text-sm sm:text-base mb-1">
                                  Next Billing Date
                                </div>
                                <div className="border border-gray-300 dark:border-gray-700 h-10 rounded flex items-center pl-4 text-sm sm:text-base dark:text-slate-200">
                                  {formatDate(
                                    subscriptionData?.next_billing_date
                                  )}
                                </div>
                              </div>
                              <div className="w-full">
                                <div className="text-gray-400 font-normal text-sm sm:text-base mb-1">
                                  Price Per Doctor
                                </div>
                                <div className="border border-gray-300 dark:border-gray-700 h-10 rounded flex items-center pl-4 text-sm sm:text-base dark:text-slate-200">
                                  ₹{subscriptionData?.Plan?.price_per_doctor}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="px-5 h-28 grid place-items-center">
                        <p className="text-base text-gray-700 dark:text-gray-400 text-[16px] text-center">
                          Clinic haven't subscribed yet!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default SubscriptionDetailsModal;

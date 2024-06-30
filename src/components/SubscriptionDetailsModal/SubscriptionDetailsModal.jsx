import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import IconX from "../Icon/IconX";
import NetworkHandler from "../../utils/NetworkHandler";
import { formatDate } from "../../utils/formatDate";
import { showMessage } from "../../utils/showMessage";
import IconLoader from "../Icon/IconLoader";

const SubscriptionDetailsModal = ({
  open,
  closeModal,
  buttonLoading,
  setButtonLoading,
  ownerId,
  clinicId,
  fetchClinicData,
  selectedPlan,
  setSelectedPlan,
}) => {
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);

  const [subscriptionData, setSubscriptionData] = useState(null);
  const [allPlans, setAllPlans] = useState([]);

  const fetchSubscriptionData = async () => {
    try {
      setPlanLoading(true);
      const response = await NetworkHandler.makeGetRequest(
        `/v1/subscription/getsubscription/${clinicId}`
      );
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

  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/plans/getallplans`
      );
      setAllPlans(response?.data?.Plans?.rows || []);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clinicId && !subscriptionData) {
      fetchPlanDetails();
    }
  }, [!subscriptionData]);

  const handlePlanSelection = (planId) => {
    setSelectedPlan(planId);
  };

  const createSubscription = async () => {
    if (!selectedPlan) {
      showMessage("please select a plan.", "warning");
      return;
    }

    try {
      setButtonLoading(true);
      const response = await NetworkHandler.makePostRequest(
        `/v1/subscription/createsubscription`,
        {
          plan_id: selectedPlan,
          owner_id: ownerId,
          clinic_id: clinicId,
        }
      );
      if (response?.status === 201) {
        console.log("Subscription Created Successfully", response?.data);
        showMessage("Plans updated successfully.", "success");
        closeModal();
        fetchClinicData();
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      showMessage("An error occurred. Please try again.", "error");
    } finally {
      setButtonLoading(false);
    }
  };

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
              <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                >
                  <IconX/>
                </button>
                <div className="text-lg  font-semibold bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px] pb-1">
                  Subscription Plans
                </div>
                {planLoading ? (
                  <IconLoader className="animate-[spin_2s_linear_infinite]  w-7 h-28 my-5 align-middle shrink-0 mx-auto" />
                ) : (
                  <>
                    {subscriptionData ? (
                      <>
                        <div className="flex justify-between p-4 flex-wrap-reverse">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="text-gray-500 min-w-[120px] flex justify-between">
                              Plan Name<span>:</span>{" "}
                            </div>
                            <h2 className="text-lg font-semibold dark:text-slate-300">
                              {subscriptionData?.Plan?.plan_name}
                            </h2>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-600 dark:bg-green-600 dark:text-white px-2 py-1 mr-3 rounded-md text-xs font-semibold uppercase">
                              {subscriptionData?.status}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 p-4 text-[14px]">
                          <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                            <div className="text-gray-500 min-w-[120px] flex justify-between">
                              Start Date<span>:</span>
                            </div>
                            <div className="dark:text-slate-300 md:max-w-80">
                              {formatDate(subscriptionData?.start_date)}
                            </div>
                          </div>

                          <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                            <div className="text-gray-500 min-w-[120px] flex justify-between">
                              End Date<span>:</span>{" "}
                            </div>
                            <div className="dark:text-slate-300 md:max-w-80">
                              {formatDate(subscriptionData?.end_date)}
                            </div>
                          </div>

                          <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                            <div className="text-gray-500 min-w-[120px] flex justify-between">
                              Next Billing Date<span>:</span>{" "}
                            </div>
                            <div className="dark:text-slate-300 md:max-w-80">
                              {formatDate(subscriptionData?.next_billing_date)}
                            </div>
                          </div>

                          <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                            <div className="text-gray-500 min-w-[120px] flex justify-between">
                              Price Per Doctor <span>:</span>
                            </div>
                            <div className="dark:text-slate-300 md:max-w-80">
                              ₹{subscriptionData?.Plan?.price_per_doctor}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="px-5">
                        <p className="text-base text-gray-700 dark:text-gray-400 text-[16px] text-center mt-4">
                          You haven't subscribed yet! Choose one of the plans
                          below to unlock features and exclusive content.
                        </p>
                        <div className="mt-5 text-slate- 800 dark:text-slate-300">
                          Available Plans:
                        </div>
                        <div className="mt-2 flex gap-3 items-start flex-wrap sm:flex-nowrap">
                          {allPlans.length > 0 ? (
                            <>
                              {allPlans.map((plan) => (
                                <div
                                  key={plan.plan_id}
                                  className="w-full"
                                  onClick={() =>
                                    handlePlanSelection(plan?.plan_id)
                                  }
                                >
                                  <div
                                    className={`border ${
                                      selectedPlan === plan?.plan_id
                                        ? "border-[#006241]"
                                        : "dark:border-slate-800"
                                    } py-4 px-2 rounded-lg flex items-center cursor-pointer`}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full border p-0.5 ${
                                        selectedPlan === plan?.plan_id
                                          ? "border-[#006241]"
                                          : "dark:border-slate-800"
                                      } mr-3`}
                                    >
                                      <div
                                        className={`w-full h-full ${
                                          selectedPlan === plan?.plan_id &&
                                          "bg-[#006241]"
                                        } rounded-full`}
                                      />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold">
                                        {plan.plan_name}
                                      </h3>
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-500 min-w-[110px] flex justify-between">
                                          Price Per Doctor <span>:</span>
                                        </p>
                                        <p className="text-sm text-slate-800 dark:text-slate-300">
                                          ₹{plan.price_per_doctor}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-500 flex gap-1">
                                          Frequency <span>:</span>
                                        </p>
                                        <p className="text-sm text-slate-800 dark:text-slate-300">
                                          {plan.frequency_in_days} days
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <p>No plans available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {!subscriptionData && (
                  <div className="p-5">
                    <div className="flex justify-end items-center mt-8">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={createSubscription}
                      >
                        {buttonLoading ? (
                          <IconLoader className="animate-[spin_2s_linear_infinite] inline-block align-middle ltr:ml-0 rtl:mr-0 shrink-0" />
                        ) : (
                          "Confirm"
                        )}
                      </button>
                    </div>
                  </div>
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

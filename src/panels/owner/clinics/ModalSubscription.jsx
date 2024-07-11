import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import IconLoader from "../../../components/Icon/IconLoader";
import NetworkHandler from "../../../utils/NetworkHandler";
import { formatDate } from "../../../utils/formatDate";
import { showMessage } from "../../../utils/showMessage";
import { UserContext } from "../../../contexts/UseContext";

const ModalPage = ({
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
  const { userDetails } = useContext(UserContext);
  const isSuperAdmin = userDetails?.role_id === 1;

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

  console.log(allPlans);

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
                <div className="flex items-center justify-between px-3 py-5">
                  <div className="text-lg font-bold bg-[#fbfbfb] dark:bg-[#121c2c]">
                    Subscription Details
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="bg-yellow-600 font-bold py-1 px-6 text-white rounded">
                      Premium
                    </div>
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
                      <hr />
                        <div className="px-10 pb-5">
                          
                          <div className="grid sm:grid-cols-2 gap-7 my-10">
                            <div className="flex flex-col gap-5">
                              <div>
                                <div className="text-gray-400 font-bold text-sm sm:text-base">
                                  Start Date
                                </div>
                                <div className="border border-gray-300 h-10 rounded flex items-center pl-4 text-sm sm:text-base">{formatDate(subscriptionData?.start_date)}</div>
                              </div>
                              <div>
                                <div className="text-gray-400 font-bold text-sm sm:text-base">
                                  Next Billing Date
                                </div>
                                <div className="border border-gray-300 h-10 rounded flex items-center pl-4 text-sm sm:text-base">{formatDate(subscriptionData?.next_billing_date)}</div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-5">
                              <div>
                                <div className="text-gray-400 font-bold text-sm sm:text-base">
                                  End Date
                                </div>
                                <div className="border border-gray-300 h-10 rounded flex items-center pl-4 text-sm sm:text-base">{formatDate(subscriptionData?.end_date)}</div>
                              </div>
                              <div>
                                <div className="text-gray-400 font-bold text-sm sm:text-base">
                                  Price Per Doctor
                                </div>
                                <div className="border border-gray-300 h-10 rounded flex items-center pl-4 text-sm sm:text-base">₹{subscriptionData?.Plan?.price_per_doctor}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex justify-between p-4 flex-wrap-reverse">
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
                        </div> */}
                      </>
                    ) : (
                      <>
                        {isSuperAdmin ? (
                          <div className="px-5 h-28 grid place-items-center">
                            <p className="text-base text-gray-700 dark:text-gray-400 text-[16px] text-center">
                              Clinic haven't subscribed yet!
                            </p>
                          </div>
                        ) : (
                          <div className="px-5">
                            <p className="text-base text-gray-700 dark:text-gray-400 text-[16px] text-center mt-4">
                              You haven't subscribed yet! Choose one of the
                              plans below to unlock features and exclusive
                              content.
                            </p>
                            <div className="mt-5 text-slate- 800 dark:text-slate-300">
                              Available Plans:
                            </div>
                            <div className="mt-5 grid place-items-center sm:grid-cols-2 gap-7 sm:gap-3 ">
                              {allPlans.length > 0 ? (
                                <>
                                  {allPlans?.map((plan) => (
                                    <div
                                      key={plan?.plan_id}
                                      className={`border ${
                                        selectedPlan === plan?.plan_id
                                          ? "border-[#006241]"
                                          : "dark:border-slate-800"
                                      } py-2 px-2 rounded-md cursor-pointer w-full min-h-[15.5rem] max-w-70 h-full relative`}
                                      onClick={() =>
                                        handlePlanSelection(plan?.plan_id)
                                      }
                                    >
                                      {plan?.plan_name === "Monthly" ? (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-800 px-5 py-1 rounded-sm text-white text-xs font-bold">
                                          Basic Plan
                                        </div>
                                      ) : (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-600 px-4 py-1 rounded-sm text-white text-xs font-bold">
                                          Premium Plan
                                        </div>
                                      )}

                                      {plan?.plan_name === "Monthly" ? (
                                        <div className="flex flex-col items-center w-full h-full pt-5">
                                          <img
                                            src="/assets/images/stethoscope.png"
                                            alt="stethoscope"
                                            className="h-20"
                                          />
                                          <div>
                                            <span className="line-through text-xs text-slate text-opacity-20 text-slate-950">
                                              ₹ 499
                                            </span>
                                            <span className="text-2xl font-bold">
                                              ₹ 199
                                            </span>
                                            <span className="text-xs">
                                              /Month
                                            </span>
                                          </div>
                                          <div className="text-center font-bold mt-5">
                                            Basic <br /> Dashboards
                                          </div>
                                          <button
                                            type="button"
                                            className="bg-blue-700 w-full rounded-sm text-white text-sm font-bold py-1 mt-auto"
                                          >
                                            Select
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center h-full pt-5">
                                          <img
                                            src="/assets/images/stethoscope_group.png"
                                            alt="stethoscope"
                                            className="h-20 "
                                          />
                                          <div className="sm:text-[25px]">
                                            <span className="line-through text-xs text-slate text-opacity-20 text-slate-950">
                                              ₹ 999
                                            </span>
                                            <span className="text-2xl font-bold text-yellow-600">
                                              ₹ 499
                                            </span>
                                            <span className="text-xs">
                                              /Year
                                            </span>
                                          </div>
                                          <div className="text-left text-[10px] pl-3 ">
                                            <ul className="list-disc ">
                                              <li>
                                                linic waiting area screen for
                                                token number and consulting room
                                                (Voice over).
                                              </li>
                                            </ul>
                                            <ul className="list-disc">
                                              <li>
                                                {" "}
                                                Bulk Cancel or Day cancel
                                                option. Pro Dashboards (Trend
                                                reports, forecasted cash in
                                                flow(Account admin)).
                                              </li>
                                            </ul>
                                            <ul className="list-disc">
                                              <li>
                                                {" "}
                                                Digital prescription sent by SMS
                                                and Email.
                                              </li>
                                            </ul>
                                            <ul className="list-disc">
                                              <li> Patient clinic history.</li>
                                            </ul>
                                          </div>
                                          <button
                                            type="button"
                                            className="bg-blue-700 w-full rounded-sm  text-white text-sm font-bold py-1 mt-auto"
                                          >
                                            Select
                                          </button>
                                        </div>
                                      )}
                                      {/* <div className={`${selectedPlan === plan?.plan_id ? "/assets/images/stethoscope.png w-10" : "/assets/images/stethoscope_group.png w-10" }`}> */}

                                      {/* </div> */}
                                      {/* <div
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
                                        </div> */}
                                      {/* <div>
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
                                        </div> */}
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
                  </>
                )}
                {!subscriptionData && !isSuperAdmin && (
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
export default ModalPage;

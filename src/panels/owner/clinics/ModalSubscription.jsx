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
                              Clinic haven't subscribed yet! Choose one of the
                              plans below to unlock features and exclusive
                              content.
                            </p>
                            <div className="mt-5 text-slate- 800 dark:text-slate-300">
                              Available Plans:
                            </div>
                            <div className={`mt-5 ${allPlans?.length > 0 ? 'grid place-items-center sm:grid-cols-2 gap-7 sm:gap-3' : 'flex justify-center items-center'}`}>
                              {allPlans?.length > 0 ? (
                                <>
                                  {allPlans?.map((plan) => (
                                    <div
                                      key={plan?.plan_id}
                                      className={`border ${
                                        selectedPlan === plan?.plan_id
                                          ? "border-[#006241]"
                                          : "dark:border-slate-800"
                                      } py-2 px-2 rounded-md cursor-pointer w-full min-h-80 max-w-80 h-full relative`}
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
                                            <span className="line-through text-xs text-slate text-slate-400 mr-2">
                                              ₹ 499
                                            </span>
                                            <span className="text-2xl font-bold dark:text-slate-200">
                                              ₹ {plan?.price_per_doctor}
                                            </span>
                                            <span className="text-xs dark:text-slate-200">
                                              /Month
                                            </span>
                                          </div>
                                          <div className="text-center font-bold mt-8 leading-4">
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
                                            <span className="line-through text-xs text-slate-400 mr-2">
                                              ₹ 999
                                            </span>
                                            <span className="text-2xl font-bold text-yellow-600">
                                              ₹ {plan?.price_per_doctor}
                                            </span>
                                            <span className="text-xs dark:text-slate-200">
                                              /Year
                                            </span>
                                          </div>
                                          <ul className="list-disc text-xs pl-4 mb-5">
                                            <li className="mb-1">
                                              Clinic waiting area screen for
                                              token number and consulting room
                                              (Voice over).
                                            </li>
                                            <li className="mb-1">
                                              {" "}
                                              Bulk Cancel or Day cancel option.
                                              Pro Dashboards (Trend reports,
                                              forecasted cash in flow(Account
                                              admin)).
                                            </li>
                                            <li className="mb-1">
                                              {" "}
                                              Digital prescription sent by SMS
                                              and Email.
                                            </li>
                                            <li className="mb-1">
                                              {" "}
                                              Patient clinic history.
                                            </li>
                                          </ul>
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
                                <div className="flex justify-center items-center w-full">
                                  <p className="">No plans available</p>
                                </div>
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
                        className="btn btn-green ltr:ml-4 rtl:mr-4"
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

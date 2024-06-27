import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../../components/Icon/IconX";
import MaskedInput from "react-text-mask";
import "tippy.js/dist/tippy.css";
import IconLoader from "../../../components/Icon/IconLoader";
import IconLockDots from "../../../components/Icon/IconLockDots";
import IconEye from "../../../components/Icon/IconEye";
import IconCloseEye from "../../../components/Icon/IconCloseEye";
import NetworkHandler from "../../../utils/NetworkHandler";
import { formatDate } from "../../../utils/formatDate";
import { showMessage } from "../../../utils/showMessage";

const ModalPage = ({
  open,
  closeModal,
  buttonLoading,
  setButtonLoading,
  ownerId,
  clinicId,
  fetchClinicData,
}) => {
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);

  const [selectedClinics, setSelectedClinics] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState({});

  const fetchSubscriptionData = async () => {
    try {
      setPlanLoading(true);
      const response = await NetworkHandler.makeGetRequest(
        `/v1/subscription/getsubscription/${clinicId}`
      );
      console.log("response", response);
      if (response?.status === 201) {
        setSubscriptionData(response?.data?.Subscriptions);
      } else {
        setSubscriptionData(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSubscriptionData(null);fetchPlanDetails()
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
  }, [clinicId]);


  const fetchPlanDetails = async () => {
    console.log("gdsdgjhagh");
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/plans/getallplans`
      );
      console.log(response.data);
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
    setSelectedPlans((prevSelectedPlans) => ({
      ...prevSelectedPlans,
      [planId]: !prevSelectedPlans[planId],
    }));
  };

  const createSubscription = async () => {
    try {
      setButtonLoading(true);
      const selectedPlanId = Object.keys(selectedPlans).find(
        (planId) => selectedPlans[planId]
      );
      const response = await NetworkHandler.makePostRequest(
        `/v1/subscription/createsubscription`,
        {
          plan_id: selectedPlanId,
          owner_id: ownerId,
          clinic_id: clinicId,
        }
      );
      console.log(response);
      if (response?.status === 201) {
        console.log("Subscription Created Successfully", response?.data);
        console.log(response);
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
                  <IconX />
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
                        <div className="flex justify-between mb-4 ps-3">
                          <div>
                            <h2 className="text-lg font-semibold mt-4">
                              Plan Name: {subscriptionData?.Plan?.plan_name}
                            </h2>
                            <p className="text-sm text-gray-500">
                              Subscription ID:{" "}
                              {subscriptionData?.subscription_id}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-600 dark:bg-green-600 dark:text-white px-2 py-1 mx-3 rounded-md text-xs font-semibold uppercase">
                              {subscriptionData?.status}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 p-4 text-[14px]">
                        <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                        <div className="text-white-dark min-w-[50px] flex justify-between">
                            Start Date:{" "}
                        </div>
                        <div className="dark:text-slate-300 md:max-w-80">
                            {formatDate(subscriptionData?.start_date)}
                        </div>
                          </div>

                          <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                        <div className="text-white-dark min-w-[50px] flex justify-between">
                             End Date:{" "}
                        </div>
                        <div className="dark:text-slate-300 md:max-w-80">
                            {formatDate(subscriptionData?.end_date)}
                        </div>
                          </div>

                          <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                        <div className="text-white-dark min-w-[50px] flex justify-between">
                        Next Billing Date:{" "}
                        </div>
                        <div className="dark:text-slate-300 md:max-w-80">
                        {formatDate(subscriptionData?.next_billing_date)}
                        </div>
                          </div>

                          <div className="flex items-start gap-1 sm:gap-2 flex-wrap mb-2 ">
                        <div className="text-white-dark min-w-[50px] flex justify-between">
                        Price per Doctor: 
                        </div>
                        <div className="dark:text-slate-300 md:max-w-80">
                        $
                        {subscriptionData?.Plan?.price_per_doctor}
                        </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 ps-4 text-[16px]">
                          No subscription data found. Available Plans:
                        </p>
                        <div className="mt-6 flex gap-3 items-start mx-2 flex-wrap sm:flex-nowrap">
                          {allPlans.length > 0 ? (
                            <>
                              {allPlans.map((plan, index) => (
                                <div
                                  key={plan.plan_id}
                                  className="w-full"
                                  onClick={() =>
                                    handlePlanSelection(plan.plan_id)
                                  }
                                >
                                  <div className="border p-4 rounded-lg flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="mr-4"
                                      checked={!!selectedPlans[plan.plan_id]}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handlePlanSelection(plan.plan_id);
                                      }}
                                    />
                                    <div>
                                      <h3 className="text-lg font-semibold">
                                        {plan.plan_name}
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        Price per Doctor: $
                                        {plan.price_per_doctor}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Frequency: {plan.frequency_in_days} days
                                      </p>
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
export default ModalPage;

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import NetworkHandler from "../../../utils/NetworkHandler";
import IconArrowLeft from "../../../components/Icon/IconArrowLeft";
import IconLoader from "../../../components/Icon/IconLoader";

const SubscriptionPlans = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Pricing Tables"));
  }, [dispatch]);

  const [loading, setLoading] = useState(false);
  const [allPlans, setAllPlans] = useState([]);

  // Get Mapping
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
    fetchPlanDetails();
  }, []);

  return (
    <div className="panel">
      <div className="">
        <div className="max-w-[320px] md:max-w-[990px] mx-auto  py-5">
          {loading ? (
            <IconLoader className="animate-[spin_2s_linear_infinite] inline-block w-7 h-7 align-middle shrink-0" />
          ) : (
            <>
              {allPlans && allPlans?.length ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-5">
                  {allPlans?.map((plan, index) => (
                    <div
                      key={index}
                      className="p-3 lg:p-5 border border-black dark:border-[#1b2e4b] text-center rounded group hover:border-green-900  relative"
                    >
                      {/* <h3 className="text-xl lg:text-2xl">
                        {plan?.plan_name || ""}
                      </h3> */}
                      {/* <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-green-900"></div> */}
                      {/* <p className="text-[15px]">
                        {plan.description ||
                          "For people who are starting out in the water saving business"}
                      </p> */}
                      {plan?.plan_name === "Monthly" ? (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-800 px-8 py-1 rounded-sm text-white text-sm font-bold">
                          Basic Plan
                        </div>
                      ) : (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-600 px-7 py-1 rounded-sm text-white text-sm font-bold">
                          Premium Plan
                        </div>
                      )}
                      {plan?.plan_name === "Monthly" ? (
                        <div className="flex flex-col h-full">
                          <div className="flex justify-center">
                            <img
                              className="h-40"
                              src="/assets/images/stethoscope.png"
                              alt=""
                            />
                          </div>
                          <div className="sm:text-[25px]">
                            <span className="line-through text-sm text-slate  text-slate-400 dark:text-slate-500">
                              ₹499
                            </span>
                            <span className="text-4xl font-bold dark:text-white">₹{plan?.plan_name === "Monthly" ? plan?.price_per_doctor : 0}</span>
                            <span className="text-sm font-bold">/Month</span>
                          </div>
                          <div className="text-center font-bold mt-3 md:mt-10 text-xl">
                            Basic <br /> Dashboards
                          </div>
                          <button
                            type="button"
                            className="bg-blue-700 w-full rounded-sm  text-white text-lg font-bold py-2 mt-5 md:mt-auto"
                          >
                            Select
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col h-full">
                          <div className="flex justify-center pt-4">
                            <img
                              className="h-40"
                              src="/assets/images/stethoscope_group.png"
                              alt=""
                            />
                          </div>
                          <div className="sm:text-[25px]">
                            <span className="line-through text-sm text-slate text-slate-400 dark:text-slate-500">
                              ₹ 999
                            </span>
                            <span className="text-4xl font-bold text-yellow-600">
                              ₹{plan?.plan_name === "Premium" ? plan?.price_per_doctor : 0}
                            </span>
                            <span className="text-sm font-bold">/Year</span>
                          </div>
                          <div className="text-left text-md pl-3 mt-5 md:mt-3">
                            <ul className="list-disc ">
                              <li>
                                linic waiting area screen for token number and
                                consulting room (Voice over).
                              </li>
                            </ul>
                            <ul className="list-disc">
                              <li>
                                {" "}
                                Bulk Cancel or Day cancel option. Pro Dashboards
                                (Trend reports, forecasted cash in flow(Account
                                admin)).
                              </li>
                            </ul>
                            <ul className="list-disc">
                              <li>
                                {" "}
                                Digital prescription sent by SMS and Email.
                              </li>
                            </ul>
                            <ul className="list-disc">
                              <li> Patient clinic history.</li>
                            </ul>
                          </div>
                          <button
                            type="button"
                            className="bg-blue-700 w-full rounded-sm  text-white text-lg font-bold py-2 mt-5 md:mt-2"
                          >
                            Select
                          </button>
                        </div>
                      )}
                      {/* <div className="my-7 p-2.5 text-center text-lg group-hover:text-[#006241]">
                        <strong className="text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-[#006241]">
                          ₹{plan.price_per_doctor}
                        </strong>{" "}
                        / {plan.frequency_in_days === 30 ? "monthly" : "yearly"}
                      </div> */}
                      {/* <ul className="space-y-2.5 mb-5 font-semibold group-hover:text-[#006241]">
                        <li className="flex justify-center items-center">
                          <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                          Free water saving e-book
                        </li>
                        <li className="flex justify-center items-center">
                          <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                          Free access to forums
                        </li>
                        <li className="flex justify-center items-center">
                          <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                          Beginners tips
                        </li> */}
                      {/* </> 
                   )} */}
                      {/* </ul> */}
                      {/* <button
                        type="button"
                        className="btn text-black shadow-none group-hover:text-[#006241] group-hover:border-[#006241] group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
                      >
                        Buy Now
                      </button> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid place-items-center text-gray-500 h-52">
                  No Subcription Plans found
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

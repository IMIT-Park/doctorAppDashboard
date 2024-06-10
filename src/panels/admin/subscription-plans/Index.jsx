import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import NetworkHandler from "../../../utils/NetworkHandler";
import IconArrowLeft from "../../../components/Icon/IconArrowLeft";

const SubscriptionPlans = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Pricing Tables"));
  }, [dispatch]);

  const [codeArr, setCodeArr] = useState([]);
  const [yearlyPrice, setYearlyPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [totalPlans, setTotalPlans] = useState(0);
  const [allPlans, setAllPlans] = useState([]);
  // const [plansInfo, setPlansInfo] = useState({});

  const toggleCode = (name) => {
    if (codeArr.includes(name)) {
      setCodeArr((value) => value.filter((d) => d !== name));
    } else {
      setCodeArr([...codeArr, name]);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, []);

  // Get Mapping
  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makeGetRequest(
        `/v1/plans/getallplans`
      );
      console.log(response.data);
      // setTotalPlans(response.data?.Plans?.count);
      setAllPlans(response?.data?.Plans?.rows || []);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="">
        <div className="max-w-[320px] md:max-w-[990px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
            {allPlans.map((plan, index) => (
              <div
                key={index}
                className="p-3 lg:p-5 border border-black dark:border-[#1b2e4b] text-center rounded group hover:border-primary"
              >
                <h3 className="text-xl lg:text-2xl">{plan.plan_name}</h3>
                <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                <p className="text-[15px]">
                  {plan.description ||
                    "For people who are starting out in the water saving business"}
                </p>
                <div className="my-7 p-2.5 text-center text-lg group-hover:text-primary">
                  <strong className="text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-primary">
                    ${plan.price_per_doctor}
                  </strong>{" "}
                  / {plan.frequency_in_days === 30 ? "monthly" : "yearly"}
                </div>
                <ul className="space-y-2.5 mb-5 font-semibold group-hover:text-primary">
                  {/* {plan.features?.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex justify-center items-center"
                    >
                      <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                      {feature}
                    </li>
                  )) || ( 
                     <> */}
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
                      </li>
                    {/* </> 
                   )} */}
                </ul>
                <button
                  type="button"
                  className="btn text-black shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

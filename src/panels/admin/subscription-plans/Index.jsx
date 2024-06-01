import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconArrowLeft from "../../../components/Icon/IconArrowLeft";

const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Pricing Tables"));
  });
  const [codeArr, setCodeArr] = useState([]);

  const toggleCode = (name) => {
    if (codeArr.includes(name)) {
      setCodeArr((value) => value.filter((d) => d !== name));
    } else {
      setCodeArr([...codeArr, name]);
    }
  };

  const [yearlyPrice, setYearlyPrice] = useState(false);

  return (
        <div className="panel">
          <div className="">
            <div className="max-w-[320px] md:max-w-[990px] mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 lg:p-5 border border-black dark:border-[#1b2e4b] text-center rounded group hover:border-primary">
                  <h3 className="text-xl lg:text-2xl">Beginner Savers</h3>
                  <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                  <p className="text-[15px]">
                    For people who are starting out in the water saving business
                  </p>
                  <div className="my-7 p-2.5 text-center text-lg group-hover:text-primary">
                    <strong className="text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-primary">
                      $19
                    </strong>{" "}
                    / monthly
                  </div>
                  <ul className="space-y-2.5 mb-5 font-semibold group-hover:text-primary">
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
                  </ul>
                  <button
                    type="button"
                    className="btn text-black shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
                  >
                    Buy Now
                  </button>
                </div>
                <div className="p-3 lg:p-5 border border-black dark:border-[#1b2e4b] text-center rounded group hover:border-primary">
                  <h3 className="text-xl lg:text-2xl">Advanced Savers</h3>
                  <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                  <p className="text-[15px] ">
                    For experienced water savers who'd like to push their limits
                  </p>
                  <div className="my-7 p-2.5 text-center text-lg group-hover:text-primary">
                    <strong className="text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-primary">
                      $29
                    </strong>{" "}
                    / monthly
                  </div>
                  <ul className="space-y-2.5 mb-5 font-semibold group-hover:text-primary">
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
                      Advanced saving tips
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="btn text-black shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
                  >
                    Buy Now
                  </button>
                </div>
                <div className="p-3 lg:p-5 border border-black dark:border-[#1b2e4b] text-center rounded group hover:border-primary">
                  <h3 className="text-xl lg:text-2xl">Pro Savers</h3>
                  <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                  <p className="text-[15px] ">
                    For all the professionals who'd like to educate others, too
                  </p>
                  <div className="my-7 p-2.5 text-center text-lg group-hover:text-primary">
                    <strong className="text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-primary">
                      $79
                    </strong>{" "}
                    / monthly
                  </div>
                  <ul className="space-y-2.5 mb-5 font-semibold group-hover:text-primary">
                    <li className="flex justify-center items-center">
                      <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                      Access to all books
                    </li>
                    <li className="flex justify-center items-center">
                      <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                      Unlimited board topics
                    </li>
                    <li className="flex justify-center items-center">
                      <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                      Beginners tips
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="btn text-black shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
                  >
                    Buy Now
                  </button>
                </div>
                <div className="p-3 lg:p-5 border border-black dark:border-[#1b2e4b] text-center rounded group hover:border-primary">
                  <h3 className="text-xl lg:text-2xl">Pro Savers</h3>
                  <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                  <p className="text-[15px] ">
                    For all the professionals who'd like to educate others, too
                  </p>
                  <div className="my-7 p-2.5 text-center text-lg group-hover:text-primary">
                    <strong className="text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-primary">
                      $79
                    </strong>{" "}
                    / monthly
                  </div>
                  <ul className="space-y-2.5 mb-5 font-semibold group-hover:text-primary">
                    <li className="flex justify-center items-center">
                      <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                      Access to all books
                    </li>
                    <li className="flex justify-center items-center">
                      <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                      Unlimited board topics
                    </li>
                    <li className="flex justify-center items-center">
                      <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                      Beginners tips
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="btn text-black shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default SubscriptionPlans;

import React, { useState, Fragment } from "react";
import { Tab } from "@headlessui/react";
import ReceiptModal from "./ReceiptModal";

const SubscriptionDetails = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openView = () => {
    setModalOpen(true); 
  };

  const closeView = () => {
    setModalOpen(false); 
  };

  return (
    <>
      <Tab.Group>
        <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`${
                  selected
                    ? "text-[#006241] !outline-none before:!w-full"
                    : "text-slate-500 dark:text-slate-700"
                } before:inline-block' relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:h-[1px] before:w-0 before:bg-[#006241] before:transition-all before:duration-700 hover:text-[#006241] hover:before:w-full font-semibold text-base`}
              >
                Subscriptions
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`${
                  selected
                    ? "text-[#006241] !outline-none before:!w-full"
                    : "text-slate-500 dark:text-slate-700"
                } before:inline-block' relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:h-[1px] before:w-0 before:bg-[#006241] before:transition-all before:duration-700 hover:text-[#006241] hover:before:w-full font-semibold text-base`}
              >
                Bill History
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="mt-1 p-4 shadow table-responsive">
              <table className="table-hover">
                <thead>
                  <tr className="!bg-transparent dark:!bg-transparent whitespace-nowrap">
                    <th className="px-4 py-2 text-left text-[20px] font-semibold ">
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
                  <tr className="h-16 whitespace-nowrap">
                    <td className="px-4 py-2">
                      Ann Dental Clinic{" "}
                      <span className="text-[#006241]">(1 Doctor added)</span>
                    </td>
                    <td className="px-4 py-2 text-[#FF6A6A]">02/05/2024</td>
                    <td className="px-4 py-2">Premium</td>
                    <td className="px-4 py-2">
                      <p
                        className="text-[#006241] underline cursor-pointer"
                        onClick={openView}
                      >
                        View Bill
                      </p>
                    </td>
                  </tr>
                  <tr className="h-16">
                    <td className="px-4 py-2">AR Dental Clinic</td>
                    <td className="px-4 py-2">02/05/2024</td>
                    <td className="px-4 py-2">Basic</td>
                    <td className="px-4 py-2">
                      <p
                        className="text-[#006241] underline"
                        onClick={openView}
                      >
                        View Bill
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="mt-1 p-4 rounded shadow table-responsive">
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
                  <tr className="h-16 whitespace-nowrap">
                    <td className="px-4 py-2">36ds1hfn71368d1701</td>
                    <td className="px-4 py-2 text-[#FF6A6A]">02/05/2024</td>
                    <td className="px-4 py-2">₹ 200</td>
                    <td className="px-4 py-2">
                      <a
                        href="/path/to/bill"
                        className="text-[#006241] underline"
                      >
                        View Bill
                      </a>
                    </td>
                  </tr>
                  <tr className="h-16">
                    <td className="px-4 py-2">36ds1hfn71368d1701</td>
                    <td className="px-4 py-2">02/05/2024</td>
                    <td className="px-4 py-2">₹ 200</td>
                    <td className="px-4 py-2">
                      <a
                        href="/path/to/bill"
                        className="text-[#006241] underline"
                      >
                        View Bill
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <ReceiptModal open={modalOpen} close={closeView} />
    </>
  );
};

export default SubscriptionDetails;

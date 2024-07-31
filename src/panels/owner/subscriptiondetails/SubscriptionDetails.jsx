import React, { useState } from 'react';

const SubscriptionDetails = () => {
  const [activeTab, setActiveTab] = useState('Subscriptions');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Subscriptions':
        return (
          <div>
            <div className="mt-1 bg-white p-4 rounded shadow bg-none">
              <table className="table-hover">
                <thead >
                <tr className='!bg-transparent dark:!bg-transparent'>

                    <th className="px-4 py-2 text-left text-[20px] font-semibold">Clinic Name</th>
                    <th className="px-4 py-2 text-left text-[20px] font-semibold">Bill Date</th>
                    <th className="px-4 py-2 text-left text-[20px] font-semibold">Plans</th>
                    {/* <th className="px-4 py-2 text-left">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="h-16">
                    <td className="px-4 py-2">
                      Ann Dental Clinic <span className="text-[#006241]">(1 Doctor added)</span>
                    </td>
                    <td className="px-4 py-2 text-[#FF6A6A]">02/05/2024</td>
                    <td className="px-4 py-2">Premium</td>
                    <td className="px-4 py-2">
                      <a href="/path/to/bill" className="text-[#006241] underline">
                        View Bill
                      </a>
                    </td>
                  </tr>
                  <tr className="h-16">
                    <td className="px-4 py-2">AR Dental Clinic</td>
                    <td className="px-4 py-2">02/05/2024</td>
                    <td className="px-4 py-2">Basic</td>
                    <td className="px-4 py-2">
                      <a href="/path/to/bill" className="text-[#006241] underline">
                        View Bill
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Bill History':
        return (
            <div>
              <div className="mt-1 bg-white p-4 rounded shadow bg-none">
                <table className="w-full table-auto">
                  <thead className="bg-transparent">
                  <tr className='!bg-transparent dark:!bg-transparent'>
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">Order ID</th>
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">Bill Date</th>
                      <th className="px-4 py-2 text-left text-[20px] font-semibold">Amount</th>
                      {/* <th className="px-4 py-2 text-left">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-16">
                      <td className="px-4 py-2">
                      36ds1hfn71368d1701
                      </td>
                      <td className="px-4 py-2 text-[#FF6A6A]">02/05/2024</td>
                      <td className="px-4 py-2">₹ 200</td>
                      <td className="px-4 py-2">
                        <a href="/path/to/bill" className="text-[#006241] underline">
                          View Bill
                        </a>
                      </td>
                    </tr>
                    <tr className="h-16">
                      <td className="px-4 py-2">36ds1hfn71368d1701</td>
                      <td className="px-4 py-2">02/05/2024</td>
                      <td className="px-4 py-2">₹ 200</td>
                      <td className="px-4 py-2">
                        <a href="/path/to/bill" className="text-[#006241] underline">
                          View Bill
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex border-b border-gray-300 mb-4">
        <button
          className={`px-4 py-2 focus:outline-none ${activeTab === 'Subscriptions' ? 'border-b-2 border-[#006241] text-[#006241]' : 'text-gray-600'}`}
          onClick={() => setActiveTab('Subscriptions')}
        >
          Subscriptions
        </button>
        <button
          className={`px-4 py-2 focus:outline-none ${activeTab === 'Bill History' ? 'border-b-2 border-[#006241] text-[#006241]' : 'text-gray-600'}`}
          onClick={() => setActiveTab('Bill History')}
        >
          Bill History
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SubscriptionDetails;

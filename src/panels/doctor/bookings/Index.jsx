import React, { Fragment } from "react";
import ScrollToTop from "../../../components/ScrollToTop";
import CustomButton from "../../../components/CustomButton";
import { Tab } from "@headlessui/react";

const Index = () => {
  return (
    <div>
      <ScrollToTop />
      <div className="panel mt-1">
        <div className="flex items-center flex-wrap gap-1 justify-between mb-8">
          <div className="flex items-center gap-1 flex-grow">
            <h5 className="font-bold text-lg dark:text-white-light">
              Patient Details
            </h5>
            <div className="border-t border-gray-300 dark:border-gray-600 flex-grow ml-2"></div>
          </div>
          <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark gap-y-4">
            <button type="button" className="btn btn-outline-danger mr-3">
              Emergency
            </button>
            <CustomButton>Completed</CustomButton>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:flex justify-between gap-4 mb-5">
          <div className="w-full">
            <label htmlFor="first-name">Name</label>
            <input
              id="first-name"
              type="text"
              placeholder="loremipsum234@gmail.com"
              className="form-input form-input-green"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email">Age</label>
            <input
              id="age"
              type="number"
              placeholder="Age"
              className="form-input form-input-green"
              autoComplete="off"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email">Date of Birth</label>
            <input
              id="dob"
              type="email"
              placeholder="Male"
              className="form-input form-input-green"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5">
          <div className="w-full">
            <label htmlFor="first-name">Gender</label>
            <input
              id="gender"
              type="text"
              placeholder="loremipsum234@gmail.com"
              className="form-input form-input-green"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email">Phone Number</label>
            <input
              id="phone-number"
              type="number"
              placeholder="loremipsum234@gmail.com"
              className="form-input form-input-green"
              autoComplete="off"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email">Token ID</label>
            <input
              id="token-id"
              type="text"
              placeholder="asdvwveabe01"
              className="form-input form-input-green"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:flex justify-between gap-4 mb-5">
          <div className="w-1/3">
            <label htmlFor="first-name">Time</label>
            <input
              id="time"
              type="text"
              placeholder="loremipsum234@gmail.com"
              className="form-input form-input-green"
            />
          </div>
        </div>

        <Tab.Group>
          <Tab.List className="mt-3 flex flex-wrap font-bold">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${
                    selected
                      ? "text-success !outline-none before:!w-full before:bg-success"
                      : "before:w-full before:bg-gray-100 dark:before:bg-gray-600"
                  } relative -mb-[1px] p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[2px] before:transition-all before:duration-700 hover:text-success mt-5`}
                >
                  Medical Report
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${
                    selected
                      ? "text-success !outline-none before:!w-full before:bg-success"
                      : "before:w-full before:bg-dark-light dark:before:bg-gray-600 "
                  } relative -mb-[1px] p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[2px] before:transition-all before:duration-700 hover:text-success mt-5`}
                >
                  History
                </button>
              )}
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="active pt-5">
                <div className="prose bg-[#f7f9fa] px-4 py-9 sm:px-8 sm:py-16 rounded max-w-full dark:bg-[#1b2e4b] dark:text-white-light w-full mb-5">
                  <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5">
                    <div className="w-full">
                      <label htmlFor="first-name">Symptoms</label>
                      <input
                        id="gender"
                        type="text"
                        placeholder="____________________"
                        className="form-input form-input-green bg-transparent"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="email">Diagnosis</label>
                      <input
                        id="phone-number"
                        type="number"
                        placeholder="______________________"
                        className="form-input form-input-green bg-transparent"
                        autoComplete="off"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="email">Medical Test</label>
                      <input
                        id="token-id"
                        type="text"
                        placeholder="______________________"
                        className="form-input form-input-green bg-transparent"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5 ">
                    <div className="w-full">
                      <label htmlFor="first-name">Prescription</label>
                      <textarea
                        id="prescription"
                        type="text"
                        placeholder="____________________"
                        className="form-input form-input-green bg-transparent"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="email">Notes</label>
                      <textarea
                        id="Notes"
                        type="text"
                        placeholder="______________________"
                        className="form-input form-input-green bg-transparent"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div>
              <div className="prose bg-[#f7f9fa] px-4 py-9 sm:px-8 sm:py-16 rounded max-w-full dark:bg-[#1b2e4b] dark:text-white-light w-full mb-5 mt-5 ">
                <div className="flex items-center text-gray-500 font-semibold dark:text-white-dark">
                  <CustomButton>25 January 2024</CustomButton>
                </div>
                <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5 mt-6">
                  <div className="w-full">
                    <label htmlFor="first-name">Symptoms</label>
                    <input
                      id="gender"
                      type="text"
                      placeholder="____________________"
                      className="form-input form-input-green bg-transparent"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email">Diagnosis</label>
                    <input
                      id="phone-number"
                      type="number"
                      placeholder="______________________"
                      className="form-input form-input-green bg-transparent"
                      autoComplete="off"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email">Medical Test</label>
                    <input
                      id="token-id"
                      type="text"
                      placeholder="______________________"
                      className="form-input form-input-green bg-transparent"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:flex justify-between gap-5 mb-5">
                  <div className="w-full">
                    <label htmlFor="first-name">Prescription</label>
                    <textarea
                      id="prescription"
                      type="text"
                      placeholder="____________________"
                      className="form-input form-input-green bg-transparent"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email">Notes</label>
                    <textarea
                      id="Notes"
                      type="text"
                      placeholder="______________________"
                      className="form-input form-input-green bg-transparent"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Index;

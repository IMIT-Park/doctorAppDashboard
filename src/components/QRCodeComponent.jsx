import React, { useState } from "react";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconDownload from "./Icon/IconDownload";
import IconCopy from "./Icon/IconCopy";
import { showMessage } from "../utils/showMessage";
import { handleGetLocation } from "../utils/getLocation";
import IconMenuContacts from "./Icon/Menu/IconMenuContacts";
import ModalSubscription from "../panels/owner/clinics/ModalSubscription";

const QRCodeComponent = ({
  qrUrl,
  locationDetails,
  clinicId,
  ownerId,
  fetchClinicData,
}) => {
  const [subscriptionModal, setsubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  const openSubscriptionModal = () => {
    setsubscriptionModal(true);
  };

  const closeSubscriptionModal = () => {
    setsubscriptionModal(false);
    setSelectedPlan(null);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qrcode-canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex flex-col md:flex-row w-full mt-5">
      <div className="flex flex-col xl:flex-row items-start gap-3 w-full mt-5">
        <div className="flex items-center flex-wrap rounded mb-5 w-full xl:w-1/2">
          <form className="flex items-center w-full">
            <input
              type="text"
              defaultValue={qrUrl}
              className="form-input form-input-green rounded w-full rounded-r-none"
              readOnly
            />
            <div className="">
              <CopyToClipboard
                text={qrUrl}
                onCopy={(text, result) => {
                  if (result) {
                    showMessage("Copied Successfully");
                  }
                }}
              >
                <button
                  type="button"
                  className="btn btn-green rounded lg:w-32 sm:w-24 rounded-l-none"
                >
                  <IconCopy className="ltr:mr-2 rtl:ml-2" />
                  Copy
                </button>
              </CopyToClipboard>
            </div>
          </form>
        </div>
        <div className="flex flex-col md:flex-row gap-2 xl:w-1/2 w-full p-0 rounded sm:pb-2 md:pb-0 sm:pr-2">
          <QRCode
            id="qrcode-canvas"
            value={qrUrl}
            size={220}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="btn btn-green w-full md:w-72 gap-1 lg:text-sm sm:text-sm mb-2 md:mb-0 lg:px-0 whitespace-nowrap"
            onClick={downloadQRCode}
          >
            <IconDownload className="" />
            Download QRcode
          </button>
          <button
            type="button"
            onClick={() => handleGetLocation(locationDetails)}
            className="btn btn-green flex items-center gap-1 w-full md:w-72 md:text-sm lg:text-sm max-lg:text-base sm:text-base mb-2 md:mb-0 md:px-2 sm:px-2 lg:px-0 whitespace-nowrap"
          >
            <IconMenuContacts className="md:mr-1 lg:mr-1" />
            View Location
          </button>
          <button
            type="button"
            className="btn btn-white text-green-600 border-green-600 w-full md:text-sm sm:text-base md:w-72 lg:text-sm max-lg:text-base shadow-sm md:px-2 sm:px-2 lg:px-0 whitespace-nowrap"
            onClick={openSubscriptionModal}
          >
            View Plan Details
          </button>
        </div>
      </div>
      <ModalSubscription
        open={subscriptionModal}
        closeModal={closeSubscriptionModal}
        clinicId={subscriptionModal && clinicId}
        ownerId={ownerId}
        buttonLoading={buttonLoading}
        setButtonLoading={setButtonLoading}
        fetchClinicData={fetchClinicData}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />
    </div>
  );
};

export default QRCodeComponent;

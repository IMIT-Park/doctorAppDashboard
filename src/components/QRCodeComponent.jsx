import React from "react";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconDownload from "./Icon/IconDownload";
import IconCopy from "./Icon/IconCopy";
import { showMessage } from "../utils/showMessage";

const QRCodeComponent = ({ qrUrl }) => {
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
    <div className="w-full flex items-start gap-3 flex-wrap mt-5">
      <div className="flex flex-col items-center bg-[#f1f2f3] dark:bg-[#060818] rounded p-2">
        <QRCode id="qrcode-canvas" value={qrUrl} size={220} />
        <button
          type="button"
          className="mt-2 btn btn-green w-fit"
          onClick={downloadQRCode}
        >
          <IconDownload className="mr-2" />
          Download
        </button>
      </div>
      <div className="bg-[#f1f2f3] p-2 rounded dark:bg-[#060818] w-full max-w-80">
        <form>
          <input
            type="text"
            defaultValue={qrUrl}
            className="form-input form-input-green"
            readOnly
          />
          <div className="mt-1">
            <CopyToClipboard
              text={qrUrl}
              onCopy={(text, result) => {
                if (result) {
                  showMessage("Copied Successfully");
                }
              }}
            >
              <button type="button" className="btn btn-green px-2 ml-auto">
                <IconCopy className="ltr:mr-2 rtl:ml-2" />
                Copy
              </button>
            </CopyToClipboard>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QRCodeComponent;

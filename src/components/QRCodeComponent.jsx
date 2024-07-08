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
    <div className="w-fit flex items-start gap-3 flex-wrap ">
      <div className="flex items-center gap-8 flex-wrap rounded mt-3">
        <form className="flex items-center">
          <input
            type="text"
            defaultValue={qrUrl}
            className="form-input form-input-green rounded-none w-64"
            readOnly
          />
          <div>
            <CopyToClipboard
              text={qrUrl}
              onCopy={(text, result) => {
                if (result) {
                  showMessage("Copied Successfully");
                }
              }}
            >
              <button type="button" className="btn btn-green px-2 rounded-none">
                <IconCopy className="ltr:mr-2 rtl:ml-2" />
                Copy
              </button>
            </CopyToClipboard>
          </div>
        </form>
        <QRCode
          id="qrcode-canvas"
          value={qrUrl}
          size={220}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="btn btn-green w-52"
          onClick={downloadQRCode}
        >
          <IconDownload className="mr-2" />
          Download QR code
        </button>
        {/* <div className="bg-[#f1f2f3] p-2 rounded dark:bg-[#060818] w-full max-w-80"> */}
      </div>

      {/* </div> */}
    </div>
  );
};

export default QRCodeComponent;

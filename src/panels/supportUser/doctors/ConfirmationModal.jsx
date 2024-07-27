import { useEffect } from "react";
import Swal from "sweetalert2";

const ConfirmationModal = ({
  show,
  status,
  title = "Are you sure?",
  text = `Do you want to ${status === 0 ? "Reject" : "Verify"} this request?`,
  icon = "warning",
  confirmButtonText = `${status === 0 ? "Reject" : "Verify"}`,
  onConfirm,
  onClose,
  confirmButtonColor = "#006241",
  onFinalConfirm,
}) => {
  useEffect(() => {
    if (show) {
      Swal.fire({
        icon,
        title,
        text,
        showCancelButton: true,
        confirmButtonText,
        padding: "2em",
        customClass: "sweet-alerts",
        confirmButtonColor,
      }).then((result) => {
        if (result.isConfirmed) {
          if (onConfirm) {
            onConfirm();
          }
          // Execute final confirmation message
          if (onFinalConfirm) {
            onFinalConfirm(status);
          }
        } else if (!result.isConfirmed && onClose) {
          onClose();
        }
      });
    }
  }, [show, status, title, text, icon, confirmButtonText, confirmButtonColor, onConfirm, onClose, onFinalConfirm]);

  return null;
};

export default ConfirmationModal;

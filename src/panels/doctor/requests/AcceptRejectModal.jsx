import { useEffect } from "react";
import Swal from "sweetalert2";

const AcceptRejectModal = ({
  show,
  isReject,
  title = "Are you sure?",
  text = `Do you want to ${isReject ? "Reject" : "Accept"} this request?`,
  icon = "warning",
  confirmButtonText = `${isReject ? "Reject" : "Accept"}`,
  onConfirm,
  onClose,
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
      }).then((result) => {
        if (result.value && onConfirm) {
          onConfirm();
        } else {
          onClose();
        }
      });
    }
  }, [show]);

  return null;
};

export default AcceptRejectModal;

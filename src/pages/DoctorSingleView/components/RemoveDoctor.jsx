import { useEffect } from "react";
import Swal from "sweetalert2";

const RemoveDoctor = ({
  show,
  title = "Are you sure?",
  text = `Do you want to Remove this doctor?`,
  icon = "warning",
  confirmButtonText = `Remove`,
  onConfirm,
  onClose,
  confirmButtonColor = "#006241",
}) => {
  useEffect(() => {
    if (show) {
      Swal.fire({
        icon,
        title,
        text,
        confirmButtonColor,
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

export default RemoveDoctor;

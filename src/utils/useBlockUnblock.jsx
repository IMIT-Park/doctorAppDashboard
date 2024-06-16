import { useState } from "react";
import Swal from "sweetalert2";
import { showMessage } from "./showMessage";
import NetworkHandler from "./NetworkHandler";

const useBlockUnblock = (fetchDataCallback) => {
  const [loading, setLoading] = useState(false);

  const handleBlockUnblock = async (id, action) => {
    setLoading(true);
    try {
      const response = await NetworkHandler.makePostRequest(
        `/v1/auth/activate/${id}`
      );

      if (response.status === 201) {
        // showMessage(
        //   `${action === "activate" ? "Unblocked" : "Blocked"} successfully.`,
        //   "success"
        // );
        fetchDataCallback();
      }
    } catch (error) {
      showMessage("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (id, action, entity) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `You want to ${
        action === "activate" ? "unblock" : "block"
      } this ${entity}!`,
      showCancelButton: true,
      confirmButtonText: action === "activate" ? "Unblock" : "Block",
      padding: "2em",
      customClass: "sweet-alerts",
    }).then((result) => {
      if (result.value) {
        handleBlockUnblock(id, action);
        Swal.fire({
          title: `${action === "activate" ? "Unblocked" : "Blocked"}!`,
          text: `The ${entity} has been ${
            action === "activate" ? "unblocked" : "blocked"
          }.`,
          icon: "success",
          customClass: "sweet-alerts",
        });
      }
    });
  };

  return { showAlert, loading };
};

export default useBlockUnblock;

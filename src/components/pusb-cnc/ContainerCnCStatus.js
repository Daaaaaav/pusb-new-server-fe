import React, { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Loader from "../shared/Loader"; 
import { BaseUrl } from "../../config/config"; 

const ContainerCnCStatus = ({ cnc }) => {
  const [loading, setLoading] = useState(null);
  const [status, setStatus] = useState(cnc.status);

  const handleToggleStatus = async () => {
    const isCurrentlyActive = status;

    const confirmResult = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${isCurrentlyActive ? "deactivate" : "activate"} this CNC.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${isCurrentlyActive ? "deactivate" : "activate"} it!`,
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      setLoading(cnc.id);

      try {
        const response = await fetch(
          `${BaseUrl}/pusb-cnc/${cnc.id}/${isCurrentlyActive ? "deactivate" : "activate"}`,
          { method: "POST" }
        );

        if (response.ok) {
          Swal.fire({
            title: "Success",
            text: `CNC ${isCurrentlyActive ? "deactivated" : "activated"} successfully`,
            icon: "success",
            timer: 3000,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
          });

          setStatus(!isCurrentlyActive);
        } else {
          throw new Error("Failed to update CNC status");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Failed to ${isCurrentlyActive ? "deactivate" : "activate"} CNC`,
          icon: "error",
          timer: 3000,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
        });
        console.error(error);
      } finally {
        setLoading(null);
      }
    }
  };

  return (
    <div className="flex items-center h-full">
      {loading === cnc.id ? (
        <Loader />
      ) : (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={status}
            onChange={handleToggleStatus}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {status ? "Deactivate" : "Activate"}
          </span>
        </label>
      )}
    </div>
  );
};

ContainerCnCStatus.propTypes = {
  cnc: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.bool.isRequired,
    name: PropTypes.string, 
  }).isRequired,
};

export default ContainerCnCStatus;

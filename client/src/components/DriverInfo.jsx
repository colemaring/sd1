import React, { useEffect, useState, useContext } from "react";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { RiUserLocationLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";
import { useParams } from "react-router-dom";
import { DriversContext } from "../context/DriversContext";
import { useNavigate } from "react-router-dom"; 
import { FaTrash } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

const DriverInfo = () => {
  const { theme } = useTheme();
  const { driverPhone } = useParams();
  const { drivers, isLoading } = useContext(DriversContext);
  const [driverData, setDriverData] = useState(null);
  const navigate = useNavigate(); 
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) {
      handleConfirmDelete();
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`https://aifsd.xyz/api/drivers/${driverPhone}`, {
        method: "DELETE",
        headers: {
          password: password,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete driver");
      }

      setShowModal(false);
      navigate(`/fleet`);
    } catch (error) {
      console.error("Error deleting driver:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (drivers && drivers.length > 0) {
      const driver = drivers.find((d) => d.phone_number === driverPhone);
      setDriverData(driver);
    }
  }, [driverPhone, drivers]);

  // Loading skeleton
  if (!drivers || drivers.length === 0) {
    return (
      <div className="h-[213px] w-full animate-pulse bg-gray-300 border rounded-xl"></div>
    );
  }

  if (!driverData) {
    return <div>Driver not found</div>;
  }

  return (
    <div className="bg-card relative flex flex-row items-center rounded-xl w-full p-6 text-card-foreground shadow border bg1 bg-top bg-contain ">
      {/* Left: Avatar + Risk Score */}
      <div className="flex flex-col items-center w-2/5 pr-4">
        {/* Avatar Placeholder */}
        <div className="rounded-full bg-muted w-20 h-20 overflow-hidden flex items-center justify-center">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${driverData.name}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="pt-4 text-center w-100 mb-1">
          <h1 className="text-3xl font-bold">
            {driverData.risk_score || "N/A"}
          </h1>

          <h2 className="text-sm">Safety Score</h2>
          {driverData.percent_change != null ? (
            <span
              className={`font-bold ${
                driverData.percent_change > 0
                  ? "text-green-500"
                  : driverData.percent_change < 0
                  ? "text-red-500"
                  : ""
              }`}
            >
              {driverData.percent_change >= 0
                ? `+${driverData.percent_change}%`
                : `${driverData.percent_change}%`}
            </span>
          ) : (
            <span className="font-bold">+0%</span>
          )}

          <div className="flex items-center w-full">
            <span className="text-xs text-muted-foreground">Unsafe</span>

            <div className="relative flex-grow mx-2 bg-gray-300 rounded-full h-2">
              <div
                className={`h-full rounded-full ${
                  driverData.risk_score > 80
                    ? "bg-green-500"
                    : driverData.risk_score > 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${driverData.risk_score}%` }}
              ></div>
            </div>

            <span className="text-xs text-muted-foreground">Safe</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-l h-40 border-muted"></div>

      {/* Middle: Driver Name & Phone */}
      <div className="flex flex-col w-2/5 pl-4">
        <span className="text-sm text-primary">Selected Driver</span>
        <h1 className="text-3xl font-bold mb-12">{driverData.name}</h1>

        <h1 className="text-xl font-semibold">
          {" "}
          {driverData.phone_number.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "($1) $2-$3"
          )}
        </h1>
        <h2 className="text-sm text-primary">Contact Information</h2>
      </div>

      {/* Right: Activity + Delete */}
      <div className="relative flex flex-col w-1/5 pl-4 h-40">
        {/* Delete Driver Button (aligned to the bottom right) */}
        <div className="flex justify-end">
          <button
            className="p-2 rounded-full hover:bg-destructive/10 text-destructive"
            onClick={handleDelete}
          >
            <FaTrash size={16} />
          </button>
        </div>

        {/* Push Activity Status to Bottom */}
        <div className="flex-grow"></div>

        {/* Active Status Ping (aligned to the top right) */}
        <div className="flex items-center justify-end">
          {driverData.active ? (
            <div className="relative w-6 h-6">
              <span className="absolute rounded-full bg-green-500 w-6 h-6 inline-flex animate-ping"></span>
              <span className="absolute rounded-full bg-green-700 w-6 h-6"></span>
            </div>
          ) : (
            <span className="rounded-full bg-red-500 w-6 h-6"></span>
          )}
        </div>


        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setError("");
            setPassword("");
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Driver Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete driver {driverData.name}?</p>
            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone. All associated trips and risk events
              will also be deleted.
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Enter Admin Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  isInvalid={!!error}
                />
                <Form.Control.Feedback type="invalid">
                  {error}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setError("");
                setPassword("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={!password}
            >
              Delete Driver
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DriverInfo;

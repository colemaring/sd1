import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaTrash } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

function ScoreCard({ style, name, phone, score, change, active }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeDropdown, setActiveDropdown] = useState(null); // State to track the active dropdown
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleDropdown = (name) => {
    // If the clicked dropdown is already open, close it. Otherwise, open the new one.
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleCardClick = (e) => {
    if (!showModal) {
      navigate(`/driver/${phone}`);
    }
  };

  const getRiskLevel = (score) => {
    if (score > 80) return "Low Risk";
    if (score > 60) return "Medium Risk";
    return "High Risk";
  };

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
      const response = await fetch(`https://aifsd.xyz/api/drivers/${phone}`, {
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
      window.location.reload();
    } catch (error) {
      console.error("Error deleting driver:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      <div
        key={name}
        className={`${style != null ? style : "relative cardBorder flex rounded-xl w-72 lg:h-[200px] p-4 bg-card text-foreground shadow-md cursor-pointer border transition-transform duration-300 ease-in-out hover:scale-[1.02]"}`}
        onClick={handleCardClick} // Add onClick handler
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-muted w-16 h-16">
            <img
              src={`https://api.dicebear.com/9.x/micah/svg?seed=${phone}&mouth=laughing,smile,smirk`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* On/off signal */}
        <div className="absolute top-[65%] left-[12%] transform">
          {active ? (
            <>
              <span className="absolute rounded-full bg-green-500 w-6 h-6 inline-flex animate-ping"></span>
              <span className="absolute rounded-full bg-green-700 w-6 h-6"></span>
            </>
          ) : (
            <span className="absolute rounded-full bg-red-500 w-6 h-6"></span>
          )}
        </div>

        {/* Driver Info */}
        <div className="flex flex-col pl-4 w-full">
          <div className="text-center">
            <h3 className="text-sm text-muted-foreground">
              {getRiskLevel(score)}
            </h3>
            <h1 className="text-lg font-semibold">{name}</h1>
            <h3 className="text-sm">
              {phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
            </h3>
          </div>

          {/* Risk Score and Percentage Change */}
          <div className="flex flex-col items-center pt-4">
            <div className="flex items-baseline">
              <h1 className="text-4xl font-bold">{score}</h1>
              <h3 className={`text-sm font-medium pl-2 ${change < 0 ? 'text-destructive' : change > 0 ? 'text-green-500' : ''}`}>
                {`${change >= 0 ? '+' : ''}${change}%`}
              </h3>
            </div>
            <h3 className="text-xs text-muted-foreground">Safety Score</h3>
          </div>
        </div>

        <button
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-destructive/10 text-destructive"
          onClick={handleDelete}
        >
          <FaTrash size={16} />
        </button>

        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setError("");
            setPassword("");
          }}
          onClick={(e) => e.stopPropagation()}
          // backdrop="static"
          // keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Driver Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete driver {name}?</p>
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
}

export default ScoreCard;

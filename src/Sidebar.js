import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";

const Sidebar = () => {
  const [showHint, setShowHint] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          height: "100%",
          width: "90px",
          backgroundColor: "#343a40",
          color: "white",
          paddingTop: "60px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
        }}
      >
        {/* Instruction Icon */}
        <div onClick={() => setShowInstructions(true)} style={iconStyle} title="Instructions">
          <i className="bx bx-book-open" style={{ fontSize: "2rem" }}></i>
        </div>

        {/* Hint Icon */}
        <div onClick={() => setShowHint(true)} style={iconStyle} title="Hint">
          <i className="bx bx-bulb" style={{ fontSize: "2rem" }}></i>
        </div>

        {/* Help Icon */}
        <div onClick={() => setShowHelp(true)} style={iconStyle} title="Help">
          <i className="bx bx-help-circle" style={{ fontSize: "2rem" }}></i>
        </div>
      </div>

      {/* Popups */}
      {showInstructions && <Popup title="Instructions" content={instructionsText} onClose={() => setShowInstructions(false)} />}
      {showHint && <Popup title="Hint" content={hintText} onClose={() => setShowHint(false)} />}
      {showHelp && <Popup title="Help" content={helpText} onClose={() => setShowHelp(false)} />}
    </>
  );
};

// Reusable Popup Component
const Popup = ({ title, content, onClose }) => {
  return (
    <div style={popupOverlay}>
      <div style={popupContent}>
        <button style={closeButton} onClick={onClose}>
          <i className="bx bx-x" style={{ fontSize: "24px" }}></i>
        </button>
        <h2 style={popupHeader}>{title}</h2>
        <p style={popupText}>{content}</p>
      </div>
    </div>
  );
};

// Popup Content
const instructionsText = `
1. Follow the steps in the simulator.
2. Arrange the blocks in order.
3. Use the correct settings before running.
4. Click "Run" to test your setup.
`;

const hintText = `
• Use the Tri-Colour LED block from the Wiz Simulator block thrice and arrange them sequentially.
• Select a colour and use the Delay block to set the time in seconds.
• Click on the "Run" button to run the program.
• Click on the "Get Help(?)" icon to see the solution video.
`;

const helpText = `
If you need assistance, refer to the documentation or watch the tutorial video.
You can also contact support for further help.
`;

// Styles
const iconStyle = {
  cursor: "pointer",
  padding: "15px",
  textAlign: "center",
  borderRadius: "10px",
  transition: "background 0.3s",
};

const popupOverlay = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const popupContent = {
  backgroundColor: "#fff",
  padding: "20px",
  width: "400px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
  textAlign: "center",
  position: "relative",
};

const popupHeader = {
  color: "#2c3e50",
  marginBottom: "10px",
};

const popupText = {
  textAlign: "left",
  whiteSpace: "pre-line",
};

const closeButton = {
  position: "absolute",
  top: "10px",
  right: "15px",
  border: "none",
  background: "none",
  cursor: "pointer",
};

export default Sidebar;

import React, { useState } from "react";
import { Nav, Offcanvas, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/bananashieldslogo.png";
import { List, House, People, BarChart, Bell, BoxArrowRight } from "react-bootstrap-icons";

const navContent = (onLogout) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    {/* Branding */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "linear-gradient(135deg,#ffd54b,#ffb300)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={logo}
            alt="BananaShield logo"
            style={{ width: 28, height: 28 }}
          />
        </div>

        <div>
          <h5 style={{ margin: 0, color: "#fff", fontWeight: 700 }}>BananaShield</h5>
          <small style={{ color: "#bcd4c1" }}>Admin Panel</small>
        </div>
      </div>
    </div>

    {/* Admin profile card */}
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          padding: 12,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#e9f7e9",
            color: "#0d4b2b",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          AD
        </div>
        <div style={{ color: "#fff" }}>
          <div style={{ fontWeight: 700 }}>Admin User</div>
          <div style={{ fontSize: 12, color: "#ffd54b", fontWeight: 700 }}>Administrator</div>
        </div>
      </div>
    </div>

    {/* Navigation menu */}
    <Nav className="flex-column" variant="pills" style={{ gap: 8 }}>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard" end className="sidenav-link">
          <House size={18} /> Dashboard
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={NavLink} to="/users" className="sidenav-link">
          <People size={18} /> User Management
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={NavLink} to="/reports" className="sidenav-link">
          <BarChart size={18} /> Reports Monitoring
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={NavLink} to="/feedback" className="sidenav-link">
          <Bell size={18} /> Feedback
        </Nav.Link>
      </Nav.Item>
    </Nav>

    {/* Logout anchored to bottom */}
    <div style={{ marginTop: "auto" }}>
      <Button
        onClick={() => onLogout && onLogout()}
        style={{
          width: "100%",
          backgroundColor: "#ffc107",
          border: "none",
          color: "#102a12",
          borderRadius: 10,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px",
        }}
      >
        <BoxArrowRight /> Logout
      </Button>
    </div>
  </div>
);

const SideNav = ({ onLogout }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="success"
        className="d-md-none"
        onClick={() => setShow(true)}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1050,
          borderRadius: 8,
          backgroundColor: "#0f4e36",
          border: "none",
          color: '#fff'
        }}
      >
        <List size={22} />
      </Button> 

      {/* Desktop sidebar */}
      <div
        className="d-none d-md-flex flex-column"
        style={{
          width: "var(--sidenav-width)",
          background: "linear-gradient(180deg,#0f4e36,#114b33)",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          color: "#ffffff",
          padding: "20px 16px",
          zIndex: 1060, // ensure sidebar sits above main content
        }}
      >
        {navContent(onLogout)}
      </div> 

      {/* thin divider between sidebar and main content (md+) */}
      <div
        className="d-none d-md-block"
        style={{
          position: "fixed",
          left: "var(--sidenav-width)",
          top: 0,
          bottom: 0,
          width: 10,
          background: "linear-gradient(180deg,#0f4e36,#114b33)",
          zIndex: 1055, // below the sidebar but above main content
        }}
      /> 

      {/* Mobile offcanvas */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        responsive="md"
        style={{ background: "linear-gradient(180deg,#0f4e36,#114b33)", color: "#fff" }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>BananaShield</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          {navContent(onLogout)}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SideNav;

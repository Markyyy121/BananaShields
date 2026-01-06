import React, { useState } from "react";
import { Nav, Offcanvas, Button, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/bananashieldslogo.png";
import {
  List,
  House,
  People,
  BarChart,
  Bell,
  BoxArrowRight,
} from "react-bootstrap-icons";

// Navigation content for both desktop and mobile
const navContent = (openLogoutModal, closeMobile) => (
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
          <img src={logo} alt="BananaShield" style={{ width: 28 }} />
        </div>

        <div>
          <h5 style={{ margin: 0, color: "#fff", fontWeight: 700 }}>
            BananaShield
          </h5>
          <small style={{ color: "#bcd4c1" }}>Admin Panel</small>
        </div>
      </div>
    </div>

    {/* Admin Profile Card */}
    <div style={{ marginBottom: 20 }}>
      <NavLink
        to="/profile"
        className="admin-profile-link"
        onClick={closeMobile} // close offcanvas on mobile
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 12,
          borderRadius: 12,
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
          <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>
            Administrator
          </div>
        </div>
      </NavLink>
    </div>

    {/* Navigation Links */}
    <Nav className="flex-column text-start" style={{ gap: 8 }}>
      {[
        { to: "/dashboard", icon: <House size={18} />, label: "Dashboard" },
        { to: "/users", icon: <People size={18} />, label: "User Management" },
        { to: "/reports", icon: <BarChart size={18} />, label: "Reports Monitoring" },
        { to: "/feedback", icon: <Bell size={18} />, label: "Feedback" },
      ].map((item, i) => (
        <Nav.Link
          key={i}
          as={NavLink}
          to={item.to}
          className="sidenav-link"
          onClick={closeMobile} // hide offcanvas on mobile
        >
          {item.icon} {item.label}
        </Nav.Link>
      ))}
    </Nav>

    {/* Logout Button */}
    <div style={{ marginTop: "auto" }}>
      <Button
        onClick={() => {
          closeMobile(); // hide offcanvas first
          openLogoutModal(); // then open logout modal
        }}
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

const SideNav = () => {
  const [showMobile, setShowMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {!showMobile && ( // hide the icon when Offcanvas is open
        <Button
          className="d-md-none"
          onClick={() => setShowMobile(true)}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1050,
            backgroundColor: "#0f4e36",
            border: "none",
            borderRadius: 8,
          }}
        >
          <List size={22} />
        </Button>
      )}

      {/* Desktop Sidebar */}
      <div
        className="d-none d-md-flex flex-column"
        style={{
          width: 240,
          background: "linear-gradient(180deg,#0f4e36,#114b33)",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          color: "#fff",
          padding: "20px 16px",
          zIndex: 1060,
        }}
      >
        {navContent(() => setShowLogoutModal(true), () => {})}
      </div>

      {/* Mobile Offcanvas */}
      <Offcanvas
        show={showMobile}
        onHide={() => setShowMobile(false)}
        placement="start"
        className="d-md-none"
        style={{
          background: "linear-gradient(180deg,#0f4e36,#114b33)",
          color: "#fff",
        }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>BananaShield</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {navContent(
            () => setShowLogoutModal(true),
            () => setShowMobile(false) // closeMobile function
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Logout Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <BoxArrowRight size={28} className="mb-2" />
          <h4>Confirm Logout</h4>
          <p>Are you sure you want to log out of your account?</p>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="light" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="warning" onClick={confirmLogout}>
              Logout
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SideNav;

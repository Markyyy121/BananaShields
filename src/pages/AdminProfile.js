// src/pages/AdminProfile.js
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/sidenav";
import "../css/AdminDashboard.css";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";

const AdminProfile = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);   // loading for fetching data
  const [saving, setSaving] = useState(false);    // loading for save button
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("User not authenticated");
    navigate("/login"); // optional redirect if not logged in
  }

  const adminId = user?.uid;

  // Fetch admin data
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminRef = doc(db, "admin", adminId);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const data = adminSnap.data();
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            role: data.role || "",
            location: data.location || "",
          });
        } else {
          console.error("Admin data not found");
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (adminId) fetchAdmin();
  }, [adminId]);

  // Warn on unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes.";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const onChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
    setDirty(true);
  };

  const validate = () => {
    const err = {};
    if (!form.firstName?.trim()) err.firstName = "First name is required";
    if (!form.lastName?.trim()) err.lastName = "Last name is required";
    if (!form.phone?.trim()) err.phone = "Phone number is required";
    if (form.phone && form.phone.replace(/\D/g, "").length < 7) err.phone = "Enter a valid phone number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onCancel = () => {
    if (dirty) return setShowUnsaved(true);
    navigate(-1);
  };

  const confirmCancel = () => {
    setShowUnsaved(false);
    setDirty(false);
    navigate(-1);
  };

  const onSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      const adminRef = doc(db, "admin", adminId);
      await updateDoc(adminRef, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        location: form.location,
      });

      setDirty(false);
      setShowConfirm(true);
    } catch (err) {
      console.error("Error updating admin:", err);
      alert("Failed to save changes. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex admin-page" style={{ minHeight: "100vh", backgroundColor: "#D4E8D4" }}>
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <h3 className="admin-title"><span className="admin-title-badge">Edit Profile</span></h3>

              <Row className="mb-3">
                <Col xs={12} lg={12}>
                  <Card className="ap-card">
                    <Card.Body>
                      <h5 className="ap-section-title">Personal Information</h5>

                      <Form>
                        <Row className="g-3 text-start">
                          <Col xs={12} md={6}>
                            <Form.Group controlId="firstName">
                              <Form.Label>First Name</Form.Label>
                              <Form.Control value={form.firstName} onChange={onChange("firstName")} />
                              {errors.firstName && <div className="text-danger small mt-1">{errors.firstName}</div>}
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group controlId="lastName">
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control value={form.lastName} onChange={onChange("lastName")} />
                              {errors.lastName && <div className="text-danger small mt-1">{errors.lastName}</div>}
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group controlId="email">
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control value={form.email} disabled />
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group controlId="phone">
                              <Form.Label>Phone Number</Form.Label>
                              <Form.Control value={form.phone} onChange={onChange("phone")} />
                              {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group controlId="role">
                              <Form.Label>Role</Form.Label>
                              <Form.Control value={form.role} disabled />
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group controlId="location">
                              <Form.Label>Location</Form.Label>
                              <Form.Control value={form.location} onChange={onChange("location")} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                          <Button variant="light" className="me-2" onClick={onCancel}>Cancel</Button>
                          <Button variant="success" onClick={onSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* Confirm saved */}
          <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
            <Modal.Body className="text-center">
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Profile updated</div>
              <div className="text-muted mb-3">Your changes have been saved successfully.</div>
              <Button onClick={() => setShowConfirm(false)} variant="success">OK</Button>
            </Modal.Body>
          </Modal>

          {/* Unsaved changes */}
          <Modal show={showUnsaved} onHide={() => setShowUnsaved(false)} centered>
            <Modal.Body>
              <div style={{ fontWeight: 700 }}>Discard changes?</div>
              <div className="text-muted mb-3">You have unsaved changes. Are you sure you want to leave?</div>
              <div className="d-flex justify-content-end">
                <Button variant="light" className="me-2" onClick={() => setShowUnsaved(false)}>Stay</Button>
                <Button variant="danger" onClick={confirmCancel}>Leave</Button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

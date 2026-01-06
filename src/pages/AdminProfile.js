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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) navigate("/login");

  const adminId = user?.uid;

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
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (adminId) fetchAdmin();
  }, [adminId]);

  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
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
    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";
    if (!form.phone.trim()) err.phone = "Phone number is required";
    setErrors(err);
    return Object.keys(err).length === 0;
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
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      {/* SIDEBAR */}
      <aside className="admin-sidenav">
        <SideNav />
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <div className="admin-main-container">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
              <Spinner />
            </div>
          ) : (
            <>
              <h3 className="admin-title">
                <span className="admin-title-badge">Edit Profile</span>
              </h3>

              <Row>
                <Col xs={12}>
                  <Card className="ap-card">
                    <Card.Body>
                      <h5 className="ap-section-title text-start">Personal Information</h5>

                      <Form className="text-start mt-3">
                        <Row className="g-3">
                          <Col xs={12} md={6}>
                            <Form.Group>
                              <Form.Label>First Name</Form.Label>
                              <Form.Control value={form.firstName} onChange={onChange("firstName")} />
                              {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group>
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control value={form.lastName} onChange={onChange("lastName")} />
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group>
                              <Form.Label>Email</Form.Label>
                              <Form.Control value={form.email} disabled />
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group>
                              <Form.Label>Phone</Form.Label>
                              <Form.Control value={form.phone} onChange={onChange("phone")} />
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group>
                              <Form.Label>Role</Form.Label>
                              <Form.Control value={form.role} disabled />
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6}>
                            <Form.Group>
                              <Form.Label>Location</Form.Label>
                              <Form.Control value={form.location} onChange={onChange("location")} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                          <Button variant="light" className="me-2" onClick={() => setShowUnsaved(true)}>
                            Cancel
                          </Button>
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

          {/* MODALS (UNCHANGED) */}
          <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
            <Modal.Body className="text-center">
              <strong>Profile updated</strong>
              <div className="text-muted mb-3">Changes saved successfully.</div>
              <Button onClick={() => setShowConfirm(false)} variant="success">OK</Button>
            </Modal.Body>
          </Modal>

          <Modal show={showUnsaved} onHide={() => setShowUnsaved(false)} centered>
            <Modal.Body>
              <strong>Discard changes?</strong>
              <div className="text-muted mb-3">You have unsaved changes.</div>
              <div className="d-flex justify-content-end">
                <Button variant="light" className="me-2" onClick={() => setShowUnsaved(false)}>Stay</Button>
                <Button variant="danger" onClick={() => navigate(-1)}>Leave</Button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;

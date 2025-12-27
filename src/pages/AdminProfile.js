import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Form, Button, Image, Modal, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/sidenav";
import { FiCamera } from "react-icons/fi";
import "../css/AdminDashboard.css";
import "../css/AdminProfile.module.css";

const initialData = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@bananashield.com",
  phone: "+63 912 345 6789",
  role: "System Administrator",
  location: "Manila, Philippines",
};

const AdminProfile = () => {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dirty, setDirty] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

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
    // simple phone length check
    if (form.phone && form.phone.replace(/\D/g, "").length < 7) err.phone = "Enter a valid phone number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onUploadClick = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(f.type)) return alert("Please upload JPG or PNG images only.");
    if (f.size > 5 * 1024 * 1024) return alert("Max file size is 5MB.");
    const preview = URL.createObjectURL(f);
    setAvatarFile(f);
    setAvatarPreview(preview);
    setDirty(true);
  };

  const onRemove = () => {
    if (!avatarFile && !avatarPreview) return;
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setDirty(true);
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

  const onSave = () => {
    if (!validate()) return;
    // TODO: replace with API call to persist changes
    console.log("Saving profile", { form, avatarFile });
    setDirty(false);
    setShowConfirm(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="d-flex admin-page" style={{ minHeight: "100vh", backgroundColor: "#D4E8D4" }}>
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container">

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
                          <Form.Control value={form.firstName} onChange={onChange("firstName")} aria-required="true" />
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
                          <Form.Control value={form.email} disabled className="disabled-field" />
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
                          <Form.Control value={form.role} disabled className="disabled-field" />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group controlId="location">
                          <Form.Label>Location</Form.Label>
                          <Form.Control value={form.location} onChange={onChange("location")} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4 ap-action-row">
                      <Button variant="light" className="btn-secondary-light me-2" onClick={onCancel}>Cancel</Button>
                      <Button className="btn-primary-gold" onClick={onSave}>Save Changes</Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Confirm saved */}
          <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
            <Modal.Body className="text-center">
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Profile updated</div>
              <div className="text-muted mb-3">Your changes have been saved successfully.</div>
              <div className="d-flex justify-content-center">
                <Button onClick={() => setShowConfirm(false)} className="btn-primary-gold">OK</Button>
              </div>
            </Modal.Body>
          </Modal>

          {/* Unsaved confirm */}
          <Modal show={showUnsaved} onHide={() => setShowUnsaved(false)} centered>
            <Modal.Body>
              <div style={{ fontWeight: 700 }}>Discard changes?</div>
              <div className="text-muted mb-3">You have unsaved changes. Are you sure you want to leave?</div>
              <div className="d-flex justify-content-end">
                <Button variant="light" className="btn-secondary-light me-2" onClick={() => setShowUnsaved(false)}>Stay</Button>
                <Button className="btn-danger" onClick={confirmCancel}>Leave</Button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

// AdminLogin.js
import React, { useState } from "react";
import logo from "../assets/images/bananashieldslogo.png";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleCloseModal = () => setModalShow(false);

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalShow(true);
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    showModal("Error", "Please enter both email and password.");
    return;
  }

  try {
    setLoading(true);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const uid = userCredential.user.uid;

    const adminRef = doc(db, "admin", uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      showModal("Access Denied", "You are not an admin.");
      return
    }

    showModal("Success", "Login successful!");

    if (onLogin) onLogin();

  } catch (error) {
    console.error("Login error:", error);
    showModal("Error", error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1f6b3b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4} className="mx-auto">
            <Card
              className="p-4 p-md-5"
              style={{
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                backgroundColor: "#d7f2d6",
                border: "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <img
                  src={logo}
                  alt="BananaShield logo"
                  style={{ width: "88px", height: "88px", objectFit: "contain" }}
                />
              </div>

              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "38px",
                    marginBottom: "4px",
                    color: "#165233",
                  }}
                >
                  BananaShield
                </h2>
                <p style={{ margin: 0, color: "#6f7d75", fontSize: "14px" }}>
                  Sign in to access the admin dashboard
                </p>
              </div>

              <Form className="text-start" onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Form>

              <div className="text-center small text-muted mt-4">
                © 2025 BananaShield. All rights reserved.
              </div>
            </Card>
          </Col>
        </Row>

        <Modal show={modalShow} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleCloseModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Login;

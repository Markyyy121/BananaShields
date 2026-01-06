// AdminLogin.js
import React, { useState } from "react";
import logo from "../assets/images/bananashieldslogo.png";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
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
  };

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
        return;
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-success">
      <Container fluid className="px-3">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="p-4 p-md-5 shadow border-0 rounded-4 bg-light">
              {/* Logo */}
              <div className="text-center mb-3">
                <img
                  src={logo}
                  alt="BananaShield logo"
                  className="img-fluid"
                  style={{ maxWidth: "88px" }}
                />
              </div>

              {/* Title */}
              <div className="text-center mb-4">
                <h2 className="fw-bold fs-2 fs-md-1 text-success mb-1">
                  BananaShield
                </h2>
                <p className="text-muted small mb-0">
                  Sign in to access the admin dashboard
                </p>
              </div>

              {/* Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4 text-start">
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

              {/* Footer */}
              <div className="text-center text-muted small mt-4">
                © 2025 BananaShield. All rights reserved.
              </div>
            </Card>
          </Col>
        </Row>

        {/* Modal */}
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

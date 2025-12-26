// AdminLogin.js
import React from "react";
import logo from "../assets/images/bananashieldslogo.png";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();          // prevent page reload
    if (onLogin) onLogin();      // trigger UI navigation
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
              {/* Logo */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <img
                  src={logo}
                  alt="BananaShield logo"
                  style={{ width: "88px", height: "88px", objectFit: "contain" }}
                />
              </div>

              {/* Title + subtitle */}
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

              {/* Form */}
              <Form className="text-start" onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label
                    style={{
                      display: "block",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#4b5b52",
                    }}
                  >
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email address"
                    style={{
                      borderRadius: "12px",
                      borderColor: "#d0ddcf",
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label
                    style={{
                      display: "block",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#4b5b52",
                    }}
                  >
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    style={{
                      borderRadius: "12px",
                      borderColor: "#d0ddcf",
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  style={{
                    borderRadius: "999px",
                    padding: "10px 0",
                    fontWeight: 600,
                    backgroundColor: "#0d4b2b",
                    borderColor: "#0d4b2b",
                  }}
                >
                  Sign In
                </Button>
              </Form>

              {/* Footer text */}
              <div className="text-center small text-muted mt-4">
                © 2025 BananaShield. All rights reserved.
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;

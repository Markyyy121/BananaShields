import React from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaPercent, FaLeaf, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { GiBanana } from "react-icons/gi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SideNav from "../components/sidenav";
import "../css/AdminDashboard.css";

const AdminReportDetails = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fromUserId = query.get("userId");

  const report = {
    id: reportId || "R1",
    disease: "Panama Disease (Fusarium Wilt)",
    confidence: 94.5,
    crop: "Saba Banana",
    location: "Davao City, Philippines",
    scanDate: "Oct 20, 2024",
    scanTime: "09:45 AM",
    symptoms: ["Yellowing of leaves", "Wilting of lower leaves", "Vascular discoloration"],
    submittedBy: { name: "Juan Dela Cruz", email: "juan.delacruz@email.com", id: "#001", role: "Farmer", joined: "Jan 15, 2024" },
  };

  return (
    <div className="d-flex admin-page" style={{ minHeight: "100vh" }}>
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container" style={{ backgroundColor: "#EDF7ED", padding: "0  24px 24px" }}>

          {/* Header */}
          <Card className="border-0 mb-4" style={{ backgroundColor: "#E8F5E9", borderRadius: 12 }}>
              <Card.Body style={{ padding: 0 }}>
              <h3 className="admin-title" style={{ marginTop: 0 }}><span className="admin-title-badge">Report Details</span></h3>

              <div className="text-start">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (fromUserId) { navigate(`/users/${fromUserId}`); } else { navigate(-1); } }}
                  style={{ color: "#6B7280", fontSize: 14, textDecoration: "none", display: "inline-block", marginBottom: 8 }}
                >
                  <FaArrowLeft className="me-2" /> Back to Reports Monitoring
                </a>

                <div style={{ fontSize: 14, color: "#4B5563", fontWeight: 500 }}>Report ID: #{report.id}</div>
              </div>
            </Card.Body>
          </Card>

          {/* Main two-column layout */}
          <Row className="g-4">
            {/* Left column ~70% */}
            <Col lg={8} md={12}>
              {/* Disease Detection Summary */}
              <Card style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 0 }} className="mb-4">
                <Card.Body style={{ padding: 32 }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", margin: 0 }}>Disease Detection Summary</h3>
                    <div>
                      <Badge style={{ backgroundColor: "#D1FAE5", color: "#047857", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 12 }}>
                        <FaCheckCircle className="me-1" /> ✓ Confirmed
                      </Badge>
                      <Badge style={{ backgroundColor: "#FEE2E2", color: "#DC2626", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 12, marginLeft: 8 }} className="ms-2">
                        <FaExclamationTriangle className="me-1" /> ⚠ Critical Severity
                      </Badge>
                    </div>
                  </div>

                  {/* Info grid 2x3 */}
                  <Row className="g-3">
                    <Col md={6}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", borderRadius: 8, padding: 16, background: "#FEE2E2" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", fontSize: 20 }}>
                          <FaExclamationTriangle />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Disease Detected</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>🔴 {report.disease}</div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", borderRadius: 8, padding: 16, background: "#DBEAFE" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6", fontSize: 18 }}>
                          <FaPercent />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Confidence Level</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>{report.confidence}%</div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", borderRadius: 8, padding: 16, background: "#ECFDF5" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", fontSize: 18 }}>
                          <FaLeaf />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Crop Type</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{report.crop}</div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", borderRadius: 8, padding: 16, background: "#FEE2E2" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", fontSize: 18 }}>
                          <FaMapMarkerAlt />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Location</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{report.location}</div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", borderRadius: 8, padding: 16, background: "#F3F4F6" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", fontSize: 18 }}>
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Scan Date & Time</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{report.scanDate}</div>
                          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{report.scanTime}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Observed Symptoms */}
                  <div style={{ marginTop: 32 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", marginBottom: 12 }}>Observed Symptoms</h4>
                    <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
                      {report.symptoms.map((s, i) => (
                        <li key={i} style={{ color: "#374151", fontSize: 14, marginBottom: 6 }}> <span style={{ color: "#EF4444", marginRight: 8 }}>•</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                </Card.Body>
              </Card>

              {/* Visual Inspection */}
              <Card style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 0 }} className="mb-4">
                <Card.Body style={{ padding: 32 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", marginBottom: 16 }}>Visual Inspection</h3>
                  <div style={{ background: "#F3F4F6", borderRadius: 12, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 100, height: 100, borderRadius: 50, background: "#FDB71A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <GiBanana style={{ color: "#000", fontSize: 40 }} />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Treatment Recommendation */}
              <Card style={{ background: "#CCFBF1", borderRadius: 12, padding: 0, borderLeft: "4px solid #10B981" }} className="mb-4">
                <Card.Body style={{ padding: 24 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 40, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: "#0F766E", marginBottom: 12 }}>Treatment Recommendation</h4>
                      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>Immediate isolation of affected plants. Remove and destroy infected plants. Apply soil fumigation in affected areas. Plant resistant varieties like GCTCV-218.</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Right column ~30% */}
            <Col lg={4} md={12}>
              <div style={{ position: "sticky", top: 24 }}>
                <Card style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 0 }}>
                  <Card.Body style={{ padding: 24, textAlign: "center" }}>
                    <h5 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", marginBottom: 20 }}>Submitted By</h5>
                    <div style={{ width: 80, height: 80, borderRadius: 40, background: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, margin: "0 auto 16px" }}>JD</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>{report.submittedBy.name}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>{report.submittedBy.email}</div>
                    <Badge style={{ backgroundColor: "#FDE68A", color: "#92400E", fontSize: 12, fontWeight: 600, padding: "6px 16px", borderRadius: 16, marginBottom: 24 }}>Farmer</Badge>

                    <div style={{ textAlign: "left", marginTop: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                        <div style={{ color: "#6B7280", fontSize: 13 }}>User ID:</div>
                        <div style={{ color: "#374151", fontSize: 13 }}>{report.submittedBy.id}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6", alignItems: "center" }}>
                        <div style={{ color: "#6B7280", fontSize: 13 }}>Status:</div>
                        <div><Badge style={{ backgroundColor: "#D1FAE5", color: "#065F46", padding: "4px 8px", borderRadius: 8 }}>Active</Badge></div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                        <div style={{ color: "#6B7280", fontSize: 13 }}>Joined:</div>
                        <div style={{ color: "#374151", fontSize: 13 }}>{report.submittedBy.joined}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>

        </div>
      </div>
    </div>
  );
};

export default AdminReportDetails;

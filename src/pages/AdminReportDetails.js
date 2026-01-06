import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPercent,
  FaLeaf,
  FaExclamationTriangle
} from "react-icons/fa";
import { GiBanana } from "react-icons/gi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SideNav from "../components/sidenav";

// Firebase
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const getInitials = (name) => {
  if (!name) return "NA";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const AdminReportDetails = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const location = useLocation();
  const from = location.state?.from;
  const userId = location.state?.userId;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const ref = doc(db, "scan_history", reportId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          const createdAt = data.createdAt?.toDate();

          setReport({
            id: snap.id,
            disease: data.diseaseName || "N/A",
            crop: data.diseaseType || "N/A",
            confidence: data.confidenceLevel ?? 0,
            location: data.location || "N/A",
            scanDate: createdAt ? createdAt.toLocaleDateString() : "N/A",
            scanTime: createdAt ? createdAt.toLocaleTimeString() : "N/A",
            imageUrl: data.imageUrl || "",
            symptoms: data.symptoms || [],
            treatmentSteps: (data.treatmentSteps || []).map(step => step.description),
            submittedBy: {
              name: data.userName || "Unknown",
              email: data.userEmail || "N/A",
              id: data.userId || "N/A",
              joined: "N/A",
              profileImageUrl: data.userProfileImageUrl || null
            }
          });
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidenav">
        <SideNav />
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Spinner animation="border" variant="success" />
          </div>
        ) : (
          <div className="admin-main-container">

            {/* Header */}
            <Card className="border-0 mb-4" style={{ backgroundColor: "#E8F5E9", borderRadius: 12 }}>
              <Card.Body style={{ padding: 0 }}>
                <h3 className="admin-title">
                  <span className="admin-title-badge">Report Details</span>
                </h3>

                <div className="text-start">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (from === "reports") navigate("/reports");
                      else if (from === "user" && userId) navigate(`/users/${userId}`);
                      else navigate(-1);
                    }}
                    style={{ color: "#6B7280", fontSize: 14, textDecoration: "none" }}
                  >
                    <FaArrowLeft className="me-2" /> Back
                  </a>

                  <div style={{ fontSize: 14, color: "#4B5563", fontWeight: 500 }}>
                    Report ID: #{report.id}
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Row className="g-4">
              {/* LEFT */}
              <Col xs={12} lg={8}>
                {/* Disease Detection Summary */}
                <Card className="mb-4">
                  <Card.Body style={{ padding: 32 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", marginBottom: 16 }}>Disease Detection Summary</h3>

                    <Row className="g-3 text-start">
                      <Col xs={12} md={6}>
                        <div className="d-flex gap-3 p-3 bg-danger-subtle rounded align-items-center">
                          <FaExclamationTriangle />
                          <div>
                            <div className="text-muted small">Disease Name</div>
                            <div>🔴 {report.disease}</div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} md={6}>
                        <div className="d-flex gap-3 p-3 bg-primary-subtle rounded align-items-center">
                          <FaPercent />
                          <div>
                            <div className="text-muted small">Confidence Level</div>
                            <div>{report.confidence}</div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} md={6}>
                        <div className="d-flex gap-3 p-3 bg-success-subtle rounded align-items-center">
                          <FaLeaf />
                          <div>
                            <div className="text-muted small">Disease Type</div>
                            <div>{report.crop}</div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} md={6}>
                        <div className="d-flex gap-3 p-3 bg-danger-subtle rounded align-items-center">
                          <FaMapMarkerAlt />
                          <div>
                            <div className="text-muted small">Location</div>
                            <div>{report.location}</div>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} md={6}>
                        <div className="d-flex gap-3 p-3 bg-light rounded align-items-center">
                          <FaCalendarAlt />
                          <div>
                            <div className="text-muted small">Scan Date & Time</div>
                            <div>{report.scanDate}</div>
                            <small>{report.scanTime}</small>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Symptoms */}
                    <div className="text-start mt-4">
                      <h4>Observed Symptoms</h4>
                      <ul>
                        {report.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </Card.Body>
                </Card>

                {/* Visual Inspection */}
                <Card className="mb-4">
                  <Card.Body style={{ padding: 32 }}>
                    <h3>Visual Inspection</h3>
                    <div className="d-flex justify-content-center align-items-center" style={{ background: "#F3F4F6", borderRadius: 12, minHeight: 300 }}>
                      {report.imageUrl ? (
                        <img src={report.imageUrl} alt="Scan" style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12 }} />
                      ) : <GiBanana size={60} />}
                    </div>
                  </Card.Body>
                </Card>

                {/* Treatment */}
                <Card className="mb-4">
                  <Card.Body style={{ padding: 24 }}>
                    <h4>Treatment Recommendation</h4>
                    {report.treatmentSteps.map((step, i) => <p key={i}>{step}</p>)}
                  </Card.Body>
                </Card>
              </Col>

              {/* RIGHT */}
              <Col xs={12} lg={4}>
                <Card style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <Card.Body style={{ padding: 24, textAlign: "center" }}>
                    <h5 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", marginBottom: 20 }}>Submitted By</h5>

                    {report.submittedBy.profileImageUrl ? (
                      <img
                        src={report.submittedBy.profileImageUrl}
                        alt="Profile"
                        style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px" }}
                      />
                    ) : (
                      <div style={{ width: 80, height: 80, borderRadius: 40, background: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, margin: "0 auto 16px" }}>
                        {getInitials(report.submittedBy.name)}
                      </div>
                    )}

                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>{report.submittedBy.name}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>{report.submittedBy.email}</div>
                    <Badge style={{ backgroundColor: "#FDE68A", color: "#92400E", fontSize: 12, fontWeight: 600, padding: "6px 16px", borderRadius: 16, marginBottom: 24 }}>Farmer</Badge>

                    <div className="text-start">
                      <div className="d-flex justify-content-between border-bottom py-1">
                        <span style={{ color: "#6B7280", fontSize: 13 }}>User ID:</span>
                        <span style={{ color: "#374151", fontSize: 13 }}>{report.submittedBy.id}</span>
                      </div>
                      <div className="d-flex justify-content-between border-bottom py-1 align-items-center">
                        <span style={{ color: "#6B7280", fontSize: 13 }}>Status:</span>
                        <Badge style={{ backgroundColor: "#D1FAE5", color: "#065F46", padding: "4px 8px", borderRadius: 8 }}>Active</Badge>
                      </div>
                      <div className="d-flex justify-content-between border-bottom py-1">
                        <span style={{ color: "#6B7280", fontSize: 13 }}>Joined:</span>
                        <span style={{ color: "#374151", fontSize: 13 }}>{report.submittedBy.joined}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReportDetails;

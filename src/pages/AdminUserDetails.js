
import { Card, Row, Col, Table, Button } from "react-bootstrap";
import {
  FaArrowLeft,
  FaEnvelope,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import SideNav from "../components/sidenav";
import "../css/AdminUserDetails.module.css"; // import new CSS
import "../css/AdminDashboard.css";
import { Eye } from "react-bootstrap-icons";

const AdminUserDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const reports = [
    { disease: "Panama Disease (Fusarium Wilt)", crop: "Cavendish Banana", location: "Davao City, Philippines", confidence: 94.5, scanDate: "Oct 20, 2024", status: "Confirmed" },
    { disease: "Black Sigatoka", crop: "Cavendish Banana", location: "Davao City, Philippines", confidence: 89.2, scanDate: "Oct 18, 2024", status: "Confirmed" },
    { disease: "Banana Bunchy Top Virus", crop: "Saba Banana", location: "Davao City, Philippines", confidence: 76.8, scanDate: "Oct 15, 2024", status: "Under Review" },
    { disease: "Healthy Plant", crop: "Lakatan Banana", location: "Davao City, Philippines", confidence: 91.3, scanDate: "Oct 10, 2024", status: "Confirmed" }
  ];

  return (
    <div className="d-flex admin-page" style={{ minHeight: "100vh" }}>
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container" style={{ backgroundColor: "#EDF7ED" }}>
        {/* Header */}
        <Card className="border-0 mb-4 px-2" style={{ backgroundColor: "#E8F5E9", paddingTop: 0 }}>
          <Card.Body className="d-flex flex-column align-items-start" style={{ paddingTop: 0 }}>
          <h3 className="admin-title">
            <span className="admin-title-badge">User Details</span>
          </h3>
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate("/users"); }}
                className="d-inline-flex align-items-center"
                style={{ color: "#6B7280", fontSize: "14px", textDecoration: "none" }}
            >
                <FaArrowLeft className="me-2" /> Back to User Management
            </a>
            </Card.Body>
        </Card>

        {/* Content aligned with title */}
        <div className="admin-content p-4">
          {/* User Profile */}
            <Row className="mb-4">
              <Col xs={12} lg={6}>
                <Card className="border-0">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={12} md="auto" className="text-center mb-3 mb-md-0">
                        <div
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            backgroundColor: "#4CAF50",
                            color: "#FFFFFF",
                            fontSize: "48px",
                            fontWeight: 600,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            letterSpacing: "1px"
                          }}
                        >
                          JD
                        </div>
                      </Col>

                      <Col>
                        <div className="text-start">
                          <h2 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "4px" }}>
                            Juan Dela Cruz
                          </h2>
                          <small style={{ color: "#718096" }}>ID: 001_farmer</small>
                        </div>

                        <Row className="mt-4 g-3 text-start">
                          {[
                            { icon: <FaEnvelope />, label: "Email", value: "juan.delacruz@email.com", bg: "#FEF3C7", iconColor: "#92400E" },
                            { icon: <FaCalendarAlt />, label: "Joined", value: "Jan 15, 2024", bg: "#FED7AA", iconColor: "#C2410C" },
                            { icon: <FaUser />, label: "Role", value: "Farmer", bg: "#FFEDD5", iconColor: "#B45309" },
                            { icon: <FaCheckCircle />, label: "Status", value: "Active", bg: "#FEF9C3", iconColor: "#065F46" }
                          ].map((item, index) => (
                            <Col xs={12} md={6} key={index}>
                              <div className="d-flex align-items-center">
                                <div
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    backgroundColor: item.bg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: item.iconColor
                                  }}
                                >
                                  {item.icon}
                                </div>
                                <div className="ms-3">
                                  <div style={{ fontSize: "12px", color: "#6B7280" }}>{item.label}</div>
                                  <div style={{ fontSize: "14px", fontWeight: 600 }}>{item.value}</div>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

          {/* Scanned Reports */}
          <Card className="shadow-sm border-0 rounded p-3 p-md-4">
            <Card.Body>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1F2937", marginBottom: "6px" }}>Scanned Reports</h2>
              <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "24px" }}>5 reports submitted by this user</p>

              <div className="table-responsive">
                <Table hover className="align-middle" style={{ border: "1px solid #E5E7EB", borderRadius: "8px", overflow: "hidden" }}>
                  <thead style={{ backgroundColor: "#F9FAFB" }}>
                    <tr className="text-start">
                      {["Disease Detected", "Crop Type", "Location", "Confidence", "Scan Date", "Actions"].map((col, i) => (
                        <th key={i} style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", padding: "16px 20px" }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((row, index) => {
                      const confidenceColor = row.confidence >= 90 ? "#10B981" : row.confidence >= 75 ? "#F59E0B" : "#EAB308";
                      const dotColor = row.disease === "Healthy Plant" ? "#10B981" : "#EF4444";
                      return (
                        <tr className="text-start" key={index} style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "20px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: dotColor, display: "inline-block", marginRight: "12px" }}></span>{row.disease}</td>
                          <td style={{ fontSize: "14px", color: "#374151", fontWeight: 400 }}>{row.crop}</td>
                          <td style={{ fontSize: "14px", color: "#374151" }}><FaMapMarkerAlt className="me-1" style={{ color: "#EF4444", fontSize: "14px", marginRight: "8px" }} />{row.location}</td>
                          <td style={{ fontSize: "15px", fontWeight: 700, color: confidenceColor }}>{row.confidence}%</td>
                          <td style={{ fontSize: "14px", color: "#6B7280", fontWeight: 400 }}>{row.scanDate}</td>
                          <td className="text-start">
                            <Button variant="light" className="btn-action" onClick={() => navigate(`/reports/R${index+1}?userId=${encodeURIComponent(userId || '')}`)}>
                              <Eye />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminUserDetails;

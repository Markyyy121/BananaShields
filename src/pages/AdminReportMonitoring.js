import React, { useState, useMemo } from "react";
import SideNav from "../components/sidenav";
import { Row, Col, Card, Form, InputGroup, Table, Button, Badge, Dropdown } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "../css/UserManagement.css";
import "../css/AdminDashboard.css";
import "../css/AdminReportMonitoring.module.css";

const sampleReports = [
  { id: "R1", crop: "Cavendish Banana", user: { name: "Juan Dela Cruz", initials: "JD" }, disease: "Panama Disease (Fusarium Wilt)", location: "Davao City, Philippines", confidence: 94.5, severity: "Critical", date: "Oct 20, 2024, 09:45 AM", status: "Confirmed" },
  { id: "R2", crop: "Cavendish Banana", user: { name: "Juan Dela Cruz", initials: "JD" }, disease: "Black Sigatoka", location: "Davao City, Philippines", confidence: 89.2, severity: "High", date: "Oct 18, 2024, 02:15 PM", status: "Confirmed" },
  { id: "R3", crop: "Saba Banana", user: { name: "Juan Dela Cruz", initials: "JD" }, disease: "Banana Bunchy Top Virus", location: "Davao City, Philippines", confidence: 76.8, severity: "Medium", date: "Oct 15, 2024, 11:30 AM", status: "Under Review" },
  { id: "R4", crop: "Lakatan Banana", user: { name: "Juan Dela Cruz", initials: "JD" }, disease: "Healthy Plant", location: "Davao City, Philippines", confidence: 91.3, severity: "Low", date: "Oct 10, 2024, 08:20 AM", status: "Confirmed" },
  { id: "R5", crop: "Cavendish Banana", user: { name: "Juan Dela Cruz", initials: "JD" }, disease: "Leaf Spot", location: "Davao City, Philippines", confidence: 68.5, severity: "Low", date: "Oct 05, 2024, 03:45 PM", status: "False Positive" },
  { id: "R6", crop: "Cavendish Banana", user: { name: "Roberto Cruz", initials: "RC" }, disease: "Panama Disease (Fusarium Wilt)", location: "Bukidnon, Philippines", confidence: 92.1, severity: "Critical", date: "Oct 22, 2024, 10:15 AM", status: "Confirmed" },
  { id: "R7", crop: "Cavendish Banana", user: { name: "Roberto Cruz", initials: "RC" }, disease: "Black Sigatoka", location: "Bukidnon, Philippines", confidence: 87.4, severity: "Medium", date: "Oct 19, 2024, 01:30 PM", status: "Confirmed" },
];

const severityBadge = (s) => {
  switch (s) {
    case "Critical": return <Badge style={{ backgroundColor: "#FEE2E2", color: "#DC2626", fontWeight: 700 }}>Critical</Badge>;
    case "High": return <Badge style={{ backgroundColor: "#FFF4E6", color: "#F97316", fontWeight: 700 }}>High</Badge>;
    case "Medium": return <Badge style={{ backgroundColor: "#FEF9C3", color: "#B45309", fontWeight: 700 }}>Medium</Badge>;
    case "Low": return <Badge style={{ backgroundColor: "#EFF6FF", color: "#2563EB", fontWeight: 700 }}>Low</Badge>;
    default: return <Badge bg="secondary">N/A</Badge>;
  }
};

const statusBadge = (s) => {
  if (s === "Confirmed") return <span style={{ color: "#047857", fontWeight: 700 }}>✓ Confirmed</span>;
  if (s === "Under Review") return <span style={{ color: "#B45309", fontWeight: 700 }}>⚠ Under Review</span>;
  if (s === "False Positive") return <span style={{ color: "#DC2626", fontWeight: 700 }}>✗ False Positive</span>;
  return s;
};

const AdminReportMonitoring = () => {
  const [query, setQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("Last 30 Days");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query) return sampleReports;
    const q = query.toLowerCase();
    return sampleReports.filter(r => (
      r.id.toLowerCase().includes(q) ||
      r.user.name.toLowerCase().includes(q) ||
      r.disease.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    ));
  }, [query]);

  return (
    <div className="admin-page">
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container arm-container">
          <div className="d-flex align-items-center justify-content-between mb-3 arm-header">
            <h3 className="admin-title"><span className="admin-title-badge">Reports Monitoring</span></h3>
          </div>

          {/* Summary cards */}
          <Row className="mb-3">
            <Col md={6} lg={4} className="mb-3">
              <Card className="metric-card">
                <div className="metric-icon">📄</div>
                <div>
                  <div className="metric-value">156</div>
                  <small>Total Reports</small>
                </div>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-3">
              <Card className="metric-card">
                <div className="metric-icon">✓</div>
                <div>
                  <div className="metric-value">98</div>
                  <small>Confirmed</small>
                </div>
              </Card>
            </Col> 
            <Col md={6} lg={4} className="mb-3">
              <Card className="metric-card">
                <div className="metric-icon">⚠</div>
                <div>
                  <div className="metric-value">42</div>
                  <small>Under Review</small>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Search */}
          <Row className="mb-3">
            <Col xs={12} md={6} lg={4}>
              <InputGroup>
                <InputGroup.Text style={{ background: '#fff' }}>🔍</InputGroup.Text>
                <Form.Control placeholder="Search by disease, user, location..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>

          {/* Data table */}
          <Card className="um-table-card">
            <div className="table-responsive um-table-wrap">
              <Table hover className="um-table">
                <thead className="um-table-head">
                  <tr>
                    {['REPORT ID', 'SUBMITTED BY', 'DISEASE DETECTED', 'CONFIDENCE', 'SEVERITY', 'SCAN DATE', 'STATUS', 'ACTIONS'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} style={{ cursor: 'pointer' }}>
                      <td>{r.id} · {r.crop}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 18, background: '#10B981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{r.user.initials}</div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{r.user.name}</div>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>Farmer</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div><span style={{ width: 8, height: 8, display: 'inline-block', borderRadius: 8, background: r.disease === 'Healthy Plant' ? '#10B981' : '#EF4444', marginRight: 8 }}></span>{r.disease}<div style={{ fontSize: 12, color: '#6B7280' }}>{r.location}</div></div>
                      </td>
                      <td style={{ color: r.confidence >= 90 ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{r.confidence}%</td>
                      <td>{severityBadge(r.severity)}</td>
                      <td style={{ fontSize: 13, color: '#6B7280' }}>{r.date}</td>
                      <td>{statusBadge(r.status)}</td>
                      <td>
                        <Button variant="light" onClick={() => navigate(`/reports/${r.id}`)} className="btn-action"><Eye /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AdminReportMonitoring;

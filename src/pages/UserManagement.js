// src/pages/UserManagement.js
import React, { useState, useMemo } from "react";
import SideNav from "../components/sidenav";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Table,
  Badge,
  Button,
} from "react-bootstrap";
import { Search, Eye } from "react-bootstrap-icons";
import "../css/UserManagement.css";
import "../css/AdminDashboard.css";

const MOCK_TOTAL = 1247; // used only for pagination summary display

const sampleUsers = [
  { id: "USR-001247", name: "Juan Dela Cruz", initials: "JD", email: "juan@farm.ph", role: "Farmer", joined: "Jan 15, 2024", color: "green" },
  { id: "USR-001248", name: "Maria Santos", initials: "MS", email: "maria@farm.ph", role: "Farmer", joined: "Feb 02, 2024", color: "gold" },
  { id: "USR-001249", name: "Rico Cruz", initials: "RC", email: "rico@farm.ph", role: "Expert", joined: "Mar 22, 2024", color: "blue" },
  { id: "USR-001250", name: "Ana Lopez", initials: "AL", email: "ana@farm.ph", role: "Farmer", joined: "Apr 10, 2024", color: "green" },
  { id: "USR-001251", name: "Paolo Mendoza", initials: "PM", email: "paolo@farm.ph", role: "Admin", joined: "May 05, 2024", color: "purple" },
  { id: "USR-001252", name: "Trisha Reyes", initials: "TR", email: "trisha@farm.ph", role: "Expert", joined: "Jun 12, 2024", color: "blue" },
  { id: "USR-001253", name: "Miguel Garcia", initials: "MG", email: "miguel@farm.ph", role: "Farmer", joined: "Jul 21, 2024", color: "green" },
  { id: "USR-001254", name: "Liza Torres", initials: "LT", email: "liza@farm.ph", role: "Farmer", joined: "Aug 11, 2024", color: "gold" },
];

const roleBadgeVariant = (role) => {
  switch (role) {
    case "Farmer":
      return "farmer"; // yellow/gold
    case "Expert":
      return "expert"; // light blue
    case "Admin":
      return "admin"; // light purple
    default:
      return "secondary";
  }
};

const UserManagement = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query) return sampleUsers;
    const q = query.toLowerCase();
    return sampleUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }, [query]);

  const handleView = (user) => {
    // Replace with navigation to user detail or modal
    console.log("View user", user.id);
    alert(`Viewing user: ${user.name} (${user.id})`);
  };

  return (
    <div className="admin-page">
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container">
          <h3 className="admin-title"><span className="admin-title-badge">User Management</span></h3>

          <Row className="mb-1">
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card className="um-stat-card metric-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                  <div className="metric-icon">👨‍🌾</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: "100%" }}>
                    <h4 className="metric-value">25</h4>
                    <small>Active Farmers</small>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xs={12} md={6} lg={4}>
              <InputGroup className="um-search">
                <InputGroup.Text id="search-addon" className="search-icon">
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users by name or by email...."
                  aria-label="Search users"
                  aria-describedby="search-addon"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row> 

          <Row>
            <Col xs={12}>
              <Card className="um-table-card">
                <div className="table-responsive um-table-wrap">
                  <Table hover borderless className="um-table" aria-label="User table">
                    <thead className="um-table-head">
                      <tr>
                        <th>USER</th>
                        <th>EMAIL</th>
                        <th>JOINED</th>
                        <th className="text-end">ACTIONS</th>
                      </tr>
                    </thead> 
                    <tbody>
                      {filtered.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div className="user-cell">
                              <div className={`avatar ${u.color}`} aria-hidden="true">{u.initials}</div>
                              <div className="user-meta">
                                <div className="user-name">{u.name}</div>
                                <div className="user-id">ID: {u.id}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="text-muted">{u.email}</div>
                          </td>

                          <td>{u.joined}</td>

                          <td className="text-end">
                            <Button variant="light" className="btn-action" aria-label={`View ${u.name}`} onClick={() => handleView(u)}>
                              <Eye />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="um-table-footer">
                  <div className="results-text">Showing 1-8 of {MOCK_TOTAL.toLocaleString()} users</div>
                  <div className="pagination-controls">
                    <Button variant="light" className="page-btn">&lt;</Button>
                    <Button variant="light" className="page-btn active">1</Button>
                    <Button variant="light" className="page-btn">2</Button>
                    <Button variant="light" className="page-btn">3</Button>
                    <Button variant="light" className="page-btn">&gt;</Button>
                  </div>
                </div>

              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

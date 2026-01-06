import React, { useEffect, useMemo, useState } from "react";
import SideNav from "../components/sidenav";
import {
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Table,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

// Firebase
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

const REPORTS_PER_PAGE = 7;

const severityBadge = (s) => (
  <Badge bg="transparent" text="dark">
    {s || "N/A"}
  </Badge>
);

const AdminReportMonitoring = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "scan_history"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            userName: d.userName || "Unknown",
            userId: d.userId || null,
            diseaseName: d.diseaseName || "N/A",
            confidence: d.confidenceLevel ?? 0,
            severity: d.severity || "N/A",
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
          };
        });

        setReports(data);
      } catch (err) {
        console.error("Fetch reports error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Search filter
  const filteredReports = useMemo(() => {
    if (!search) return reports;
    const q = search.toLowerCase();
    return reports.filter(
      (r) =>
        r.userName.toLowerCase().includes(q) ||
        r.diseaseName.toLowerCase().includes(q)
    );
  }, [reports, search]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
    return filteredReports.slice(startIndex, startIndex + REPORTS_PER_PAGE);
  }, [filteredReports, currentPage]);

  // Page buttons (max 3 visible + ellipsis)
  const getPageButtons = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, "…", totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, "…", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "…", currentPage, "…", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidenav">
        <SideNav />
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-main-container arm-container">

          {/* HEADER */}
          <h3 className="admin-title mb-3">
            <span className="admin-title-badge">Reports Monitoring</span>
          </h3>

          {/* METRICS */}
          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Card className="metric-card">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="metric-icon">📄</div>
                  <div style={{ marginLeft: 10 }}>
                    <h4 className="metric-value">
                      {loading ? <Spinner animation="border" size="sm" /> : filteredReports.length}
                    </h4>
                    <small>Total Reports</small>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* SEARCH */}
          <Row className="mb-3">
            <Col xs={12} md={4}>
              <InputGroup className="mb-3">
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Search user or disease..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* TABLE */}
          <Row>
            <Col xs={12}>
              <Card className="um-table-card">
                <div className="table-responsive">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="success" />
                    </div>
                  ) : (
                    <Table hover borderless className="um-table text-center">
                      <thead className="um-table-head">
                        <tr>
                          <th>SUBMITTED BY</th>
                          <th>DISEASE</th>
                          <th>CONFIDENCE</th>
                          <th>SEVERITY</th>
                          <th>SCAN DATE</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedReports.length > 0 ? (
                          paginatedReports.map((r) => (
                            <tr key={r.id}>
                              <td>{r.userName}</td>
                              <td>{r.diseaseName}</td>
                              <td style={{ fontWeight: 700 }}>{r.confidence}</td>
                              <td>{severityBadge(r.severity)}</td>
                              <td>{r.createdAt ? r.createdAt.toLocaleDateString() : "N/A"}</td>
                              <td>
                                <Button
                                  variant="light"
                                  className="btn-action"
                                  onClick={() =>
                                    navigate(`/reports/${r.id}`, { state: { from: "reports", userId: r.userId } })
                                  }
                                >
                                  <Eye />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
                    <div className="mb-2 mb-md-0">
                      Showing {paginatedReports.length} of {filteredReports.length} reports
                    </div>
                    <div className="pagination-controls">
                      <Button
                        variant="light"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="me-1"
                      >
                        &lt;
                      </Button>

                      {getPageButtons().map((p, idx) =>
                        p === "…" ? (
                          <span key={idx} className="mx-1">…</span>
                        ) : (
                          <Button
                            key={idx}
                            variant={currentPage === p ? "primary" : "light"}
                            onClick={() => setCurrentPage(p)}
                            className="mx-1"
                          >
                            {p}
                          </Button>
                        )
                      )}

                      <Button
                        variant="light"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="ms-1"
                      >
                        &gt;
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

        </div>
      </main>
    </div>
  );
};

export default AdminReportMonitoring;

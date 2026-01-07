import React, { useEffect, useState, useMemo } from "react";
import { Card, Table, Button, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import SideNav from "../components/sidenav";
import "../css/AdminDashboard.css";
import "../css/UserManagement.css";
import { Eye } from "react-bootstrap-icons";

// Firebase
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

const SCANS_PER_PAGE = 8;

const AdminUserDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      try {
        const scansRef = collection(db, "scan_history");
        const q = query(
          scansRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const scansData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            disease: data.diseaseName || "N/A",
            crop: data.diseaseType || "N/A",
            confidence: data.confidenceLevel ?? 0,
            scanDate: data.createdAt
              ? data.createdAt.toDate().toLocaleDateString()
              : "N/A",
          };
        });

        setReports(scansData);
      } catch (err) {
        console.error("Error fetching scan history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [userId]);

  const totalPages = Math.ceil(reports.length / SCANS_PER_PAGE);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * SCANS_PER_PAGE;
    return reports.slice(startIndex, startIndex + SCANS_PER_PAGE);
  }, [reports, currentPage]);

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
      <aside className="admin-sidenav">
        <SideNav />
      </aside>

      <main className="admin-main">
        <div className="admin-main-container">
          <div className="mb-4">
            <h3 className="admin-title mb-2">
              <span className="admin-title-badge">User Details</span>
            </h3>

            <div className="text-start">
              <Button
                variant="link"
                onClick={() => navigate("/users")}
                className="p-0 back-btn text-decoration-none text-secondary"
              >
                <FaArrowLeft className="me-2" /> Back
              </Button>
            </div>
          </div>

          <Card className="um-table-card shadow-sm border-0">
            <Card.Body>
              <h4 className="mb-1 text-start">Scanned Reports</h4>
              <p className="text-muted mb-3 text-start" style={{ fontSize: "14px" }}>
                {loading
                  ? "Loading..."
                  : `${reports.length} reports submitted by this user`}
              </p>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover className="align-middle text-center">
                      <thead
                        className="um-table-head text-center"
                        style={{ textTransform: "uppercase", fontSize: "13px" }}
                      >
                        <tr>
                          {[
                            "Disease Name",
                            "Disease Type",
                            "Confidence",
                            "Scan Date",
                            "Actions",
                          ].map((col, i) => (
                            <th key={i}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedReports.length > 0 ? (
                          paginatedReports.map((row) => {
                            const confidenceColor =
                              row.confidence >= 90
                                ? "#10B981"
                                : row.confidence >= 75
                                ? "#F59E0B"
                                : "#EAB308";

                            const dotColor =
                              row.disease === "Healthy Plant"
                                ? "#10B981"
                                : "#EF4444";

                            return (
                              <tr key={row.id}>
                                <td className="text-center">
                                  <span
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "50%",
                                      backgroundColor: dotColor,
                                      display: "inline-block",
                                      marginRight: "8px",
                                    }}
                                  ></span>
                                  {row.disease}
                                </td>
                                <td>{row.crop}</td>
                                <td style={{ fontWeight: 700, color: confidenceColor }}>
                                  {row.confidence}%
                                </td>
                                <td>{row.scanDate}</td>
                                <td>
                                  <Button
                                    variant="light"
                                    className="btn-action"
                                    onClick={() =>
                                      navigate(`/reports/${row.id}`, {
                                        state: { from: "user", userId },
                                      })
                                    }
                                  >
                                    <Eye />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                              No scan records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="d-flex flex-wrap justify-content-end align-items-center mt-3">
                      <Button
                        variant="light"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="me-1 mb-1"
                      >
                        &lt;
                      </Button>

                      {getPageButtons().map((p, idx) =>
                        p === "…" ? (
                          <span key={idx} className="mx-1 mb-1">
                            …
                          </span>
                        ) : (
                          <Button
                            key={idx}
                            variant={currentPage === p ? "primary" : "light"}
                            onClick={() => setCurrentPage(p)}
                            className="mx-1 mb-1"
                          >
                            {p}
                          </Button>
                        )
                      )}

                      <Button
                        variant="light"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="ms-1 mb-1"
                      >
                        &gt;
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminUserDetails;

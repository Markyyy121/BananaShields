import React, { useState, useEffect, useMemo } from "react";
import SideNav from "../components/sidenav";
import {
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Table,
  Button,
  Spinner,
} from "react-bootstrap";
import { Search, Eye } from "react-bootstrap-icons";
import "../css/UserManagement.css";
import "../css/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

const USERS_PER_PAGE = 7;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const usersData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

          let joinedDate = "N/A";
          if (data.createdAt) {
            if (typeof data.createdAt.toDate === "function") {
              joinedDate = data.createdAt.toDate().toLocaleDateString();
            } else if (typeof data.createdAt === "number") {
              joinedDate = new Date(data.createdAt).toLocaleDateString();
            }
          }

          return {
            id: doc.id,
            fullName: fullName || "N/A",
            email: data.email || "N/A",
            phone: data.phone || "N/A",
            farmSize: data.farmSize || "N/A",
            createdAt: joinedDate,
          };
        });

        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!queryText) return users;
    const q = queryText.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
    );
  }, [users, queryText]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Generate pagination buttons (max 3 visible + ellipsis)
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
          <h3 className="admin-title">
            <span className="admin-title-badge">User Management</span>
          </h3>

          {/* Metric */}
          <Row className="mb-3">
            <Col xs={12} md={6} lg={4}>
              <Card className="metric-card">
                <div className="d-flex align-items-center">
                  <div className="metric-icon">👨‍🌾</div>
                  <div>
                    <h4 className="metric-value mb-0">
                      {loading ? <Spinner size="sm" /> : filteredUsers.length}
                    </h4>
                    <small>Total Users</small>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Search */}
          <Row className="mb-3">
            <Col xs={12} md={6} lg={4}>
              <InputGroup className="um-search">
                <InputGroup.Text className="search-icon">
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users by name, email, or phone..."
                  value={queryText}
                  onChange={(e) => {
                    setQueryText(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Table */}
          <Row>
            <Col xs={12}>
              <Card className="um-table-card">
                <div className="table-responsive um-table-wrap">
                  {loading ? (
                    <div className="text-center p-4">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <>
                      <Table hover borderless className="um-table text-center">
                        <thead className="um-table-head">
                          <tr>
                            <th>FULL NAME</th>
                            <th>EMAIL</th>
                            <th>PHONE</th>
                            <th>FARM SIZE</th>
                            <th>JOINED</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedUsers.length ? (
                            paginatedUsers.map((user) => (
                              <tr key={user.id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.farmSize}</td>
                                <td>{user.createdAt}</td>
                                <td>
                                  <Button
                                    variant="light"
                                    className="btn-action"
                                    onClick={() => navigate(`/users/${user.id}`)}
                                  >
                                    <Eye />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-muted">
                                No users found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>

                      {/* ✅ Right-aligned Pagination */}
                      {totalPages > 1 && (
                        <div className="d-flex justify-content-end align-items-center mt-3">
                          <Button
                            variant="light"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                          >
                            &lt;
                          </Button>

                          {getPageButtons().map((p, idx) =>
                            p === "…" ? (
                              <span key={idx} className="mx-1">
                                …
                              </span>
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
                          >
                            &gt;
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;

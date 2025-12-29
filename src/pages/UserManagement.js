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

// Firebase
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

const USERS_PER_PAGE = 7;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch users from Firestore
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
          if (data.createdAt && typeof data.createdAt === "number") {
            joinedDate = new Date(data.createdAt).toLocaleDateString();
          }

          return {
            id: doc.id,
            fullName,
            email: data.email || "",
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

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!queryText) return users;
    const q = queryText.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, queryText]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleView = (user) => {
    navigate(`/users/${user.id}`);
  };

  return (
    <div className="admin-page">
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container">
          <h3 className="admin-title">
            <span className="admin-title-badge">User Management</span>
          </h3>

          <Row className="mb-1">
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card className="um-stat-card metric-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                  <div className="metric-icon">👨‍🌾</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: "100%" }}>
                    <h4 className="metric-value">{loading ? <Spinner animation="border" size="sm" /> :filteredUsers.length}</h4>
                    <small>Total Users</small>
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
                  placeholder="Search users by name or email..."
                  aria-label="Search users"
                  aria-describedby="search-addon"
                  value={queryText}
                  onChange={(e) => {
                    setQueryText(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </InputGroup>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card className="um-table-card">
                <div className="table-responsive um-table-wrap">
                  {loading ? (
                    <div className="text-center p-4">
                      <Spinner animation="border" variant="success" />
                    </div>
                  ) : (
                    <Table hover borderless className="um-table" aria-label="User table">
                      <thead className="um-table-head text-center">
                        <tr>
                          <th>FULL NAME</th>
                          <th>EMAIL</th>
                          <th>JOINED</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                        <tbody>
                          {paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => (
                              <tr key={user.id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.createdAt}</td>
                                <td className="text-center">
                                  <Button
                                    variant="light"
                                    className="btn-action"
                                    onClick={() => handleView(user)}
                                  >
                                    <Eye />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center text-muted">
                                No users found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                    </Table>
                  )}
                </div>

                <div className="um-table-footer d-flex justify-content-between align-items-center">
                  <div className="results-text">
                    Showing {paginatedUsers.length} of {filteredUsers.length} users
                  </div>

                  <div className="pagination-controls">
                    <Button
                      variant="light"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      &lt;
                    </Button>

                    {[...Array(totalPages)].map((_, idx) => (
                      <Button
                        key={idx}
                        variant={currentPage === idx + 1 ? "primary" : "light"}
                        onClick={() => setCurrentPage(idx + 1)}
                        className="mx-1"
                      >
                        {idx + 1}
                      </Button>
                    ))}

                    <Button
                      variant="light"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      &gt;
                    </Button>
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

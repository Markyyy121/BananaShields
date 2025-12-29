// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        const usersData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            createdAt: data.createdAt || null, // timestamp or number
          };
        });

        setUsers(usersData);

        // Prepare monthly registration data
        const monthCounts = Array(12).fill(0); // Jan = 0 ... Dec = 11
        usersData.forEach((u) => {
          if (u.createdAt) {
            const date = new Date(u.createdAt);
            const month = date.getMonth();
            monthCounts[month]++;
          }
        });

        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const chartData = months.map((m, idx) => ({ month: m, count: monthCounts[idx] }));
        setMonthlyRegistrations(chartData);

      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-page">
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container">
          <h3 className="admin-title">
            <span className="admin-title-badge">Admin Dashboard</span>
          </h3>

          <Container fluid className="px-0">
            {/* Metric card */}
            <Row className="mb-4">
              <Col xs={12} md={6} lg={4}>
                <Card className="metric-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                    <div className="metric-icon">👤</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: "100%" }}>
                      <h4 className="metric-value">{loading ? <Spinner animation="border" size="sm" /> : users.length}</h4>
                      <small>Total Users</small>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Analytics section with chart */}
            <Row>
              <Col xs={12}>
                <Card className="analytics-card">
                  <div className="analytics-header">
                    <div>
                      <h5 className="mb-0">System Analytics</h5>
                      <small className="text-muted">Monthly user registrations.</small>
                    </div>
                  </div>

                  <div className="chart-grid single-chart">
                    <div className="chart-panel" style={{ gridColumn: "1 / -1" }}>
                      <div className="panel-title">Monthly Registrations</div>
                      <div className="chart-wrapper">
                        {loading ? (
                          <div className="text-center p-4">
                            <Spinner animation="border" variant="success" />
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyRegistrations}>
                              <CartesianGrid stroke="#eaeaea" strokeDasharray="3 3" />
                              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#0d4b2b" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

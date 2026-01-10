import React, { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import { Row, Col, Card, Spinner } from "react-bootstrap";
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
  const [reports, setReports] = useState([]);
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
            createdAt: data.createdAt || null,
          };
        });

        setUsers(usersData);

        const monthCounts = Array(12).fill(0);
        usersData.forEach((u) => {
          if (u.createdAt) {
            const date = new Date(u.createdAt);
            monthCounts[date.getMonth()]++;
          }
        });

        const months = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

        setMonthlyRegistrations(
          months.map((m, i) => ({ month: m, count: monthCounts[i] }))
        );

        const reportsRef = collection(db, "scan_history");
        const reportsSnapshot = await getDocs(reportsRef);

        const reportsData = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
        }));
        setReports(reportsData);
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
      {/* Sidebar */}
      <aside className="admin-sidenav">
        <SideNav />
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-main-container">
          {/* Title */}
          <h3 className="admin-title">
            <span className="admin-title-badge">Admin Dashboard</span>
          </h3>

          {/* Metrics */}
          <Row className="mb-4">
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card className="metric-card">
                <div className="d-flex align-items-center">
                  <div className="metric-icon">👤</div>
                  <div>
                    <h4 className="metric-value mb-0">
                      {loading ? <Spinner size="sm" /> : users.length}
                    </h4>
                    <small>Total Users</small>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="metric-card">
                <div className="d-flex align-items-center">
                  <div className="metric-icon">📄</div>
                  <div>
                    <h4 className="metric-value mb-0">
                      {loading ? <Spinner size="sm" /> : reports.length}
                    </h4>
                    <small>Total Reports</small>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Analytics */}
          <Row>
            <Col xs={12}>
              <Card className="analytics-card">
                <h5 className="mb-1">System Analytics</h5>
                <small className="text-muted">
                  Monthly user registrations
                </small>

                <div className="chart-grid mt-3">
                  <div className="chart-panel">
                    <div className="panel-title">
                      Monthly Registrations
                    </div>

                    <div className="chart-wrapper">
                      {loading ? (
                        <Spinner />
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={monthlyRegistrations}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                              dataKey="count"
                              fill="#0d4b2b"
                              radius={[6, 6, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

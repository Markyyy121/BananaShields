// src/pages/AdminDashboard.js
import React, { useState } from "react";
import SideNav from "../components/sidenav";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import { BoxArrowRight } from "react-bootstrap-icons";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../css/AdminDashboard.css";

const monthlyRegistrations = [
  { month: "Jan", count: 20 },
  { month: "Feb", count: 24 },
  { month: "Mar", count: 18 },
  { month: "Apr", count: 30 },
  { month: "May", count: 28 },
  { month: "Jun", count: 35 },
];

const AdminDashboard = () => {
  return (
    <div className="admin-page">
      <SideNav />

      <div className="admin-main">
        <div className="admin-main-container">
          <h3 className="admin-title"><span className="admin-title-badge">Admin Dashboard</span></h3>

          <Container fluid className="px-0">
            {/* Metric card */}
            <Row className="mb-4">
              <Col xs={12} md={6} lg={4}>
                <Card className="metric-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                    <div className="metric-icon">👤</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: "100%" }}>
                      <h4 className="metric-value">50</h4>
                      <small>Total Users</small>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Analytics section with multiple charts */}
            <Row>
              <Col xs={12}>
                <Card className="analytics-card">
                  <div className="analytics-header">
                    <div>
                      <h5 className="mb-0">System Analytics</h5>
                      <small className="text-muted">Overall system and user metrics — trends and distributions.</small>
                    </div>
                  </div>

                  <div className="chart-grid single-chart">
                    <div className="chart-panel" style={{ gridColumn: "1 / -1" }}>
                      <div className="panel-title">Monthly Registrations</div>
                      <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={monthlyRegistrations}>
                            <CartesianGrid stroke="#eaeaea" strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0d4b2b" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
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

import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Button, Modal, Form, Pagination } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import SideNav from "../components/sidenav";
import "../css/AdminDashboard.css";
import "../css/Feedback.module.css";

const feedbacks = [
  {
    id: "F1",
    initials: "JD",
    name: "Juan Dela Cruz",
    meta: "Farmer • Davao Region",
    time: "Oct 25, 2025 • 3:45 PM",
    rating: 5,
    text: "The new camera feature for disease detection is amazing! Very easy to use and accurate.",
    avatarColor: "#4CAF50",
  },
  {
    id: "F2",
    initials: "MS",
    name: "Maria Santos",
    meta: "Farmer • Mindanao",
    time: "Oct 24, 2025 • 11:20 AM",
    rating: 4,
    text: "Good app but sometimes loads slowly. Could you improve the loading speed?",
    avatarColor: "#FF9800",
  },
  {
    id: "F3",
    initials: "RA",
    name: "Ramon Aguilar",
    meta: "Farmer • Bukidnon",
    time: "Oct 23, 2025 • 2:15 PM",
    rating: 5,
    text: "Love the offline mode! I can use it even when I'm in the field with no signal. Thank you!",
    avatarColor: "#9C27B0",
  },
  {
    id: "F4",
    initials: "LC",
    name: "Luis Cruz",
    meta: "Farmer • Laguna",
    time: "Oct 22, 2025 • 8:30 AM",
    rating: 4,
    text: "Interface is much cleaner now. Can we have a dark mode option for night use?",
    avatarColor: "#2196F3",
  },
  {
    id: "F5",
    initials: "AB",
    name: "Ana Bautista",
    meta: "Farmer • Pangasinan",
    time: "Oct 21, 2025 • 4:50 PM",
    rating: 5,
    text: "The weather forecast integration is very helpful for planning. Excellent update!",
    avatarColor: "#E91E63",
  },
];

const starRow = (rating) => (
  <div aria-label={`${rating} out of 5 stars`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
    {Array.from({ length: rating }).map((_, i) => (
      <FaStar key={i} color="#FFC107" aria-hidden />
    ))}
    <span style={{ color: "#28A745", fontWeight: 700, marginLeft: 6 }}>({rating}.0)</span>
  </div>
);

const Feedback = () => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const replyRef = useRef(null);

  useEffect(() => {
    if (showReplyModal) replyRef.current?.focus();
  }, [showReplyModal]);

  const openReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText("");
    setShowReplyModal(true);
  };

  const closeReply = () => {
    setShowReplyModal(false);
    setSelectedFeedback(null);
  };

  const sendReply = () => {
    console.log(`Reply to ${selectedFeedback?.id}:`, replyText);
    closeReply();
  };

  return (
    <div className="d-flex admin-page" style={{ minHeight: "100vh", backgroundColor: "#D4E8D4" }}>
      <aside className="admin-sidenav">
        <SideNav />
      </aside>

      <main className="admin-main">
        <div className="admin-main-container">

          <h3 className="admin-title mb-3">
            <span className="admin-title-badge">Farmer Feedback Details</span>
          </h3>

          {/* Feedback Cards */}
          <div>
            {feedbacks.map((f) => (
              <Card key={f.id} className="mb-3 feedback-card" style={{ borderRadius: 12, padding: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
                <Card.Body style={{ padding: 0 }}>
                  <Row className="align-items-start">
                    <Col xs={3} sm={1} className="d-flex justify-content-center align-items-start mb-2 mb-sm-0">
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          background: f.avatarColor,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 18,
                        }}
                        aria-hidden
                      >
                        {f.initials}
                      </div>
                    </Col>

                    <Col xs={9} sm={11}>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16, color: '#212529' }}>{f.name}</div>
                          <div style={{ color: '#6C757D', fontSize: 13 }}>{f.meta}</div>
                          <div style={{ color: '#6C757D', fontSize: 12, marginTop: 6 }}>{f.time}</div>
                        </div>
                        <div className="mt-2 mt-md-0 text-md-end">{starRow(f.rating)}</div>
                      </div>

                      <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: '#212529' }}>{f.text}</div>

                      <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary" style={{ background: '#0D6EFD', border: 'none', padding: '8px 20px', borderRadius: 6 }} onClick={() => openReply(f)}>
                          Reply
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Reply Modal */}
          <Modal show={showReplyModal} onHide={closeReply} aria-labelledby="reply-modal-title" centered>
            <Modal.Header closeButton>
              <Modal.Title id="reply-modal-title">Reply to Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{selectedFeedback?.name}</div>
              <Form.Group controlId="replyText">
                <Form.Label className="visually-hidden">Reply</Form.Label>
                <Form.Control
                  as="textarea"
                  ref={replyRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  aria-label="Reply message"
                  className="reply-textarea"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={closeReply}>Cancel</Button>
              <Button variant="primary" onClick={sendReply} disabled={replyText.trim() === ""}>Send</Button>
            </Modal.Footer>
          </Modal>

          {/* Pagination */}
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3">
            <div style={{ color: '#6C757D', marginBottom: 6 }}>Showing 5 of 15 submissions</div>
            <Pagination className="justify-content-md-end">
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Feedback;

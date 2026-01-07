import React, { useState, useRef, useEffect } from "react";
import { Card, Row, Col, Button, Modal, Form, Pagination } from "react-bootstrap";
import SideNav from "../components/sidenav";
import "../css/AdminDashboard.css";
import "../css/Feedback.module.css";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ITEMS_PER_PAGE = 6;

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const replyRef = useRef(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const q = query(
        collection(db, "contact_messages"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          name: d.userName,
          email: d.userEmail,
          text: d.message,
          admin_reply: d.admin_reply || "",
          initials: d.userName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          avatarColor: "#4CAF50",
          time: d.createdAt?.toDate().toLocaleString(),
        };
      });

      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (showReplyModal) {
      setTimeout(() => replyRef.current?.focus(), 100);
    }
  }, [showReplyModal]);

  const openReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText("");
    setShowReplyModal(true);
  };

  const closeReply = () => {
    setShowReplyModal(false);
    setSelectedFeedback(null);
    setReplyText("");
  };

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
        replyRef.current?.focus();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  const sendReply = async () => {
    if (!selectedFeedback) return;

    if (replyText.trim() === "") {
      setShowErrorModal(true);
      return;
    }

    try {
      const feedbackRef = doc(db, "contact_messages", selectedFeedback.id);
      await updateDoc(feedbackRef, {
        admin_reply: replyText,
      });

      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === selectedFeedback.id
            ? { ...f, admin_reply: replyText }
            : f
        )
      );

      setReplyText("");
      setShowSentModal(true);

      setTimeout(() => {
        setShowSentModal(false);
        closeReply();
      }, 1500);
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  // 🔢 PAGINATION LOGIC
  const totalPages = Math.ceil(feedbacks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFeedbacks = feedbacks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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

          {paginatedFeedbacks.map((f) => (
            <Card key={f.id} className="mb-3 feedback-card">
              <Card.Body>
                <Row>
                  <Col
                    xs={12} sm={2} md={1}
                    className="mb-2 mb-md-0 d-flex justify-content-start justify-content-md-start"
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: f.avatarColor,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {f.initials}
                    </div>
                  </Col>

                  <Col className="text-start">
                    <div style={{ fontWeight: 700 }}>{f.name}</div>
                    <div style={{ fontSize: 13 }}>{f.email}</div>
                    <div style={{ fontSize: 12 }}>{f.time}</div>

                    <div className="text-center" style={{ marginTop: 10 }}>
                      {f.text}
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <Button onClick={() => openReply(f)}>Reply</Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {/* REPLY MODAL */}
          <Modal show={showReplyModal} onHide={closeReply} centered>
            <Modal.Header closeButton>
              <Modal.Title>Reply to Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                as="textarea"
                ref={replyRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={closeReply}>Cancel</Button>
              <Button onClick={sendReply}>Send</Button>
            </Modal.Footer>
          </Modal>

          {/* SUCCESS MODAL */}
          <Modal show={showSentModal} backdrop={false}>
            <Modal.Body className="text-center" style={{ background: "#D4EDDA", fontWeight: 700 }}>
              Message Sent!
            </Modal.Body>
          </Modal>

          {/* ERROR MODAL */}
          <Modal show={showErrorModal} backdrop={false}>
            <Modal.Body className="text-center" style={{ background: "#F8D7DA", fontWeight: 700 }}>
              Reply cannot be empty!
            </Modal.Body>
          </Modal>

          {/* PAGINATION */}
          <Pagination className="mt-3 justify-content-end">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            />

            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            />
          </Pagination>
        </div>
      </main>
    </div>
  );
};

export default Feedback;

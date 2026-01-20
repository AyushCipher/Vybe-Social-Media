import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const NotFound = () => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
      color: "#22223b"
    }}>
      <h1 style={{ fontSize: "6rem", fontWeight: 700, margin: 0 }}>404</h1>
      <h2 style={{ fontSize: "2rem", fontWeight: 500, margin: "1rem 0" }}>Page Not Found</h2>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#6c757d" }}>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" style={{
        padding: "0.75rem 2rem",
        background: "#22223b",
        color: "#fff",
        borderRadius: "30px",
        textDecoration: "none",
        fontWeight: 600,
        boxShadow: "0 2px 8px rgba(34,34,59,0.08)",
        transition: "background 0.2s"
      }}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

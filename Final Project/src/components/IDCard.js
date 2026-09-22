"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, CheckCircle2, Award } from "lucide-react";

export default function IDCard({ user }) {
  const [avatarDataUrl, setAvatarDataUrl] = useState("");

  useEffect(() => {
    if (!user?.avatarUrl) {
      setAvatarDataUrl("");
      return;
    }

    if (user.avatarUrl.startsWith("data:")) {
      setAvatarDataUrl(user.avatarUrl);
      return;
    }

    let active = true;

    const loadProxyDataUrl = async () => {
      try {
        const res = await fetch(`/api/image-proxy?url=${encodeURIComponent(user.avatarUrl)}`);
        const json = await res.json();
        if (active && json.success && json.dataUrl) {
          setAvatarDataUrl(json.dataUrl);
        } else if (active) {
          setAvatarDataUrl(user.avatarUrl);
        }
      } catch (err) {
        if (active) setAvatarDataUrl(user.avatarUrl);
      }
    };

    loadProxyDataUrl();

    return () => {
      active = false;
    };
  }, [user?.avatarUrl]);

  const verificationPayload = JSON.stringify({
    organization: "CSTU Computer & Programming Club",
    name: user?.name || "",
    id: user?.studentId || "",
    designation: user?.designation || "Member",
    department: user?.department || "CSE",
    session: user?.session || "2022-23",
    status: user?.status || "ACTIVE",
    issued: "2026",
  });

  const getInitials = (name) => {
    if (!name) return "CPC";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const finalAvatarSrc = avatarDataUrl || user?.avatarUrl;

  return (
    <div
      id="cpc-id-card"
      style={{
        width: "360px",
        height: "550px",
        borderRadius: "32px",
        backgroundColor: "#0F1419",
        border: "2px solid #E69D1E",
        color: "#F9FAFB",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
      }}
    >
      {/* Solid Official CSTU Golden Yellow Top Banner */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "144px",
          backgroundColor: "#E69D1E",
        }}
      ></div>

      {/* Top Header */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", paddingTop: "8px" }}>
        <h3
          style={{
            fontWeight: 900,
            fontSize: "14px",
            color: "#0F1419",
            letterSpacing: "-0.025em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Chandpur Science & Technology University
        </h3>
        <p
          style={{
            fontSize: "11px",
            color: "#1E242B",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginTop: "3px",
            marginBottom: 0,
          }}
        >
          Computer & Programming Club
        </p>
      </div>

      {/* Member Photo */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "128px",
            height: "128px",
            borderRadius: "18px",
            backgroundColor: "#161C24",
            padding: "3px",
            border: "3px solid #6E7378",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.8)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              backgroundColor: "#0F1419",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {finalAvatarSrc ? (
              <img
                src={finalAvatarSrc}
                alt={user?.name || "Avatar"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#161C24",
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#E69D1E",
                  letterSpacing: "0.05em",
                }}
              >
                {getInitials(user?.name)}
              </div>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              right: "-6px",
              backgroundColor: "#E69D1E",
              color: "#0F1419",
              padding: "4px",
              borderRadius: "9999px",
              border: "2px solid #0F1419",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 style={{ width: "16px", height: "16px" }} />
          </div>
        </div>

        <h2
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: "-0.025em",
            margin: "12px 0 0 0",
          }}
        >
          {user?.name || "Member Name"}
        </h2>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 16px",
            borderRadius: "9999px",
            backgroundColor: "#E69D1E",
            color: "#0F1419",
            fontSize: "12px",
            fontWeight: 800,
            marginTop: "8px",
          }}
        >
          <Award style={{ width: "14px", height: "14px", color: "#0F1419" }} />
          <span>{user?.designation || "Member"}</span>
        </div>
      </div>

      {/* Member Info Card Box */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          backgroundColor: "#161C24",
          border: "1px solid #262E38",
          borderRadius: "16px",
          padding: "16px",
          fontSize: "12px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
              }}
            >
              Student ID
            </span>
            <span style={{ fontWeight: 800, color: "#E69D1E", fontSize: "14px" }}>
              {user?.studentId || "N/A"}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
              }}
            >
              Session
            </span>
            <span style={{ fontWeight: 700, color: "#E5E7EB" }}>
              {user?.session || "2022-23"}
            </span>
          </div>
        </div>

        <div
          style={{
            paddingTop: "8px",
            marginTop: "8px",
            borderTop: "1px solid #262E38",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
            }}
          >
            Department
          </span>
          <span style={{ fontWeight: 600, color: "#E5E7EB", fontSize: "12px", display: "block" }}>
            {user?.department || "Computer Science & Engineering"}
          </span>
        </div>
      </div>

      {/* Security Bar & QR Code */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "12px",
          marginTop: "4px",
          borderTop: "1px solid #262E38",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "#9CA3AF" }}>
            <ShieldCheck style={{ width: "16px", height: "16px", color: "#E69D1E" }} />
            <span>Official CPC Credential</span>
          </div>
          <p style={{ fontSize: "9px", fontFamily: "monospace", color: "#6B7280", margin: 0, paddingLeft: "22px" }}>
            VERIFIED ID • CSTU-2026
          </p>
        </div>

        <div style={{ backgroundColor: "#FFFFFF", padding: "4px", borderRadius: "10px", border: "1px solid #FFFFFF", flexShrink: 0 }}>
          <QRCodeSVG value={verificationPayload} size={42} level="H" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { S } from "@/lib/theme";
import { Btn, cardStyle } from "@/components/ui";

interface OrderConfirmationProps {
  reqId: string;
  onDone: () => void;
}

export default function OrderConfirmation({ reqId, onDone }: OrderConfirmationProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
      <div style={{ ...cardStyle, padding: 40, textAlign: "center", maxWidth: 420, width: "100%" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#E8F5E9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 28,
          }}
        >
          ✅
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: S.black90, margin: 0 }}>
          Request Submitted
        </h2>
        <p style={{ fontSize: 13, color: S.black70, marginTop: 8 }}>
          Your equipment request has been sent to Equipment Services for review.
        </p>
        <div style={{ backgroundColor: S.almostWhite, borderRadius: 8, padding: 16, marginTop: 20 }}>
          <span style={{ fontSize: 12, color: S.darkGray }}>Request ID</span>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: S.navy,
              fontFamily: "monospace",
              margin: "4px 0 0",
            }}
          >
            {reqId}
          </p>
        </div>
        <p style={{ fontSize: 11, color: S.darkGray, marginTop: 12 }}>Status: Pending Approval</p>
        <Btn variant="primary" onClick={onDone} style={{ marginTop: 20 }}>
          View My Requests
        </Btn>
      </div>
    </div>
  );
}

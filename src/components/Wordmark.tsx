import React from "react";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`bg-clip-text text-transparent font-semibold tracking-tight ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg,#111827,#4f46e5,#7c3aed)",
      }}
    >
      <span style={{ letterSpacing: "-0.02em" }}>Ticket</span>
      <span style={{ letterSpacing: "-0.03em" }}>Pay</span>
    </span>
  );
}
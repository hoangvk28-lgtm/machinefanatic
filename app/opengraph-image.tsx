import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F3EA",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28 }}>
          <svg width="88" height="88" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#2F7D78" strokeWidth="3" />
            <path d="M18 2.5 A15.5 15.5 0 0 1 33.5 18" fill="none" stroke="#E6A04B" strokeWidth="3" strokeLinecap="round" />
            <path
              d="M10 14.5 L13.2 23.5 L17.2 17 L19 23.5 L23.6 14.5"
              fill="none"
              stroke="#17324D"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800 }}>
            <span style={{ color: "#17324D" }}>Worth</span>
            <span style={{ color: "#2F7D78" }}>Rated</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#61717F", fontWeight: 500 }}>
          {BRAND_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            padding: "10px 24px",
            borderRadius: 999,
            background: "#DDEBE5",
            color: "#17324D",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {BRAND_NAME}, Independent buying guides for easier living
        </div>
      </div>
    ),
    { ...size }
  );
}

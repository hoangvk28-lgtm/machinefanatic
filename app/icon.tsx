import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F3EA",
          borderRadius: 14,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
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
      </div>
    ),
    { ...size }
  );
}

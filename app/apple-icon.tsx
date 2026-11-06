import { ImageResponse } from "next/og";
import { GearMark } from "./brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#16191D", borderRadius: 0 }}>
        <GearMark size={140} />
      </div>
    ),
    { ...size }
  );
}

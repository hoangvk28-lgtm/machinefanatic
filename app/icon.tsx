import { ImageResponse } from "next/og";
import { GearMark } from "./brand-mark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#16191D", borderRadius: 14 }}>
        <GearMark size={54} />
      </div>
    ),
    { ...size }
  );
}

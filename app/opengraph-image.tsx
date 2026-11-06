import { ImageResponse } from "next/og";
import { GearMark } from "./brand-mark";

export const alt = "MachineFanatic: expert machine and power tool buying guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#16191D", color: "#F4F4F1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <GearMark size={120} />
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>
            <span>Machine</span><span style={{ color: "#E8590C" }}>Fanatic</span>
          </div>
        </div>
        <div style={{ marginTop: 40, fontSize: 40, color: "rgba(244,244,241,0.75)" }}>Machines, rated by people who read the spec sheet.</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 18, display: "flex", background: "repeating-linear-gradient(-45deg, #E8590C 0 22px, #16191D 22px 44px)" }} />
      </div>
    ),
    { ...size }
  );
}

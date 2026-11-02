import { ImageResponse } from "next/og";

export const alt = "Dark Mattr — The invisible force behind your pipeline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 70% 45%, rgba(255,91,46,0.45), transparent 35%), radial-gradient(circle at 60% 55%, rgba(139,92,255,0.4), transparent 50%), #07070a",
          color: "#efeee9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", opacity: 0.7 }}>Dark Mattr</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 0.95 }}>
          <span>You can&apos;t see it.</span>
          <span style={{ color: "#ff5b2e" }}>You&apos;ll feel the pull.</span>
        </div>
      </div>
    ),
    size,
  );
}

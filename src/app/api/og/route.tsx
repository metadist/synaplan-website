import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Synaplan";
  const description = searchParams.get("description") ?? "Open-Source AI Platform";
  const locale = searchParams.get("locale") ?? "en";

  const isDE = locale === "de";
  const tagline = isDE ? "KI-Plattform · Open Source · DSGVO" : "AI Platform · Open Source · GDPR";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #dce6ff 100%)",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #002c92, #3b5fd9, #002c92)",
          }}
        />

        {/* Logo area */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "auto" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "#002c92",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            S
          </div>
          <span style={{ fontSize: "22px", fontWeight: "700", color: "#002c92" }}>synaplan</span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "auto" }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#3b5fd9",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: "rgba(59,95,217,0.1)",
              padding: "6px 16px",
              borderRadius: "100px",
              width: "fit-content",
            }}
          >
            {tagline}
          </div>
          <h1
            style={{
              fontSize: title.length > 40 ? "44px" : "54px",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: 1.15,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          {description && description !== title && (
            <p
              style={{
                fontSize: "22px",
                color: "#475569",
                lineHeight: 1.5,
                margin: 0,
                maxWidth: "820px",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Bottom badges */}
        <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
          {["Open Source", "Self-Hosted", isDE ? "DSGVO-konform" : "GDPR-Compliant"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#002c92",
                  background: "rgba(0,44,146,0.08)",
                  border: "1px solid rgba(0,44,146,0.2)",
                  padding: "8px 18px",
                  borderRadius: "8px",
                }}
              >
                {badge}
              </div>
            ),
          )}
        </div>

        {/* Right decoration */}
        <div
          style={{
            position: "absolute",
            right: "60px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 40%, rgba(59,95,217,0.15) 0%, rgba(0,44,146,0.05) 70%)",
            border: "1px solid rgba(59,95,217,0.2)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

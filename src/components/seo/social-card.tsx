export function SocialCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#FAF9F6",
        color: "#07152F",
        padding: "64px 72px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 12,
          background: "#07152F",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 54,
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#07152F",
            color: "#FAF9F6",
            fontSize: 23,
            fontWeight: 700,
          }}
        >
          R&P
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: "0.16em",
          }}
        >
          ROCK & PAPER LP
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "serif",
            fontSize: 88,
            lineHeight: 0.94,
            letterSpacing: "-0.04em",
          }}
        >
          Clear thinking.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontFamily: "serif",
            fontSize: 88,
            lineHeight: 0.94,
            letterSpacing: "-0.04em",
            color: "#84796F",
          }}
        >
          Sound counsel.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 18,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <span>Abuja · Lagos · Nigeria</span>
        <span style={{ color: "#667085" }}>rockandpaper.com</span>
      </div>

      <div
        style={{
          position: "absolute",
          right: -100,
          top: 100,
          width: 430,
          height: 430,
          border: "2px solid rgba(7, 21, 47, 0.08)",
          borderRadius: 430,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 20,
          top: 220,
          width: 250,
          height: 250,
          border: "2px solid rgba(132, 121, 111, 0.22)",
          borderRadius: 250,
        }}
      />
    </div>
  );
}

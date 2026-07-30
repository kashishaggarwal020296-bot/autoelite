/**
 * Store visual. Shows the real showroom photo when one is supplied; otherwise a
 * clean branded card (no cartoon). Pass the locality as `name` and an optional
 * public/ image path as `photo`.
 */
function LocalityTag({ name, onDark }: { name: string; onDark?: boolean }) {
  return (
    <span
      style={{
        position: "absolute",
        left: 14,
        bottom: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "5px 12px",
        borderRadius: 999,
        background: onDark ? "rgba(255,255,255,0.12)" : "var(--accent)",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.06em",
        backdropFilter: onDark ? "blur(4px)" : undefined,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
      {name.toUpperCase()}
    </span>
  );
}

export default function Storefront({ name, photo }: { name: string; photo?: string }) {
  if (photo) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        <img
          src={photo}
          alt={`Autoelite ${name} Ather showroom`}
          loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* subtle bottom gradient so the tag stays legible */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.38), rgba(0,0,0,0) 42%)" }} />
        <LocalityTag name={name} onDark />
      </div>
    );
  }

  // Fallback: branded card (used until a real photo is supplied, e.g. HSR).
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
        padding: "0 28px",
        background: "radial-gradient(120% 140% at 15% 0%, #2a2a26 0%, var(--ink) 60%)",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/brand/autoelite-icon.png" alt="" style={{ height: 30, width: "auto", display: "block" }} />
        <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.14em", color: "#cfe0c4" }}>AUTOELITE · ATHER</span>
      </div>
      <div style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.1 }}>{name}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", maxWidth: 260 }}>
        South Bengaluru showroom — sales, finance &amp; test rides.
      </div>
      <LocalityTag name={name} onDark />
    </div>
  );
}

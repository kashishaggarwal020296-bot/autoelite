import { dealer, reviews, Review } from "@/data/site.data";

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} style={{ color: "#f5a623", fontSize: 14, letterSpacing: 1 }}>
      {"★".repeat(rating)}
      <span style={{ color: "var(--line-2)" }}>{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function ReviewCard({ r, ariaHidden }: { r: Review; ariaHidden?: boolean }) {
  return (
    <figure
      aria-hidden={ariaHidden}
      className="card marquee-card"
      style={{ margin: 0, padding: 20, height: 236, display: "flex", flexDirection: "column", gap: 10 }}
    >
      <Stars rating={r.rating} />
      <blockquote
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--muted)",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 6,
        }}
      >
        “{r.text}”
      </blockquote>
      <figcaption style={{ marginTop: "auto", paddingTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>{r.author}</span>
        <span style={{ fontSize: 12, color: "var(--faint)" }}>{r.date} · Google</span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  return (
    <section className="section" style={{ paddingTop: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 24, margin: 0 }}>What Bengaluru riders say</h2>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", color: "var(--muted-2)", fontSize: 14 }}>
            <Stars rating={Math.round(dealer.ratingValue)} />
            <strong style={{ color: "var(--ink)" }}>{dealer.ratingValue}</strong>
            <span>· {dealer.reviewCount} Google reviews</span>
          </div>
        </div>
        <a href={dealer.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
          Read all on Google →
        </a>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          {reviews.map((r) => (
            <ReviewCard key={r.author + r.date} r={r} />
          ))}
          {/* duplicate set for a seamless loop; hidden from assistive tech */}
          {reviews.map((r) => (
            <ReviewCard key={"dup-" + r.author + r.date} r={r} ariaHidden />
          ))}
        </div>
      </div>
    </section>
  );
}

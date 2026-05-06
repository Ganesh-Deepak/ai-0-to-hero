import React from "react";
import { ArrowRight, FlaskConical, BookOpen, Trophy } from "lucide-react";
import { usePath } from "../contexts/pathContextValue";

export default function Revenue({
  selectedNiche,
  setSelectedNiche,
  weeklyHours,
  goToLab,
  goToLibraryTopic,
  doneLabs,
}) {
  const path = usePath();
  const { revenueNiches, revenueSteps, labs, topicById, revenueCopy: copy } = path;
  const labById = React.useMemo(
    () => Object.fromEntries(labs.map((l) => [l.id, l])),
    [labs]
  );

  const niche =
    revenueNiches.find((n) => n.id === selectedNiche) || revenueNiches[0];
  const launchDays = Math.max(14, Math.ceil(60 / Math.max(4, weeklyHours)) * 7);

  const relatedLabs = (niche.relatedLabs || [])
    .map((id) => labById[id])
    .filter(Boolean);
  const relatedTopics = niche.relatedTopics || [];

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2>
            {copy.titlePre}
            <em>{copy.titleEm}</em>
            {copy.titlePost}
          </h2>
          <p>{copy.lede}</p>
        </div>
      </div>

      <div className="revenue-layout">
        <aside className="niche-picker">
          <div
            style={{
              margin: "4px 8px 10px",
              fontFamily: "var(--f-mono)",
              fontSize: 10.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            {copy.nicheLabel}
          </div>
          {revenueNiches.map((n) => (
            <button
              key={n.id}
              className={`niche-btn${selectedNiche === n.id ? " active" : ""}`}
              onClick={() => setSelectedNiche(n.id)}
            >
              <span className="emoji">{n.emoji}</span>
              <span style={{ display: "grid", gap: 2 }}>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{n.label}</span>
                <small style={{ color: "var(--muted)", fontSize: 11.5 }}>
                  {n.price.split(" · ")[0]}
                </small>
              </span>
            </button>
          ))}
        </aside>

        <div style={{ display: "grid", gap: 18 }}>
          <article className="offer-card">
            <div>
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                {niche.emoji} {niche.label}
              </span>
              <h3>{niche.offer}</h3>
            </div>

            <div className="offer-grid">
              <div className="offer-field">
                <span className="label">Pain</span>
                <span className="value">{niche.pain}</span>
              </div>
              <div className="offer-field">
                <span className="label">First project</span>
                <span className="value">{niche.firstProject}</span>
              </div>
              <div className="offer-field">
                <span className="label">Comp / price signal</span>
                <span className="value highlight">{niche.price}</span>
              </div>
              <div className="offer-field">
                <span className="label">Proof needed</span>
                <span className="value">{niche.proofNeeded}</span>
              </div>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderLeft: "2px solid var(--cyan)",
                background: "var(--panel-2)",
                borderRadius: "0 6px 6px 0",
                color: "var(--ink-dim)",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <em
                style={{
                  fontStyle: "normal",
                  color: "var(--cyan)",
                  fontFamily: "var(--f-mono)",
                  fontSize: 10.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginRight: 8,
                }}
              >
                {copy.windowLabel}
              </em>
              ~{launchDays} days from kickoff to first signal at {weeklyHours}h/week.
            </div>
          </article>

          {(relatedLabs.length > 0 || relatedTopics.length > 0) && (
            <article className="offer-card niche-plan">
              <div>
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  <FlaskConical
                    size={11}
                    style={{ marginRight: 6, verticalAlign: "-1px" }}
                  />
                  {copy.planEyebrow}
                </span>
                <h3 style={{ marginTop: 6 }}>{copy.planTitle}</h3>
              </div>

              {relatedLabs.length > 0 && (
                <div className="niche-lab-list">
                  {relatedLabs.map((lab, idx) => {
                    const topic = topicById[lab.topic];
                    const Icon = topic?.icon;
                    const shipped = doneLabs?.has?.(lab.id);
                    return (
                      <button
                        key={lab.id}
                        className={`niche-lab${shipped ? " shipped" : ""}`}
                        onClick={() => goToLab && goToLab(lab.id, lab.topic)}
                        title={`Open ${lab.title} in Labs`}
                      >
                        <span className="step-num">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="niche-lab-body">
                          <span className="niche-lab-head">
                            {topic && (
                              <span
                                className="topic-tag"
                                style={{ color: topic.color }}
                              >
                                {Icon && <Icon size={11} />}
                                {topic.name}
                              </span>
                            )}
                            <span className="level">· {lab.level}</span>
                            <span className="level">· {lab.estimate}</span>
                            {shipped && (
                              <span className="pill green">
                                <Trophy size={10} /> Shipped
                              </span>
                            )}
                          </span>
                          <span className="niche-lab-title">{lab.title}</span>
                          <span className="niche-lab-outcome">{lab.outcome}</span>
                        </span>
                        <ArrowRight size={14} className="arrow" />
                      </button>
                    );
                  })}
                </div>
              )}

              {relatedTopics.length > 0 && (
                <div className="niche-tracks">
                  <span className="label">
                    <BookOpen size={11} style={{ marginRight: 4 }} />
                    Study these tracks
                  </span>
                  <span className="chips">
                    {relatedTopics.map((t) => {
                      const topic = topicById[t];
                      if (!topic) return null;
                      return (
                        <button
                          key={t}
                          className="topic-chip clickable"
                          style={{ color: topic.color }}
                          onClick={() => goToLibraryTopic && goToLibraryTopic(t)}
                          title={`Open ${topic.name} in Library`}
                        >
                          {topic.name}
                        </button>
                      );
                    })}
                  </span>
                </div>
              )}
            </article>
          )}

          <div className="revenue-steps">
            {revenueSteps.map((s, idx) => (
              <article className="step-card" key={s.title}>
                <span className="n">{String(idx + 1).padStart(2, "0")}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

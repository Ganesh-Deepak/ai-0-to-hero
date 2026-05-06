import React from "react";
import { usePath } from "../contexts/pathContextValue";

export default function Concepts({ selectedLayers, toggleLayer }) {
  const path = usePath();
  const {
    architectureLayers,
    agentPatterns,
    ragFailureModes,
    evalPlaybook,
    conceptsCopy: copy,
  } = path;
  const active = architectureLayers.filter((l) => selectedLayers.has(l.id));
  const blueprint = [copy.flowStart, ...active.map((l) => l.label), copy.flowEnd];

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

      <div className="concepts-layout">
        <aside className="layer-picker">
          <div className="title">{copy.composeTitle}</div>
          {architectureLayers.map((layer) => {
            const Icon = layer.icon;
            const active = selectedLayers.has(layer.id);
            return (
              <button
                key={layer.id}
                className={`layer-btn${active ? " active" : ""}`}
                onClick={() => toggleLayer(layer.id)}
              >
                {Icon && <Icon size={16} color="var(--amber)" style={{ marginTop: 2 }} />}
                <span>
                  <span className="l-label">{layer.label}</span>
                  <span className="l-detail">{layer.detail}</span>
                </span>
              </button>
            );
          })}
        </aside>

        <div style={{ display: "grid", gap: 24 }}>
          <div className="concept-section">
            <h3>{copy.flowTitle}</h3>
            <p className="lede">{copy.flowLede}</p>
            <div className="blueprint">
              {blueprint.map((item, idx) => (
                <React.Fragment key={`${item}-${idx}`}>
                  <div className="blueprint-node">
                    <span className="idx">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="label">{item}</span>
                  </div>
                  {idx < blueprint.length - 1 && (
                    <div className="blueprint-arrow" aria-hidden />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="concept-section">
            <h3>{copy.patternsTitle}</h3>
            <p className="lede">{copy.patternsLede}</p>
            <div className="pattern-grid">
              {agentPatterns.map((p) => (
                <div className="pattern-card" key={p.title}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>{p.title}</h4>
                    <div className="row">
                      <span className={`pill ${costClass(p.cost)}`}>Cost {p.cost}</span>
                      <span className={`pill ${reliabilityClass(p.reliability)}`}>
                        {p.reliability}
                      </span>
                    </div>
                  </div>
                  <p className="detail">{p.use}</p>
                  <p className="avoid">
                    <em>Avoid</em>
                    {p.avoid}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="concept-section">
            <h3>{copy.failuresTitle}</h3>
            <p className="lede">{copy.failuresLede}</p>
            <div className="failure-grid">
              {ragFailureModes.map((f) => {
                const Icon = f.icon;
                return (
                  <div className="failure-card" key={f.title}>
                    <div className="head">
                      {Icon && <Icon size={15} />}
                      {f.title}
                    </div>
                    <div className="signal">{f.signal}</div>
                    <div className="fix">
                      <em>Fix</em>
                      {f.fix}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="concept-section">
            <h3>{copy.playbookTitle}</h3>
            <p className="lede">{copy.playbookLede}</p>
            <div className="eval-flow">
              {evalPlaybook.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div className="eval-step" key={s.stage}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="n">{idx + 1}</span>
                      {Icon && <Icon size={14} color="var(--muted)" />}
                    </div>
                    <h4>{s.stage}</h4>
                    <p>{s.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function costClass(cost) {
  if (cost === "Low") return "green";
  if (cost === "Medium") return "amber";
  return "red";
}

function reliabilityClass(r) {
  if (r === "High") return "green";
  if (r === "Medium") return "amber";
  return "red";
}

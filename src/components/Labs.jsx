import React from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  FlaskConical,
  Play,
  ShieldAlert,
  Target,
  Trophy,
} from "lucide-react";
import { usePath } from "../contexts/pathContextValue";

export default function Labs({
  labs,
  activeTopic,
  setActiveTopic,
  activePhase,
  setActivePhase,
  doneLabs,
  toggleLab,
  labTasks,
  toggleLabTask,
  goToLibraryForLab,
}) {
  const path = usePath();
  const { topicById, phases } = path;
  const phaseById = React.useMemo(
    () => Object.fromEntries(phases.map((p) => [p.id, p])),
    [phases]
  );
  const activePhaseMeta = activePhase ? phaseById[activePhase] : null;
  const filtered = labs.filter((l) => {
    if (activePhaseMeta && l.phase !== activePhaseMeta.id) return false;
    if (activeTopic !== "all" && l.topic !== activeTopic) return false;
    return true;
  });
  const activeTopicMeta = activeTopic !== "all" ? topicById[activeTopic] : null;

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Portfolio proof</span>
          <h2>
            Practical labs with <em>visible</em> deliverables.
          </h2>
          <p>
            Every lab now ships with a full "Start the lab" guide — prerequisites,
            starter commands, numbered walkthrough with runnable code, gotchas,
            and a verification checklist. Ship the artifact. That's the point.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {activePhaseMeta && (
            <button
              className="btn filter-chip"
              onClick={() => setActivePhase && setActivePhase(null)}
              title="Clear phase filter"
            >
              <span className="chip-dot" style={{ background: "var(--amber)" }} />
              <span style={{ color: "var(--ink)" }}>
                Phase · {activePhaseMeta.title}
              </span>
              <span className="chip-x">×</span>
            </button>
          )}
          {activeTopicMeta && (
            <button
              className="btn filter-chip"
              style={{ color: activeTopicMeta.color }}
              onClick={() => setActiveTopic && setActiveTopic("all")}
              title="Clear track filter"
            >
              <span className="chip-dot" style={{ background: "currentColor" }} />
              <span style={{ color: "var(--ink)" }}>{activeTopicMeta.name}</span>
              <span className="chip-x">×</span>
            </button>
          )}
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            {doneLabs.size} of {labs.length} shipped
          </span>
        </div>
      </div>

      <div className="lab-grid">
        {filtered.map((lab) => (
          <LabCard
            key={lab.id}
            lab={lab}
            done={doneLabs.has(lab.id)}
            toggle={() => toggleLab(lab.id)}
            tasks={labTasks[lab.id] || []}
            toggleTask={(idx) => toggleLabTask(lab.id, idx)}
            goToLibraryForLab={goToLibraryForLab}
          />
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: 40,
              textAlign: "center",
              color: "var(--muted)",
              background: "var(--panel)",
              border: "1px dashed var(--line)",
              borderRadius: "var(--r-lg)",
            }}
          >
            No labs for this track yet. Try "All tracks" in the sidebar.
          </div>
        )}
      </div>
    </section>
  );
}

function LabCard({ lab, done, toggle, tasks, toggleTask, goToLibraryForLab }) {
  const path = usePath();
  const { topicById, labGuides } = path;
  const [showProof, setShowProof] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(false);
  const topic = topicById[lab.topic];
  const Icon = topic?.icon;
  const completeTasks = new Set(tasks);
  const stepsCount = lab.steps?.length || 0;
  const progress =
    stepsCount > 0 ? Math.round((completeTasks.size / stepsCount) * 100) : 0;
  const guide = labGuides[lab.id];

  return (
    <article id={`lab-${lab.id}`} className={`lab-card${done ? " done" : ""}`}>
      <div className="card-meta">
        {topic && (
          <span className="topic-tag" style={{ color: topic.color }}>
            {Icon && <Icon size={11} />}
            {topic.name}
          </span>
        )}
        <span>·</span>
        <span>{lab.level}</span>
        <span>·</span>
        <span>{lab.estimate}</span>
        {done && (
          <span className="pill green" style={{ marginLeft: "auto" }}>
            <Trophy size={10} /> Shipped
          </span>
        )}
      </div>

      <h3>{lab.title}</h3>
      <p className="outcome">{lab.outcome}</p>

      <div className="lab-stack">
        <span
          style={{
            color: "var(--cyan)",
            fontSize: 10.5,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginRight: 8,
          }}
        >
          Stack
        </span>
        {lab.stack}
      </div>

      <div className="lab-tasks">
        {lab.steps.map((step, idx) => (
          <label className="task-row" key={step}>
            <input
              type="checkbox"
              checked={completeTasks.has(idx)}
              onChange={() => toggleTask(idx)}
            />
            <span>{step}</span>
          </label>
        ))}
      </div>

      <div className="meter">
        <span style={{ width: `${progress}%` }} />
      </div>

      {guide && (
        <button
          className={`btn${showGuide ? " primary" : ""} guide-toggle`}
          onClick={() => setShowGuide((x) => !x)}
        >
          {showGuide ? <ChevronDown size={14} /> : <Play size={14} />}
          <span>{showGuide ? "Hide lab guide" : "Start the lab — full guide"}</span>
        </button>
      )}

      {showGuide && guide && (
        <LabGuide
          guide={guide}
          lab={lab}
          goToLibraryForLab={goToLibraryForLab}
        />
      )}

      <button
        className="btn ghost"
        style={{
          justifyContent: "space-between",
          padding: "6px 10px",
          color: "var(--muted)",
          fontSize: 12,
        }}
        onClick={() => setShowProof((x) => !x)}
      >
        <span>Acceptance, proof & revenue</span>
        {showProof ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      {showProof && (
        <div className="lab-proofs">
          <div className="row">
            <strong>Accept</strong>
            <span>{lab.acceptance}</span>
          </div>
          <div className="row">
            <strong>Proof</strong>
            <span>{lab.proof}</span>
          </div>
          <div className="row">
            <strong>Revenue</strong>
            <span>{lab.revenue}</span>
          </div>
        </div>
      )}

      <button
        className={`btn${done ? " success" : " primary"}`}
        onClick={toggle}
      >
        {done ? <Check size={14} /> : <Trophy size={14} />}
        <span>{done ? "Shipped — click to un-ship" : "Mark lab shipped"}</span>
      </button>
    </article>
  );
}

function LabGuide({ guide, lab, goToLibraryForLab }) {
  const path = usePath();
  const { topicById, resources } = path;
  const resourceById = React.useMemo(
    () => Object.fromEntries(resources.map((r) => [r.id, r])),
    [resources]
  );
  const linked = (guide.linkedResourceIds || [])
    .map((id) => resourceById[id])
    .filter(Boolean);

  return (
    <div className="lab-guide">
      <div className="lab-guide-row quickstart">
        <div className="lab-guide-label">
          <FlaskConical size={12} /> Quick start
        </div>
        <p>{guide.quickStart}</p>
      </div>

      {guide.prerequisites?.length > 0 && (
        <div className="lab-guide-row">
          <div className="lab-guide-label">Prerequisites</div>
          <ul className="prereq-list">
            {guide.prerequisites.map((p) => (
              <li key={p.label}>
                <strong>{p.label}</strong>
                {p.note && <span className="muted"> — {p.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {guide.starter && (
        <div className="lab-guide-row">
          <div className="lab-guide-label">Scaffold</div>
          <p>{guide.starter.description}</p>
          {guide.starter.commands?.length > 0 && (
            <CodeBlock
              code={guide.starter.commands.join("\n")}
              language="bash"
            />
          )}
        </div>
      )}

      {guide.walkthrough?.length > 0 && (
        <div className="lab-guide-row">
          <div className="lab-guide-label">Walkthrough</div>
          <ol className="walkthrough">
            {guide.walkthrough.map((step, i) => (
              <li key={i}>
                <div className="step-title">{step.title}</div>
                <p>{step.body}</p>
                {step.code && (
                  <CodeBlock code={step.code} language={step.language || "text"} />
                )}
                {step.checkpoint && (
                  <div className="checkpoint">
                    <Target size={11} /> <em>Checkpoint:</em> {step.checkpoint}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {guide.gotchas?.length > 0 && (
        <div className="lab-guide-row">
          <div className="lab-guide-label warn">
            <ShieldAlert size={12} /> Gotchas
          </div>
          <ul className="gotcha-list">
            {guide.gotchas.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      {guide.verifyBy?.length > 0 && (
        <div className="lab-guide-row">
          <div className="lab-guide-label">Verify by</div>
          <ul className="verify-list">
            {guide.verifyBy.map((v, i) => (
              <li key={i}>
                <Check size={11} /> {v}
              </li>
            ))}
          </ul>
        </div>
      )}

      {linked.length > 0 && (
        <div className="lab-guide-row">
          <div className="lab-guide-label">
            <BookOpen size={12} /> Background reading
          </div>
          <div className="reading-list">
            {linked.map((r) => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="reading-item"
                title={r.why}
              >
                <span className="reading-title">{r.title}</span>
                <span className="reading-meta">
                  {r.source}
                  {r.author && r.author !== r.source ? ` · ${r.author}` : ""} ·{" "}
                  {r.type} · {r.time}
                </span>
                <ExternalLink size={12} className="reading-ext" />
              </a>
            ))}
          </div>
          {goToLibraryForLab && (
            <button
              className="btn ghost phase-jump"
              onClick={() =>
                goToLibraryForLab(lab.topic, guide.linkedResourceIds || [])
              }
              style={{ marginTop: 8 }}
            >
              <span>See full {topicById[lab.topic]?.name || "track"} library</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };
  return (
    <div className="code-block">
      <div className="code-head">
        <span className="lang">{language}</span>
        <button
          className="btn icon ghost copy-btn"
          onClick={onCopy}
          title={copied ? "Copied!" : "Copy"}
          aria-label="Copy code"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

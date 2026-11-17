import React from "react";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { CheckButton, Meter, PageHead, ResourceRow } from "../components/ui";
import { buildHash } from "../lib/router";

export default function Labs(props) {
  const { path, route } = props;
  const lab = route.id ? path.labById[route.id] : null;
  if (route.id && !lab) {
    return (
      <div className="container page">
        <PageHead title="Lab not found" lede="That lab doesn't exist in this path." />
        <a className="button" href={buildHash({ pathId: path.id, section: "labs" })}>
          <ArrowLeft size={15} aria-hidden="true" /> All labs
        </a>
      </div>
    );
  }
  return lab ? <LabDetail {...props} lab={lab} /> : <LabList {...props} />;
}

function LabList({ path, progress }) {
  const shipped = new Set(progress.shipped);
  return (
    <div className="container page">
      <PageHead
        title="Labs"
        lede={`${path.labs.length} labs, each with a clear finish line and something you can show. ${shipped.size} shipped so far.`}
      />
      <ol className="lab-list">
        {path.labs.map((lab, i) => {
          const phase = path.phaseById[lab.phase];
          const n = (progress.steps[lab.id] || []).length;
          const pct = shipped.has(lab.id) ? 100 : Math.round((n / lab.steps.length) * 100);
          return (
            <li key={lab.id} className={`lab-item${shipped.has(lab.id) ? " is-shipped" : ""}`}>
              <a href={buildHash({ pathId: path.id, section: "labs", id: lab.id })}>
                <span className="lab-num mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="lab-main">
                  <span className="kicker">{phase?.title}</span>
                  <span className="lab-title">{lab.title}</span>
                  <span className="muted">{lab.outcome}</span>
                </span>
                <span className="lab-side">
                  <span className="meta mono">
                    {shipped.has(lab.id) ? "Shipped" : `${n}/${lab.steps.length} steps`} · {lab.hours}
                  </span>
                  <Meter value={pct} label={`${lab.title} progress`} />
                </span>
                <ArrowRight size={16} className="chev" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      className="icon-button small copy"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {});
      }}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
    </button>
  );
}

function LabDetail({ path, progress, actions, lab }) {
  const steps = new Set(progress.steps[lab.id] || []);
  const shipped = progress.shipped.includes(lab.id);
  const done = new Set(progress.done);
  const saved = new Set(progress.saved);
  const phase = path.phaseById[lab.phase];
  const index = path.labs.indexOf(lab);
  const next = path.labs[index + 1];
  const pct = Math.round((steps.size / lab.steps.length) * 100);
  const readings = lab.readings.map((id) => path.resourceById[id]).filter(Boolean);

  return (
    <div className="container page narrow">
      <a className="back-link" href={buildHash({ pathId: path.id, section: "labs" })}>
        <ArrowLeft size={15} aria-hidden="true" /> All labs
      </a>

      <header className="lab-head">
        <p className="kicker">
          Lab {String(index + 1).padStart(2, "0")} · {phase?.title}
        </p>
        <h1>{lab.title}</h1>
        <p className="lede">{lab.outcome}</p>
        <dl className="facts">
          <div>
            <dt>Done when</dt>
            <dd>{lab.done}</dd>
          </div>
          <div>
            <dt>Proof</dt>
            <dd>{lab.proof}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{lab.stack}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd className="mono">{lab.hours}</dd>
          </div>
        </dl>
      </header>

      <section aria-labelledby="steps-title">
        <div className="section-head">
          <h2 id="steps-title" className="section-title">Steps</h2>
          <span className="meta mono">
            {steps.size}/{lab.steps.length} done
          </span>
        </div>
        <Meter value={pct} label="Steps completed" />
        <ol className="steps">
          {lab.steps.map((step, i) => {
            const checked = steps.has(i);
            return (
              <li key={step.title} className={checked ? "is-done" : undefined}>
                <CheckButton
                  checked={checked}
                  onClick={() => actions.toggleStep(lab.id, i)}
                  label={checked ? `Mark step ${i + 1} as not done` : `Mark step ${i + 1} as done`}
                />
                <div className="step-body">
                  <h3>
                    <span className="mono step-n">{i + 1}.</span> {step.title}
                  </h3>
                  <p>{step.body}</p>
                  {step.code && (
                    <div className="code">
                      <div className="code-bar">
                        <span className="mono">{step.lang}</span>
                        <CopyButton text={step.code} />
                      </div>
                      <pre tabIndex={0}>
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {lab.gotchas?.length > 0 && (
        <section aria-labelledby="gotchas-title">
          <h2 id="gotchas-title" className="section-title">Watch out for</h2>
          <ul className="gotchas">
            {lab.gotchas.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>
      )}

      {readings.length > 0 && (
        <section aria-labelledby="readings-title">
          <h2 id="readings-title" className="section-title">Read first</h2>
          <ul className="resource-list">
            {readings.map((r) => (
              <ResourceRow
                key={r.id}
                resource={r}
                done={done.has(r.id)}
                saved={saved.has(r.id)}
                onToggleRead={actions.toggleRead}
                onToggleSaved={actions.toggleSaved}
                compact
              />
            ))}
          </ul>
        </section>
      )}

      <section className={`ship-bar panel${shipped ? " is-shipped" : ""}`} aria-label="Ship this lab">
        <div>
          <h2 className="section-title">{shipped ? "Shipped" : "Ready to ship?"}</h2>
          <p className="muted">{shipped ? "Nice. Put the proof in your portfolio." : `Mark it shipped once this is true: ${lab.done}`}</p>
        </div>
        <div className="button-row">
          <button type="button" className={`button${shipped ? "" : " primary"}`} aria-pressed={shipped} onClick={() => actions.toggleShipped(lab.id)}>
            {shipped ? "Mark as not shipped" : "Mark as shipped"}
          </button>
          {next && (
            <a className="button" href={buildHash({ pathId: path.id, section: "labs", id: next.id })}>
              Next: {next.title} <ArrowRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

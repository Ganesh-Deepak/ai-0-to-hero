import React from "react";
import { ArrowRight, ChevronDown, Download, FileText, RotateCcw, Upload } from "lucide-react";
import { computePlan } from "../lib/plan";
import { MAX_HOURS, MIN_HOURS } from "../lib/progress";
import { plural } from "../lib/format";
import { buildHash } from "../lib/router";
import { CheckButton, Meter, ResourceRow } from "../components/ui";

export default function Plan({ path, progress, actions, go, data }) {
  const plan = React.useMemo(() => computePlan(path, progress), [path, progress]);
  const done = new Set(progress.done);
  const saved = new Set(progress.saved);
  const shipped = new Set(progress.shipped);
  const [open, setOpen] = React.useState(() => new Set(plan.current ? [plan.current.id] : []));
  const toggleOpen = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const labSteps = plan.nextLab ? (progress.steps[plan.nextLab.id] || []).length : 0;

  return (
    <div className="container page">
      <section className="hero" aria-labelledby="plan-title">
        <p className="kicker">{path.label}</p>
        <h1 id="plan-title">{path.title}</h1>
        <p className="lede">{path.lede}</p>

        <dl className="stats">
          <div>
            <dt>Sources read</dt>
            <dd>
              <span className="num">{done.size}</span>
              <span className="of">/ {path.resources.length}</span>
            </dd>
          </div>
          <div>
            <dt>Labs shipped</dt>
            <dd>
              <span className="num">{shipped.size}</span>
              <span className="of">/ {path.labs.length}</span>
            </dd>
          </div>
          <div>
            <dt>Plan length</dt>
            <dd>
              <span className="num">{plan.totalWeeks}</span>
              <span className="of">weeks</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel tune" aria-label="Tune the plan">
        <div className="tune-field">
          <span className="field-label" id="goal-label">Goal</span>
          <div className="segmented goal-switch" role="radiogroup" aria-labelledby="goal-label">
            {path.goalIds.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={progress.goal === id}
                onClick={() => actions.setGoal(id)}
              >
                {path.goals[id].label}
              </button>
            ))}
          </div>
          <p className="field-note">{plan.goal.note}</p>
        </div>
        <div className="tune-field hours-field">
          <label className="field-label" htmlFor="hours">
            Hours per week <output htmlFor="hours" className="mono">{progress.hours}</output>
          </label>
          <input
            id="hours"
            type="range"
            min={MIN_HOURS}
            max={MAX_HOURS}
            step={1}
            value={progress.hours}
            onChange={(e) => actions.setHours(Number(e.target.value))}
          />
          <div className="range-scale mono" aria-hidden="true">
            <span>{MIN_HOURS}</span>
            <span>{MAX_HOURS}</span>
          </div>
        </div>
      </section>

      <section className="next" aria-labelledby="next-title">
        <h2 id="next-title" className="section-title">Up next</h2>
        {plan.current ? (
          <div className="next-grid">
            <article className="panel next-card">
              <p className="kicker">Read · {plan.current.title}</p>
              {plan.nextRead ? (
                <>
                  <h3>
                    <a href={plan.nextRead.url} target="_blank" rel="noopener noreferrer">
                      {plan.nextRead.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </h3>
                  <p className="meta">
                    {plan.nextRead.source} · {plan.nextRead.type} · <span className="mono">{plan.nextRead.time}</span>
                  </p>
                  <p className="muted">{plan.nextRead.why}</p>
                  <div className="card-actions">
                    <button type="button" className="button" onClick={() => actions.toggleRead(plan.nextRead.id)}>
                      Mark as read
                    </button>
                  </div>
                </>
              ) : (
                <p className="muted">Every source in this phase is read. Ship the lab to finish the phase.</p>
              )}
            </article>
            <article className="panel next-card">
              <p className="kicker">Build · {plan.current.title}</p>
              {plan.nextLab ? (
                <>
                  <h3>
                    <a href={buildHash({ pathId: path.id, section: "labs", id: plan.nextLab.id })}>{plan.nextLab.title}</a>
                  </h3>
                  <p className="meta">
                    <span className="mono">{plan.nextLab.hours}</span> · {labSteps}/{plan.nextLab.steps.length} steps
                  </p>
                  <p className="muted">{plan.nextLab.outcome}</p>
                  <div className="card-actions">
                    <button type="button" className="button primary" onClick={() => go("labs", plan.nextLab.id)}>
                      {labSteps ? "Continue lab" : "Start lab"} <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <p className="muted">No lab left in this phase. Finish the reading to move on.</p>
              )}
            </article>
          </div>
        ) : (
          <div className="panel empty">
            <h3>Every phase is complete.</h3>
            <p className="muted">Time to turn it into paid work.</p>
            <button type="button" className="button primary" onClick={() => go("offers")}>
              Open {path.offersLabel.toLowerCase()} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      <section aria-labelledby="phases-title">
        <div className="section-head">
          <h2 id="phases-title" className="section-title">Phases</h2>
          <p className="muted">
            {plan.totalWeeks} weeks at {progress.hours} h/week for the {plan.goal.label.toLowerCase()} goal.
          </p>
        </div>
        <ol className="timeline">
          {plan.phases.map((phase) => {
            const isOpen = open.has(phase.id);
            const isCurrent = plan.current?.id === phase.id;
            const status = phase.complete ? "complete" : isCurrent ? "current" : "upcoming";
            return (
              <li key={phase.id} className={`phase is-${status}`}>
                <div className="phase-when mono">
                  {phase.startWeek === phase.endWeek ? `Wk ${phase.startWeek}` : `Wk ${phase.startWeek}–${phase.endWeek}`}
                </div>
                <div className="phase-marker" aria-hidden="true" />
                <div className="phase-body">
                  <div className="phase-top">
                    <h3>
                      <span className="phase-index mono">{String(phase.index + 1).padStart(2, "0")}</span>
                      {phase.title}
                    </h3>
                    {phase.emphasis === "focus" && <span className="tag accent">Focus</span>}
                    {phase.emphasis === "skim" && <span className="tag">Skim</span>}
                    {phase.complete && <span className="tag done">Done</span>}
                  </div>
                  <p>{phase.focus}</p>
                  <p className="ship">
                    <span className="do-label">Ship</span> {phase.ship}
                  </p>
                  <div className="phase-progress">
                    <Meter value={phase.pct} label={`${phase.title} progress`} />
                    <span className="meta mono">
                      {phase.hours} h · {phase.read}/{phase.pool.length} read · {phase.labsShipped}/{phase.labs.length}{" "}
                      {phase.labs.length === 1 ? "lab" : "labs"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="disclosure"
                    aria-expanded={isOpen}
                    aria-controls={`phase-${phase.id}`}
                    onClick={() => toggleOpen(phase.id)}
                  >
                    <ChevronDown size={15} aria-hidden="true" />
                    {isOpen ? "Hide" : "Show"} sources and labs
                  </button>
                  {isOpen && (
                    <div id={`phase-${phase.id}`} className="phase-detail">
                      <ul className="lab-mini">
                        {phase.labs.map((lab) => (
                          <li key={lab.id}>
                            <CheckButton
                              checked={shipped.has(lab.id)}
                              onClick={() => actions.toggleShipped(lab.id)}
                              label={shipped.has(lab.id) ? `Mark ${lab.title} as not shipped` : `Mark ${lab.title} as shipped`}
                            />
                            <a href={buildHash({ pathId: path.id, section: "labs", id: lab.id })}>
                              <span className="kicker inline">Lab</span> {lab.title}
                            </a>
                            <span className="meta mono">{lab.hours}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="resource-list">
                        {phase.pool
                          .slice()
                          .sort((a, b) => Number(b.must) - Number(a.must))
                          .map((r) => (
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
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="notes" aria-labelledby="notes-title">
        <div className="section-head">
          <h2 id="notes-title" className="section-title">What changed in 2026</h2>
          <p className="muted">What this plan now assumes.</p>
        </div>
        <ul className="notes-grid">
          {path.fieldNotes.map((note) => (
            <li key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="data-tools" aria-labelledby="data-title">
        <h2 id="data-title" className="section-title">Your data</h2>
        <p className="muted">
          Progress lives in this browser. You've read {plural(done.size, "source")} and saved {plural(saved.size, "item")}.
          Export a backup before you clear site data.
        </p>
        <div className="button-row">
          <button type="button" className="button" onClick={data.exportJSON}>
            <Download size={15} aria-hidden="true" /> Export JSON
          </button>
          <button type="button" className="button" onClick={data.exportMarkdown}>
            <FileText size={15} aria-hidden="true" /> Export Markdown
          </button>
          <button type="button" className="button" onClick={data.importJSON}>
            <Upload size={15} aria-hidden="true" /> Import
          </button>
          <button type="button" className="button danger" onClick={data.reset}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>
    </div>
  );
}

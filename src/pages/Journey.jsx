import React from "react";
import { ArrowRight, Download, FileText, RotateCcw, Upload } from "lucide-react";
import Painting from "../art/Painting";
import { greeting, MOODS } from "../art/moods";
import { plateFor, terrainFor } from "../art/plates";
import { computePlan } from "../lib/plan";
import { MAX_HOURS, MIN_HOURS } from "../lib/progress";
import { plural } from "../lib/format";
import { buildHash } from "../lib/router";
import { BrushMeter, Check, Entry, Plate, SectionHead } from "../components/ui";
import { roman } from "../lib/format";

export default function Journey({ path, progress, actions, go, data, mood }) {
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

  const waypoints = plan.phases.map((ph) => {
    const status = ph.complete ? "done" : plan.current?.id === ph.id ? "current" : "next";
    return {
      id: ph.id,
      numeral: roman(ph.index + 1),
      label: ph.title,
      status,
      statusText: status === "done" ? "complete" : status === "current" ? `in progress, ${ph.pct}%` : "ahead",
      walked: ph.complete ? 1 : status === "current" ? ph.pct / 100 : 0,
      onSelect: () => {
        setOpen((prev) => new Set(prev).add(ph.id));
        const el = document.getElementById(`chapter-${ph.id}`);
        el?.scrollIntoView({ block: "start" });
        el?.focus({ preventScroll: true });
      },
    };
  });

  const labIndex = (lab) => path.labs.indexOf(lab);
  const nextLabSteps = plan.nextLab ? (progress.steps[plan.nextLab.id] || []).length : 0;

  return (
    <div className="journey">
      <Painting
        seed={`${path.id}:journey`}
        terrain={terrainFor(path.id)}
        mood={mood}
        variant="hero"
        waypoints={waypoints}
        label={`A painted ${terrainFor(path.id) === "alpine" ? "mountain" : "coastal"} landscape at ${MOODS[mood].name.toLowerCase()}, with a road through ${waypoints.length} waypoints, one for each phase of your plan.`}
      >
        <div className="hero-copy">
          <p className="kicker on-sky">{greeting(mood)}</p>
          <h1>{path.title}</h1>
          <p className="hero-lede">{path.lede}</p>
        </div>
      </Painting>

      <div className="page">
        <section className="ledger" aria-label="Where you are">
          <div>
            <span className="ledger-num">{done.size}</span>
            <span className="ledger-label">
              of {path.resources.length} sources read
            </span>
          </div>
          <div>
            <span className="ledger-num">{shipped.size}</span>
            <span className="ledger-label">
              of {path.labs.length} studies finished
            </span>
          </div>
          <div>
            <span className="ledger-num">{plan.totalWeeks}</span>
            <span className="ledger-label">weeks on the road at {progress.hours} hours a week</span>
          </div>
        </section>

        <section className="sheet pace" aria-labelledby="pace-title">
          <h2 id="pace-title" className="sheet-title">
            Set your pace
          </h2>
          <div className="pace-grid">
            <div className="field">
              <span className="field-label" id="goal-label">
                What are you walking towards?
              </span>
              <div className="pills" role="radiogroup" aria-labelledby="goal-label">
                {path.goalIds.map((id) => (
                  <button key={id} type="button" role="radio" aria-checked={progress.goal === id} onClick={() => actions.setGoal(id)}>
                    {path.goals[id].label}
                  </button>
                ))}
              </div>
              <p className="field-note">{plan.goal.note}</p>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="hours">
                Hours each week
                <output htmlFor="hours" className="hours-out">
                  {progress.hours}
                </output>
              </label>
              <input
                id="hours"
                className="brush-range"
                type="range"
                min={MIN_HOURS}
                max={MAX_HOURS}
                step={1}
                value={progress.hours}
                style={{ "--fill": `${((progress.hours - MIN_HOURS) / (MAX_HOURS - MIN_HOURS)) * 100}%` }}
                onChange={(e) => actions.setHours(Number(e.target.value))}
              />
              <div className="range-ends" aria-hidden="true">
                <span>a gentle {MIN_HOURS}</span>
                <span>a devoted {MAX_HOURS}</span>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="today-title">
          <SectionHead id="today-title" title="Today" note={plan.current ? `You are in ${plan.current.title.toLowerCase()}.` : "The road is walked."} />
          {plan.current ? (
            <div className="today">
              <article className="sheet today-card">
                <p className="kicker">On the reading table</p>
                {plan.nextRead ? (
                  <>
                    <h3>
                      <a href={plan.nextRead.url} target="_blank" rel="noopener noreferrer">
                        {plan.nextRead.title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </h3>
                    <p className="byline">
                      {plan.nextRead.source} · {plan.nextRead.type} · {plan.nextRead.time}
                    </p>
                    <p>{plan.nextRead.why}</p>
                    <div className="card-actions">
                      <button type="button" className="btn" onClick={() => actions.toggleRead(plan.nextRead.id)}>
                        I've read it
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Everything for this stretch is read. Finish the study to walk on.</p>
                )}
              </article>
              <article className="sheet today-card easel">
                <p className="kicker">On the easel</p>
                {plan.nextLab ? (
                  <div className="easel-row">
                    <a className="easel-plate" href={buildHash({ pathId: path.id, section: "labs", id: plan.nextLab.id })} tabIndex={-1} aria-hidden="true">
                      <Plate {...plateFor(path.id, plan.nextLab, labIndex(plan.nextLab))} progress={nextLabSteps / plan.nextLab.steps.length} size="mini" />
                    </a>
                    <div>
                      <h3>
                        <a href={buildHash({ pathId: path.id, section: "labs", id: plan.nextLab.id })}>{plan.nextLab.title}</a>
                      </h3>
                      <p className="byline">
                        {nextLabSteps} of {plan.nextLab.steps.length} steps · {plan.nextLab.hours}
                      </p>
                      <p>{plan.nextLab.outcome}</p>
                      <div className="card-actions">
                        <button type="button" className="btn btn-ink" onClick={() => go("labs", plan.nextLab.id)}>
                          {nextLabSteps ? "Return to the easel" : "Begin the study"} <ArrowRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No study left in this stretch. Finish the reading to walk on.</p>
                )}
              </article>
            </div>
          ) : (
            <div className="sheet today-card">
              <h3>Every phase is complete.</h3>
              <p>Time to take the work to market.</p>
              <div className="card-actions">
                <button type="button" className="btn btn-ink" onClick={() => go("offers")}>
                  Open {path.offersLabel.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="chapters-title">
          <SectionHead
            id="chapters-title"
            title="The road, in chapters"
            note={`${plan.totalWeeks} weeks for the ${plan.goal.label.toLowerCase()} path.`}
          />
          <ol className="chapters">
            {plan.phases.map((ph) => {
              const isOpen = open.has(ph.id);
              const status = waypoints[ph.index].status;
              return (
                <li key={ph.id} id={`chapter-${ph.id}`} className={`chapter is-${status}`} tabIndex={-1}>
                  <div className="chapter-numeral" aria-hidden="true">
                    {roman(ph.index + 1)}
                  </div>
                  <div className="chapter-body">
                    <p className="chapter-when">
                      {ph.startWeek === ph.endWeek ? `Week ${ph.startWeek}` : `Weeks ${ph.startWeek}–${ph.endWeek}`} · {ph.hours} hours
                      {ph.emphasis === "focus" && <span className="seal seal-gold">Focus</span>}
                      {ph.emphasis === "skim" && <span className="seal">Skim</span>}
                      {ph.complete && <span className="seal seal-done">Walked</span>}
                    </p>
                    <h3>{ph.title}</h3>
                    <p className="chapter-focus">{ph.focus}</p>
                    <p className="chapter-ship">
                      <span className="try-label">Make</span> {ph.ship}
                    </p>
                    <div className="chapter-progress">
                      <BrushMeter value={ph.pct} label={`${ph.title} progress`} />
                      <span>
                        {ph.read}/{ph.pool.length} read · {ph.labsShipped}/{ph.labs.length} {ph.labs.length === 1 ? "study" : "studies"}
                      </span>
                    </div>
                    <button type="button" className="unfold" aria-expanded={isOpen} aria-controls={`chapter-detail-${ph.id}`} onClick={() => toggleOpen(ph.id)}>
                      {isOpen ? "Fold away" : "Unfold"} the reading and studies
                    </button>
                    {isOpen && (
                      <div id={`chapter-detail-${ph.id}`} className="chapter-detail">
                        <ul className="mini-studies">
                          {ph.labs.map((lab) => (
                            <li key={lab.id}>
                              <Check
                                checked={shipped.has(lab.id)}
                                onClick={() => actions.toggleShipped(lab.id)}
                                label={shipped.has(lab.id) ? `Mark ${lab.title} as not finished` : `Mark ${lab.title} as finished`}
                                size="sm"
                              />
                              <a href={buildHash({ pathId: path.id, section: "labs", id: lab.id })}>
                                <span className="kicker">Study</span> {lab.title}
                              </a>
                              <span className="entry-time">{lab.hours}</span>
                            </li>
                          ))}
                        </ul>
                        <ul className="entries">
                          {ph.pool
                            .slice()
                            .sort((a, b) => Number(b.must) - Number(a.must))
                            .map((r) => (
                              <Entry
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

        <section aria-labelledby="dispatch-title">
          <SectionHead id="dispatch-title" title="Dispatches from 2026" note="What changed this year, and what the road now assumes." />
          <ul className="dispatches">
            {path.fieldNotes.map((note) => (
              <li key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="journal" aria-labelledby="journal-title">
          <h2 id="journal-title" className="sheet-title">
            Your journal
          </h2>
          <p>
            Your progress is kept on this device only. So far: {plural(done.size, "source")} read, {plural(saved.size, "page")} saved.
            Export a copy now and then.
          </p>
          <div className="btn-row">
            <button type="button" className="btn" onClick={data.exportJSON}>
              <Download size={16} aria-hidden="true" /> Export JSON
            </button>
            <button type="button" className="btn" onClick={data.exportMarkdown}>
              <FileText size={16} aria-hidden="true" /> Export Markdown
            </button>
            <button type="button" className="btn" onClick={data.importJSON}>
              <Upload size={16} aria-hidden="true" /> Import
            </button>
            <button type="button" className="btn btn-quiet" onClick={data.reset}>
              <RotateCcw size={16} aria-hidden="true" /> Start over
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

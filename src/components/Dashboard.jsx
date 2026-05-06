import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Flame,
  Library,
  Target,
  Trophy,
} from "lucide-react";
import { usePath } from "../contexts/pathContextValue";

export default function Dashboard({
  resources,
  labs,
  doneResources,
  doneLabs,
  savedResources,
  goToLibrary,
  goToLabs,
  goToPhase,
  goToLibraryIntent,
}) {
  const path = usePath();
  const { topicById, phases, hero } = path;
  const total = resources.length;
  const done = doneResources.size;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const priorityUnread = resources.filter(
    (r) => r.priority === 1 && !doneResources.has(r.id)
  );

  const nextUp = priorityUnread[0] || resources.find((r) => !doneResources.has(r.id));

  const labsLeft = labs.length - doneLabs.size;

  // compute phase progress by counting done resources whose topic is in the phase
  const phaseProgress = phases.map((phase) => {
    const pool = resources.filter((r) => phase.topics.includes(r.topic));
    const poolDone = pool.filter((r) => doneResources.has(r.id)).length;
    return {
      ...phase,
      total: pool.length,
      done: poolDone,
      pct: pool.length ? Math.round((poolDone / pool.length) * 100) : 0,
    };
  });

  const openPriority = () =>
    goToLibraryIntent ? goToLibraryIntent("priority") : goToLibrary && goToLibrary();
  const openSaved = () =>
    goToLibraryIntent ? goToLibraryIntent("saved") : goToLibrary && goToLibrary();

  return (
    <section className="section">
      <div className="hero">
        <div>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>
            {hero.h1Pre}
            <em>{hero.h1Em}</em>
            {hero.h1Post}
          </h1>
          <p className="lede">{hero.lede}</p>
          <div className="hero-stats">
            <button
              type="button"
              className="pill amber clickable"
              onClick={goToLibrary}
              title="Open the library"
            >
              <Library size={12} /> {total} sources
            </button>
            <button
              type="button"
              className="pill cyan clickable"
              onClick={goToLabs}
              title="Open labs"
            >
              <Trophy size={12} /> {labs.length} labs
            </button>
            <button
              type="button"
              className="pill green clickable"
              onClick={goToLibrary}
              title="See completed sources"
            >
              <CheckCircle2 size={12} /> {done} completed
            </button>
            <button
              type="button"
              className="pill violet clickable"
              onClick={openSaved}
              title="See your saved reading queue"
            >
              <Target size={12} /> {savedResources.size} saved
            </button>
          </div>
        </div>

        <aside className="hero-aside">
          <span className="hero-aside-label">Next up</span>
          {nextUp ? (
            <a
              href={nextUp.url}
              target="_blank"
              rel="noreferrer"
              className="next-up"
              style={{ textDecoration: "none" }}
            >
              <span className="title">
                {nextUp.title}
                <ExternalLink size={12} className="ext" />
              </span>
              <span className="meta">
                {nextUp.source} · {nextUp.time} · {nextUp.level}
              </span>
            </a>
          ) : (
            <div className="next-up">
              <span className="title">You've cleared the priority reading list.</span>
              <span className="meta">Move to Labs for shipping proof.</span>
            </div>
          )}
          <button className="btn primary" onClick={goToLibrary}>
            Open library <ArrowRight size={14} />
          </button>
        </aside>
      </div>

      <div className="dashboard-grid">
        <button
          type="button"
          className="kpi clickable"
          onClick={goToLibrary}
          title="Open library"
        >
          <span className="label">Completion</span>
          <span className="value">
            {pct}
            <small>%</small>
          </span>
          <div className="meter">
            <span style={{ width: `${pct}%` }} />
          </div>
          <span className="sub">
            {done} of {total} canonical sources marked done.
          </span>
        </button>
        <button
          type="button"
          className="kpi clickable"
          onClick={goToLabs}
          title="Jump to labs"
        >
          <span className="label">Labs shipped</span>
          <span className="value">
            {doneLabs.size}
            <small>/{labs.length}</small>
          </span>
          <span className="sub">
            {labsLeft === 0
              ? "Every lab shipped. Time to sell."
              : `${labsLeft} remaining — each is a portfolio artifact.`}
          </span>
        </button>
        <button
          type="button"
          className="kpi clickable"
          onClick={openPriority}
          title="Filter library to priority-only"
        >
          <span className="label">
            <Flame size={11} style={{ marginRight: 4 }} />
            Priority reading
          </span>
          <span className="value">
            {priorityUnread.length}
            <small> unread</small>
          </span>
          <span className="sub">
            {priorityUnread[0]
              ? `Next: ${priorityUnread[0].title}`
              : "All priority items complete."}
          </span>
        </button>
        <button
          type="button"
          className="kpi clickable"
          onClick={openSaved}
          title="Open your saved queue"
        >
          <span className="label">
            <Bookmark size={11} style={{ marginRight: 4 }} />
            Saved
          </span>
          <span className="value">
            {savedResources.size}
            <small> queued</small>
          </span>
          <span className="sub">
            {savedResources.size === 0
              ? "Bookmark any source to build a reading queue."
              : "Work through these when you have a quiet block."}
          </span>
        </button>
      </div>

      <div className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Phase progress</span>
            <h2>
              The <em>spine</em> of your plan.
            </h2>
            <p>
              Each phase unlocks the next. Don't rush the early ones — everything
              compounds.
            </p>
          </div>
          <button className="btn" onClick={goToLabs}>
            Jump to labs <ArrowRight size={14} />
          </button>
        </div>

        <div className="phase-rail">
          {phaseProgress.map((phase) => {
            const complete = phase.pct === 100;
            return (
              <button
                key={phase.id}
                type="button"
                className={`phase-rail-item${complete ? " complete" : ""}`}
                onClick={() => goToPhase && goToPhase(phase.id)}
                title={`Open resources for ${phase.title}`}
              >
                <div className="weeks">w{phase.weeks}</div>
                <div>
                  <div className="title">{phase.title}</div>
                  <span className="focus">{phase.focus}</span>
                </div>
                <div style={{ display: "grid", gap: 6, minWidth: 140 }}>
                  <div className="meter">
                    <span style={{ width: `${phase.pct}%` }} />
                  </div>
                  <small style={{ color: "var(--muted)", fontSize: 11 }}>
                    {phase.done}/{phase.total} sources ·{" "}
                    {phase.topics
                      .map((t) => topicById[t]?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </small>
                </div>
                <ChevronRight size={16} className="chev" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

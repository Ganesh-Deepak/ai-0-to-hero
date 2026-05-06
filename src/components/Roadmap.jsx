import React from "react";
import { ArrowRight, CalendarDays, Clock, Sparkles, Zap } from "lucide-react";
import { usePath } from "../contexts/pathContextValue";

export default function Roadmap({
  weeklyHours,
  setWeeklyHours,
  goal,
  setGoal,
  doneCount,
  goToPhase,
}) {
  const path = usePath();
  const { phases, topicById, goals, goalList } = path;
  const activeGoal = goals[goal] || goals[path.defaults.goal] || goalList[0];
  const criticalSet = React.useMemo(
    () => new Set(activeGoal.critical),
    [activeGoal]
  );
  const skipSet = React.useMemo(() => new Set(activeGoal.skip), [activeGoal]);

  const adjustedPhases = React.useMemo(
    () =>
      phases.map((p) => {
        const mult = activeGoal.hourMultiplier?.[p.id] ?? 1;
        const isCritical = p.topics.some((t) => criticalSet.has(t));
        const isLowPriority =
          !isCritical && p.topics.every((t) => skipSet.has(t));
        return {
          ...p,
          adjustedHours: Math.round(p.baseHours * mult),
          isCritical,
          isLowPriority,
          shipAddendum: activeGoal.shipTweak?.[p.id],
        };
      }),
    [phases, activeGoal, criticalSet, skipSet]
  );

  const baseTotal = adjustedPhases.reduce((acc, p) => acc + p.adjustedHours, 0);
  const totalWeeks = Math.max(8, Math.ceil(baseTotal / weeklyHours));

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Learning operating system</span>
          <h2>
            A <em>{totalWeeks}-week</em> path calibrated to you.
          </h2>
          <p>
            Slide the pace. Pick the goal. The same phases stay — but the hours,
            the priority, and the ship artifacts reshape around how you want to
            use this.
          </p>
        </div>
      </div>

      <div className="roadmap-header">
        <div className="pace-controls" style={{ gridColumn: "1", order: 2 }}>
          <div className="pace-field">
            <div className="label">
              <span>
                <Clock size={11} style={{ marginRight: 6, verticalAlign: "-1px" }} />
                Weekly hours
              </span>
              <strong>{weeklyHours}h</strong>
            </div>
            <input
              type="range"
              min="4"
              max="30"
              step="1"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
            />
          </div>
          <div className="pace-field">
            <div className="label">
              <span>
                <CalendarDays
                  size={11}
                  style={{ marginRight: 6, verticalAlign: "-1px" }}
                />
                Goal
              </span>
              <strong>{totalWeeks} wks</strong>
            </div>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              {goalList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="goal-note">
            <em>Note</em>
            {activeGoal.note}
          </div>

          <div className="goal-priorities">
            <div className="rowhead">What matters for this goal</div>
            <div className="row">
              <span className="cue critical">
                <Sparkles size={11} /> Critical
              </span>
              <span className="topic-chips">
                {activeGoal.critical.map((t) => (
                  <span
                    key={t}
                    className="topic-chip"
                    style={{ color: topicById[t]?.color }}
                  >
                    {topicById[t]?.name || t}
                  </span>
                ))}
              </span>
            </div>
            {activeGoal.skip.length > 0 && (
              <div className="row">
                <span className="cue skim">
                  <Zap size={11} /> Skim
                </span>
                <span className="topic-chips">
                  {activeGoal.skip.map((t) => (
                    <span key={t} className="topic-chip muted">
                      {topicById[t]?.name || t}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          <div style={{ paddingTop: 2 }}>
            <small
              style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5 }}
            >
              {doneCount} sources logged. Roughly {Math.round(doneCount * 1.2)}h of
              learning captured so far.
            </small>
          </div>
        </div>
      </div>

      <div className="phase-grid">
        {adjustedPhases.map((phase, idx) => {
          const phaseWeeks = Math.max(
            1,
            Math.ceil(phase.adjustedHours / weeklyHours)
          );
          return (
            <article
              className={`phase-card${phase.isCritical ? " critical" : ""}${phase.isLowPriority ? " low-priority" : ""}`}
              key={phase.id}
            >
              <div className="head">
                <span className="weeks">
                  Phase {idx + 1} · ~{phaseWeeks}w · {phase.adjustedHours}h
                </span>
                <span className="topic-dots">
                  {phase.topics.map((tid) => (
                    <span
                      key={tid}
                      style={{ background: topicById[tid]?.color || "var(--amber)" }}
                      title={topicById[tid]?.name}
                    />
                  ))}
                </span>
              </div>
              {phase.isCritical && (
                <span className="phase-badge critical">
                  <Sparkles size={10} /> Key for your goal
                </span>
              )}
              {phase.isLowPriority && (
                <span className="phase-badge low">
                  <Zap size={10} /> Skim — lower priority for this goal
                </span>
              )}
              <h3>{phase.title}</h3>
              <p className="focus">{phase.focus}</p>
              <div style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.5 }}>
                <strong
                  style={{
                    color: "var(--muted)",
                    fontFamily: "var(--f-mono)",
                    fontSize: 10.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginRight: 6,
                  }}
                >
                  Unlocks
                </strong>
                {phase.unlocks}
              </div>
              <div className="ship">
                <em>Ship</em>
                {phase.ship}
                {phase.shipAddendum && (
                  <div className="addendum">
                    <em>For {activeGoal.label.toLowerCase()}</em>
                    {phase.shipAddendum}
                  </div>
                )}
              </div>
              <button
                className="btn ghost phase-jump"
                onClick={() => goToPhase && goToPhase(phase.id)}
                title={`See resources for ${phase.title}`}
              >
                <span>See this phase's resources</span>
                <ArrowRight size={14} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

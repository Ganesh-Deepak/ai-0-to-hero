// Pure plan math: how goal and weekly hours reshape the phases.

export function computePlan(path, progress) {
  const goal = path.goals[progress.goal] || path.goals[path.defaultGoal];
  const focus = new Set(goal.focus);
  const skim = new Set(goal.skim);
  const done = new Set(progress.done);
  const shipped = new Set(progress.shipped);
  let week = 1;

  const phases = path.phases.map((phase, index) => {
    const hours = Math.round(phase.hours * (goal.hours?.[phase.id] ?? 1));
    const weeks = Math.max(1, Math.ceil(hours / progress.hours));
    const pool = path.resources.filter((r) => phase.topics.includes(r.topic));
    const read = pool.filter((r) => done.has(r.id)).length;
    const labs = path.labs.filter((l) => l.phase === phase.id);
    const labsShipped = labs.filter((l) => shipped.has(l.id)).length;
    const isFocus = phase.topics.some((t) => focus.has(t));
    const isSkim = !isFocus && phase.topics.every((t) => skim.has(t));
    const total = pool.length + labs.length;
    const complete = total > 0 && read === pool.length && labsShipped === labs.length;
    const entry = {
      ...phase,
      index,
      hours,
      weeks,
      startWeek: week,
      endWeek: week + weeks - 1,
      pool,
      read,
      labs,
      labsShipped,
      pct: total ? Math.round(((read + labsShipped) / total) * 100) : 0,
      complete,
      emphasis: isFocus ? "focus" : isSkim ? "skim" : null,
    };
    week += weeks;
    return entry;
  });

  const totalWeeks = week - 1;
  const current = phases.find((p) => !p.complete) || null;
  const nextRead = current
    ? current.pool.find((r) => r.must && !done.has(r.id)) ||
      current.pool.find((r) => !done.has(r.id)) ||
      null
    : null;
  const nextLab = current ? current.labs.find((l) => !shipped.has(l.id)) || null : null;

  return { goal, phases, totalWeeks, current, nextRead, nextLab };
}

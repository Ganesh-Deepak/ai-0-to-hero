import React from "react";
import { ArrowLeft, ArrowRight, Check as CheckIcon, Copy } from "lucide-react";
import { Check, Entry, PageBand, Plate, SectionHead } from "../components/ui";
import { roman } from "../lib/format";
import { plateFor, terrainFor } from "../art/plates";
import { buildHash } from "../lib/router";

export default function Studio(props) {
  const { path, route } = props;
  const lab = route.id ? path.labById[route.id] : null;
  if (route.id && !lab) {
    return (
      <div className="page page-narrow notfound">
        <h1>Lab not found</h1>
        <p>That study isn't in this studio.</p>
        <a className="btn" href={buildHash({ pathId: path.id, section: "labs" })}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to the studio
        </a>
      </div>
    );
  }
  return lab ? <StudyDetail {...props} lab={lab} /> : <Gallery {...props} />;
}

function Gallery({ path, progress, mood }) {
  const shipped = new Set(progress.shipped);
  return (
    <div>
      <PageBand
        seed={`${path.id}:studio`}
        terrain={terrainFor(path.id)}
        mood={mood}
        kicker={`${shipped.size} of ${path.labs.length} finished`}
        title="The Studio"
        lede="Each lab is a canvas. It starts as a pencil sketch and fills with colour as you work through the steps."
      />
      <div className="page">
        <ol className="gallery">
          {path.labs.map((lab, i) => {
            const n = (progress.steps[lab.id] || []).length;
            const finished = shipped.has(lab.id);
            const phase = path.phaseById[lab.phase];
            return (
              <li key={lab.id} className="gallery-item">
                <a href={buildHash({ pathId: path.id, section: "labs", id: lab.id })} className="gallery-link">
                  <Plate {...plateFor(path.id, lab, i)} progress={n / lab.steps.length} finished={finished} />
                  <span className="caption">
                    <span className="caption-plate">
                      Plate {roman(i + 1)} · {phase?.title}
                    </span>
                    <span className="caption-title">{lab.title}</span>
                    <span className="caption-meta">{finished ? "Finished" : `${n} of ${lab.steps.length} steps · ${lab.hours}`}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
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
      className="tool"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {})}
    >
      {copied ? <CheckIcon size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
    </button>
  );
}

function StudyDetail({ path, progress, actions, lab }) {
  const steps = new Set(progress.steps[lab.id] || []);
  const finished = progress.shipped.includes(lab.id);
  const done = new Set(progress.done);
  const saved = new Set(progress.saved);
  const phase = path.phaseById[lab.phase];
  const index = path.labs.indexOf(lab);
  const next = path.labs[index + 1];
  const readings = lab.readings.map((id) => path.resourceById[id]).filter(Boolean);
  const p = steps.size / lab.steps.length;

  return (
    <div className="page study">
      <a className="back" href={buildHash({ pathId: path.id, section: "labs" })}>
        <ArrowLeft size={16} aria-hidden="true" /> All labs
      </a>

      <div className="study-grid">
        <aside className="study-easel">
          <Plate
            {...plateFor(path.id, lab, index)}
            progress={p}
            finished={finished}
            label={`Study for ${lab.title}, ${finished ? "finished in full colour" : `${Math.round(p * 100)}% coloured in`}.`}
          />
          <p className="easel-note">{finished ? "Finished and signed." : `The canvas is ${Math.round(p * 100)}% coloured. Each step you finish adds colour.`}</p>
        </aside>

        <div className="study-text">
          <header>
            <p className="kicker">
              Plate {roman(index + 1)} · {phase?.title}
            </p>
            <h1>{lab.title}</h1>
            <p className="study-lede">{lab.outcome}</p>
          </header>

          <dl className="particulars">
            <div>
              <dt>Done when</dt>
              <dd>{lab.done}</dd>
            </div>
            <div>
              <dt>To show for it</dt>
              <dd>{lab.proof}</dd>
            </div>
            <div>
              <dt>Materials</dt>
              <dd>{lab.stack}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{lab.hours}</dd>
            </div>
          </dl>

          <section aria-labelledby="steps-title">
            <SectionHead id="steps-title" title="Steps" note={`${steps.size} of ${lab.steps.length} done`} />
            <ol className="strokes">
              {lab.steps.map((step, i) => {
                const checked = steps.has(i);
                return (
                  <li key={step.title} className={checked ? "is-done" : undefined}>
                    <Check
                      checked={checked}
                      onClick={() => actions.toggleStep(lab.id, i)}
                      label={checked ? `Mark step ${i + 1} as not done` : `Mark step ${i + 1} as done`}
                    />
                    <div className="stroke-body">
                      <h3>
                        <span className="stroke-num">{roman(i + 1)}.</span> {step.title}
                      </h3>
                      <p>{step.body}</p>
                      {step.code && (
                        <figure className="code">
                          <figcaption>
                            <span>{step.lang}</span>
                            <CopyButton text={step.code} />
                          </figcaption>
                          <pre tabIndex={0}>
                            <code>{step.code}</code>
                          </pre>
                        </figure>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {lab.gotchas?.length > 0 && (
            <aside className="marginalia" aria-labelledby="gotchas-title">
              <h2 id="gotchas-title">A note in the margin</h2>
              {lab.gotchas.map((g) => (
                <p key={g}>{g}</p>
              ))}
            </aside>
          )}

          {readings.length > 0 && (
            <section aria-labelledby="readings-title">
              <SectionHead id="readings-title" title="Read beforehand" />
              <ul className="entries">
                {readings.map((r) => (
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
            </section>
          )}

          <section className={`sheet signoff${finished ? " is-finished" : ""}`} aria-label="Finish this lab">
            <div>
              <h2 className="sheet-title">{finished ? "Finished" : "Ready to finish?"}</h2>
              <p>{finished ? "It's in your portfolio now. Hang it somewhere people will see it." : `Mark it finished once this is true: ${lab.done}`}</p>
            </div>
            <div className="btn-row">
              <button type="button" className={`btn${finished ? "" : " btn-ink"}`} aria-pressed={finished} onClick={() => actions.toggleShipped(lab.id)}>
                {finished ? "Mark as not finished" : "Mark as finished"}
              </button>
              {next && (
                <a className="btn" href={buildHash({ pathId: path.id, section: "labs", id: next.id })}>
                  Next: {next.title} <ArrowRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

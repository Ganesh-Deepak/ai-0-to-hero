import { ArrowRight } from "lucide-react";
import { PageHead } from "../components/ui";
import { buildHash } from "../lib/router";

export default function Offers({ path, progress, actions }) {
  const { niches, steps } = path.offers;
  const niche = niches.find((n) => n.id === progress.niche) || niches[0];
  const shipped = new Set(progress.shipped);
  const isCareer = path.id === "pm";
  const labs = niche.labs.map((id) => path.labById[id]).filter(Boolean);
  const ready = labs.filter((l) => shipped.has(l.id)).length;

  return (
    <div className="container page">
      <PageHead title={path.offersTitle} lede={path.offersLede} />

      <ol className="loop" aria-label="The loop">
        {steps.map(([title, body], i) => (
          <li key={title}>
            <span className="mono loop-n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>

      <div className="niche-layout">
        <div className="niche-picker" role="tablist" aria-label={isCareer ? "Specialisations" : "Niches"}>
          {niches.map((n) => (
            <button
              key={n.id}
              type="button"
              role="tab"
              id={`tab-${n.id}`}
              aria-selected={n.id === niche.id}
              aria-controls="niche-panel"
              tabIndex={n.id === niche.id ? 0 : -1}
              onClick={() => actions.setNiche(n.id)}
              onKeyDown={(e) => {
                const i = niches.indexOf(n);
                const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                if (!dir) return;
                e.preventDefault();
                const target = niches[(i + dir + niches.length) % niches.length];
                actions.setNiche(target.id);
                requestAnimationFrame(() => document.getElementById(`tab-${target.id}`)?.focus());
              }}
            >
              {n.label}
            </button>
          ))}
        </div>

        <article id="niche-panel" role="tabpanel" aria-labelledby={`tab-${niche.id}`} className="panel niche">
          <h2>{niche.label}</h2>
          <dl className="facts">
            <div>
              <dt>{isCareer ? "The challenge" : "Their pain"}</dt>
              <dd>{niche.pain}</dd>
            </div>
            <div>
              <dt>{isCareer ? "What you bring" : "The offer"}</dt>
              <dd>{niche.offer}</dd>
            </div>
            <div>
              <dt>{isCareer ? "First move" : "First project"}</dt>
              <dd>{niche.first}</dd>
            </div>
            <div>
              <dt>{isCareer ? "Compensation" : "Indicative pricing"}</dt>
              <dd className="mono">{niche.price}</dd>
            </div>
            <div>
              <dt>{isCareer ? "Evidence to show" : "Metric to prove"}</dt>
              <dd>{niche.metric}</dd>
            </div>
          </dl>

          <div className="section-head">
            <h3 className="section-title small">Labs to ship</h3>
            <span className="meta mono">
              {ready}/{labs.length} shipped
            </span>
          </div>
          <ol className="niche-labs">
            {labs.map((lab) => (
              <li key={lab.id} className={shipped.has(lab.id) ? "is-shipped" : undefined}>
                <a href={buildHash({ pathId: path.id, section: "labs", id: lab.id })}>
                  <span>{lab.title}</span>
                  <span className="meta mono">{shipped.has(lab.id) ? "Shipped" : lab.hours}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </div>
  );
}

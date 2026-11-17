import { ArrowRight } from "lucide-react";
import Painting from "../art/Painting";
import { MOOD_ORDER } from "../art/moods";
import { terrainFor } from "../art/plates";
import { PageBand, SectionHead } from "../components/ui";
import { roman } from "../lib/format";
import { buildHash } from "../lib/router";

export default function Market({ path, progress, actions, mood }) {
  const { niches, steps } = path.offers;
  const niche = niches.find((n) => n.id === progress.niche) || niches[0];
  const shipped = new Set(progress.shipped);
  const career = path.id === "pm";
  const labs = niche.labs.map((id) => path.labById[id]).filter(Boolean);
  const ready = labs.filter((l) => shipped.has(l.id)).length;

  return (
    <div>
      <PageBand
        seed={`${path.id}:market`}
        terrain={terrainFor(path.id)}
        mood={mood}
        kicker={career ? "Career" : "Offers"}
        title={path.offersTitle}
        lede={path.offersLede}
      />
      <div className="page">
        <section aria-labelledby="m-seasons">
          <SectionHead id="m-seasons" title="Four stages" note="Go through them in order, from dawn to night." />
          <ol className="seasons">
            {steps.map(([title, body], i) => (
              <li key={title}>
                <div className="season-art">
                  <Painting seed={`${path.id}:season:${i}`} terrain={i % 2 ? "coastal" : "alpine"} mood={MOOD_ORDER[i % 4]} variant="mini" />
                </div>
                <p className="kicker">{roman(i + 1)}</p>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="m-commission">
          <SectionHead id="m-commission" title={career ? "Choose a direction" : "Choose a buyer"} />
          <div className="commission-layout">
            <div className="commission-tabs" role="tablist" aria-label={career ? "Specialisations" : "Niches"}>
              {niches.map((n, i) => (
                <button
                  key={n.id}
                  type="button"
                  role="tab"
                  id={`tab-${n.id}`}
                  aria-selected={n.id === niche.id}
                  aria-controls="commission-panel"
                  tabIndex={n.id === niche.id ? 0 : -1}
                  onClick={() => actions.setNiche(n.id)}
                  onKeyDown={(e) => {
                    const dir = ["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : ["ArrowUp", "ArrowLeft"].includes(e.key) ? -1 : 0;
                    if (!dir) return;
                    e.preventDefault();
                    const target = niches[(i + dir + niches.length) % niches.length];
                    actions.setNiche(target.id);
                    requestAnimationFrame(() => document.getElementById(`tab-${target.id}`)?.focus());
                  }}
                >
                  <span className="tab-num">{roman(i + 1)}</span> {n.label}
                </button>
              ))}
            </div>

            <article id="commission-panel" role="tabpanel" aria-labelledby={`tab-${niche.id}`} className="sheet commission">
              <h2>{niche.label}</h2>
              <dl className="particulars">
                <div>
                  <dt>{career ? "The challenge" : "Their pain"}</dt>
                  <dd>{niche.pain}</dd>
                </div>
                <div>
                  <dt>{career ? "What you bring" : "The offer"}</dt>
                  <dd>{niche.offer}</dd>
                </div>
                <div>
                  <dt>{career ? "First move" : "First project"}</dt>
                  <dd>{niche.first}</dd>
                </div>
                <div>
                  <dt>{career ? "Compensation" : "Indicative pricing"}</dt>
                  <dd>{niche.price}</dd>
                </div>
                <div className="span-2">
                  <dt>{career ? "Evidence to show" : "Metric to prove"}</dt>
                  <dd>{niche.metric}</dd>
                </div>
              </dl>
              <h3 className="commission-sub">
                Labs to finish <span>{ready} of {labs.length} done</span>
              </h3>
              <ol className="commission-labs">
                {labs.map((lab) => (
                  <li key={lab.id} className={shipped.has(lab.id) ? "is-finished" : undefined}>
                    <a href={buildHash({ pathId: path.id, section: "labs", id: lab.id })}>
                      <span>{lab.title}</span>
                      <span className="entry-time">{shipped.has(lab.id) ? "Finished" : lab.hours}</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

import { PageBand, SectionHead } from "../components/ui";
import { roman } from "../lib/format";
import { terrainFor } from "../art/plates";

const COST = { low: 1, medium: 2, high: 3, "very high": 4 };

function CostDots({ cost }) {
  const n = COST[cost.toLowerCase()] || 2;
  return (
    <span className="cost" aria-label={`Cost: ${cost}`}>
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className={i <= n ? "on" : undefined} aria-hidden="true" />
      ))}
      <span className="cost-word" aria-hidden="true">
        {cost}
      </span>
    </span>
  );
}

const STRATA = ["#c9b48a", "#b39770", "#9a7c5a", "#7f6650", "#6a5a4b", "#57503f", "#45422f"];

export default function FieldGuide({ path, mood }) {
  const { patterns, failures, playbook, stack } = path.reference;
  return (
    <div>
      <PageBand
        seed={`${path.id}:guide`}
        terrain={terrainFor(path.id) === "alpine" ? "coastal" : "alpine"}
        mood={mood}
        kicker="Keep it open while you work"
        title="Field guide"
        lede="Quick reference: patterns, failure modes, a playbook, and the layers of the stack."
      />
      <div className="page">
        <section aria-labelledby="g-patterns">
          <SectionHead id="g-patterns" numeral="I" title={patterns.title} note={patterns.lede} />
          <ul className="specimens">
            {patterns.rows.map(([name, cost, use, avoid]) => (
              <li key={name} className="sheet specimen">
                <div className="specimen-head">
                  <h3>{name}</h3>
                  <CostDots cost={cost} />
                </div>
                <p>
                  <span className="try-label">Use when</span> {use}
                </p>
                <p>
                  <span className="try-label">Avoid when</span> {avoid}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="g-failures">
          <SectionHead id="g-failures" numeral="II" title={failures.title} note={failures.lede} />
          <dl className="ailments">
            {failures.rows.map(([name, symptom, fix]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>
                  <p className="symptom">{symptom}</p>
                  <p>
                    <span className="try-label">Remedy</span> {fix}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="guide-split">
          <section aria-labelledby="g-playbook">
            <SectionHead id="g-playbook" numeral="III" title={playbook.title} note={playbook.lede} />
            <ol className="rite">
              {playbook.rows.map(([name, detail], i) => (
                <li key={name}>
                  <span className="rite-num" aria-hidden="true">
                    {roman(i + 1)}
                  </span>
                  <div>
                    <h3>{name}</h3>
                    <p>{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="g-stack">
            <SectionHead id="g-stack" numeral="IV" title={stack.title} note={stack.lede} />
            <dl className="strata">
              {stack.rows.map(([name, detail], i) => (
                <div key={name} style={{ "--stratum": STRATA[i % STRATA.length] }}>
                  <dt>{name}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

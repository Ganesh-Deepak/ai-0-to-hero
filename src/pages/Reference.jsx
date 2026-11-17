import { PageHead } from "../components/ui";

export default function Reference({ path }) {
  const { patterns, failures, playbook, stack } = path.reference;
  const sections = [
    ["patterns", patterns.title],
    ["failures", failures.title],
    ["playbook", playbook.title],
    ["stack", stack.title],
  ];
  return (
    <div className="container page">
      <PageHead title="Reference" lede="Cheat sheets to keep open while you work." />

      <nav className="toc" aria-label="On this page">
        {sections.map(([id, title]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              const el = document.getElementById(`ref-${id}`);
              el?.scrollIntoView({ block: "start" });
              el?.focus({ preventScroll: true });
            }}
          >
            {title}
          </button>
        ))}
      </nav>

      <section id="ref-patterns" className="ref-section" tabIndex={-1} aria-labelledby="ref-patterns-h">
        <div className="section-head">
          <h2 id="ref-patterns-h" className="section-title">{patterns.title}</h2>
          <p className="muted">{patterns.lede}</p>
        </div>
        <div className="table-wrap">
          <table className="ref-table">
            <thead>
              <tr>
                {patterns.columns.map((c) => (
                  <th key={c} scope="col">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patterns.rows.map(([name, cost, use, avoid]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td data-label={patterns.columns[1]}>
                    <span className={`cost cost-${cost.toLowerCase().replace(/\s+/g, "-")}`}>{cost}</span>
                  </td>
                  <td data-label={patterns.columns[2]}>{use}</td>
                  <td data-label={patterns.columns[3]}>{avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="ref-failures" className="ref-section" tabIndex={-1} aria-labelledby="ref-failures-h">
        <div className="section-head">
          <h2 id="ref-failures-h" className="section-title">{failures.title}</h2>
          <p className="muted">{failures.lede}</p>
        </div>
        <dl className="diagnosis">
          {failures.rows.map(([name, symptom, fix]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>
                <p>
                  <span className="do-label">Symptom</span> {symptom}
                </p>
                <p>
                  <span className="do-label">Fix</span> {fix}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="ref-split">
        <section id="ref-playbook" className="ref-section" tabIndex={-1} aria-labelledby="ref-playbook-h">
          <div className="section-head stacked">
            <h2 id="ref-playbook-h" className="section-title">{playbook.title}</h2>
            <p className="muted">{playbook.lede}</p>
          </div>
          <ol className="numbered">
            {playbook.rows.map(([name, detail]) => (
              <li key={name}>
                <h3>{name}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="ref-stack" className="ref-section" tabIndex={-1} aria-labelledby="ref-stack-h">
          <div className="section-head stacked">
            <h2 id="ref-stack-h" className="section-title">{stack.title}</h2>
            <p className="muted">{stack.lede}</p>
          </div>
          <dl className="layers">
            {stack.rows.map(([name, detail]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}

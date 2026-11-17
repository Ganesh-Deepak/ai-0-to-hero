import { Check as CheckIcon } from "lucide-react";
import Painting from "../art/Painting";

export function Check({ checked, onClick, label, size = "md" }) {
  return (
    <button type="button" className={`ink-check ink-check--${size}`} aria-pressed={checked} aria-label={label} title={label} onClick={onClick}>
      <CheckIcon size={size === "sm" ? 12 : 14} strokeWidth={2.75} aria-hidden="true" />
    </button>
  );
}

export function BrushMeter({ value, label }) {
  return (
    <div className="brush-meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
      <span style={{ width: `${Math.max(value, 0)}%` }} />
    </div>
  );
}

function Ribbon({ on }) {
  return (
    <svg viewBox="0 0 16 22" width="14" height="19" aria-hidden="true" focusable="false">
      <path d="M2 1h12v19l-6-5-6 5z" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function Entry({ resource, topicName, done, saved, onToggleRead, onToggleSaved, compact = false }) {
  return (
    <li className={`entry${done ? " is-read" : ""}${compact ? " is-compact" : ""}`}>
      <Check
        checked={done}
        onClick={() => onToggleRead(resource.id)}
        label={done ? `Mark “${resource.title}” as unread` : `Mark “${resource.title}” as read`}
        size={compact ? "sm" : "md"}
      />
      <div className="entry-body">
        <div className="entry-line">
          <a className="entry-title" href={resource.url} target="_blank" rel="noopener noreferrer">
            {resource.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <span className="leader" aria-hidden="true" />
          <span className="entry-time">{resource.time}</span>
        </div>
        <p className="entry-meta">
          {resource.must && <span className="seal">Core</span>}
          <span className="entry-author">{resource.source}</span>
          <span aria-hidden="true"> · </span>
          <span>{resource.type}</span>
          {topicName && (
            <>
              <span aria-hidden="true"> · </span>
              <span>{topicName}</span>
            </>
          )}
        </p>
        {!compact && (
          <>
            <p className="entry-why">{resource.why}</p>
            <p className="entry-try">
              <span className="try-label">Try</span> {resource.todo}
            </p>
          </>
        )}
      </div>
      {onToggleSaved && (
        <button
          type="button"
          className="ribbon"
          aria-pressed={saved}
          aria-label={saved ? `Remove “${resource.title}” from saved` : `Save “${resource.title}” for later`}
          title={saved ? "Saved" : "Save for later"}
          onClick={() => onToggleSaved(resource.id)}
        >
          <Ribbon on={saved} />
        </button>
      )}
    </li>
  );
}

// A painted band across the top of a page, with the title in its sky.
export function PageBand({ seed, terrain, mood, kicker, title, lede, label }) {
  return (
    <Painting seed={seed} terrain={terrain} mood={mood} variant="band" label={label}>
      <div className="band-copy">
        {kicker && <p className="kicker on-sky">{kicker}</p>}
        <h1>{title}</h1>
        {lede && <p className="band-lede">{lede}</p>}
      </div>
    </Painting>
  );
}

// A framed study whose colour comes in as the work progresses.
export function Plate({ seed, terrain, mood, progress, finished, size = "plate", label }) {
  const p = finished ? 1 : progress;
  const style = {
    "--sepia": ((1 - p) * 0.18).toFixed(3),
    "--sketch": (1 - p).toFixed(3),
  };
  return (
    <div className={`frame${finished ? " is-finished" : ""}`} style={style}>
      <div className="mat">
        <Painting seed={seed} terrain={terrain} mood={mood} variant={size} label={label} className="plate-art" />
      </div>
    </div>
  );
}

export function SectionHead({ numeral, title, note, id }) {
  return (
    <div className="section-head">
      {numeral && <span className="section-numeral" aria-hidden="true">{numeral}</span>}
      <h2 id={id}>{title}</h2>
      {note && <p className="section-note">{note}</p>}
      <svg className="brush-rule" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M2 7 C60 3 110 9 170 6 S300 2 398 6" />
      </svg>
    </div>
  );
}

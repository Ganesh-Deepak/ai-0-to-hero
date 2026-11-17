import { Bookmark, Check, ExternalLink } from "lucide-react";

export function Meter({ value, label }) {
  return (
    <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

export function CheckButton({ checked, onClick, label }) {
  return (
    <button type="button" className="check" aria-pressed={checked} aria-label={label} title={label} onClick={onClick}>
      <Check size={13} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}

export function ResourceRow({ resource, topicName, done, saved, onToggleRead, onToggleSaved, compact = false }) {
  return (
    <li className={`resource${done ? " is-done" : ""}${compact ? " is-compact" : ""}`}>
      <CheckButton
        checked={done}
        onClick={() => onToggleRead(resource.id)}
        label={done ? `Mark “${resource.title}” as unread` : `Mark “${resource.title}” as read`}
      />
      <div className="resource-body">
        <a className="resource-title" href={resource.url} target="_blank" rel="noopener noreferrer">
          {resource.title}
          <ExternalLink size={12} aria-hidden="true" className="ext" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <div className="meta">
          {resource.must && <span className="tag">Core</span>}
          <span>{resource.source}</span>
          <span aria-hidden="true">·</span>
          <span>{resource.type}</span>
          <span aria-hidden="true">·</span>
          <span className="mono">{resource.time}</span>
          {topicName && (
            <>
              <span aria-hidden="true">·</span>
              <span>{topicName}</span>
            </>
          )}
        </div>
        {!compact && (
          <>
            <p className="resource-why">{resource.why}</p>
            <p className="resource-do">
              <span className="do-label">Do</span> {resource.todo}
            </p>
          </>
        )}
      </div>
      {onToggleSaved && (
        <button
          type="button"
          className="icon-button save"
          aria-pressed={saved}
          aria-label={saved ? `Remove “${resource.title}” from saved` : `Save “${resource.title}” for later`}
          title={saved ? "Saved" : "Save for later"}
          onClick={() => onToggleSaved(resource.id)}
        >
          <Bookmark size={15} aria-hidden="true" />
        </button>
      )}
    </li>
  );
}

export function PageHead({ title, lede, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {children}
    </div>
  );
}

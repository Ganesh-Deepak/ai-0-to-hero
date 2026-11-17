import { formatDate } from "../lib/format";

export default function Footer({ path }) {
  return (
    <footer className="colophon">
      <svg className="colophon-ridge" viewBox="0 0 1600 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 80 L0 52 C120 30 210 44 300 36 S470 6 560 22 S720 54 820 40 S1000 2 1110 18 S1290 50 1380 36 S1520 20 1600 30 L1600 80 Z" />
      </svg>
      <div className="colophon-inner">
        <p className="colophon-mark">
          0 <span aria-hidden="true">→</span> Hero
        </p>
        <p>
          Paintings are generated in your browser and change with the hour. Content reviewed {formatDate(path.reviewed)}. Your
          progress stays on this device.
        </p>
      </div>
    </footer>
  );
}

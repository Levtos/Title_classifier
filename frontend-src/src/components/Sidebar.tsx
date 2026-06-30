import { PAGES, type PageId } from "../pages/registry";

interface Props {
  current: PageId;
  onSelect: (id: PageId) => void;
}

export function Sidebar({ current, onSelect }: Props) {
  return (
    <aside className="tc-sidebar">
      <div className="tc-brand">
        <div className="logo">TC</div>
        <div>
          <div className="title">Title Classifier</div>
          <div className="sub">v3 · Verwaltung</div>
        </div>
      </div>
      <nav className="tc-nav">
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={p.id === current ? "active" : ""}
            onClick={() => onSelect(p.id)}
            title={p.desc}
          >
            <span className="ico">{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </nav>
      <div className="foot">Title Classifier v3.1 · UX</div>
    </aside>
  );
}

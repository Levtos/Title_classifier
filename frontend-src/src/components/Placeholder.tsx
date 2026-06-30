interface Props {
  title: string;
  note: string;
}

/** Temporary page body for the PR1 scaffold — replaced page by page. */
export function Placeholder({ title, note }: Props) {
  return (
    <div className="tc-page">
      <div className="tc-card tc-placeholder">
        <h2>{title}</h2>
        <p>{note}</p>
      </div>
    </div>
  );
}

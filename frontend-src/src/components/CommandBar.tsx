import { useRef } from "react";
import { toggleHaMenu } from "../ha";

interface Props {
  title: string;
  desc: string;
}

export function CommandBar({ title, desc }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="tc-cmdbar">
      <button
        ref={btnRef}
        className="tc-btn tc-menu-btn"
        title="Menü"
        onClick={() => btnRef.current && toggleHaMenu(btnRef.current)}
      >
        ☰
      </button>
      <div>
        <h1>{title}</h1>
        <div className="desc">{desc}</div>
      </div>
      <div className="spacer" />
    </div>
  );
}

interface Props {
  value: number;
  onChange: (value: number) => void;
  dirty?: boolean;
  disabled?: boolean;
}

const OPTIONS = Array.from({ length: 10 }, (_, i) => i);

export function EnumSelect({ value, onChange, dirty, disabled }: Props) {
  return (
    <select
      className={`tc-select tc-enum-select ${dirty ? "dirty" : ""}`}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      onClick={(e) => e.stopPropagation()}
    >
      {OPTIONS.map((i) => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
  );
}

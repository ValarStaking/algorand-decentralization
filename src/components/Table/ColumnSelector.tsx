import { useEffect, useRef } from "react";

export interface ColumnSelectorProps<T extends string> {
  visibleColumns: Record<T, boolean>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Record<T, boolean>>>;
  onClose: () => void;
  columnLabels: Record<T, string>;
  disabledColumns?: T[];
}

export default function ColumnSelector<T extends string>({
  visibleColumns,
  setVisibleColumns,
  onClose,
  columnLabels,
  disabledColumns = [],
}: ColumnSelectorProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  const toggle = (key: T) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-valar-gray-200 bg-white p-4 shadow-medium"
    >
      <h4 className="mb-3 text-sm font-semibold text-valar-gray-900">Show Columns</h4>
      <div className="space-y-2">
        {(Object.keys(columnLabels) as T[]).map((key) => {
          const disabled = disabledColumns.includes(key);
          return (
            <label key={key} className="flex cursor-pointer items-center space-x-3">
              <input
                type="checkbox"
                checked={visibleColumns[key]}
                onChange={() => toggle(key)}
                disabled={disabled}
                className="text-valar-blue-600 focus:ring-valar-blue-500/20 h-4 w-4 rounded border-valar-gray-300 focus:ring-2"
              />
              <span className={`text-sm ${disabled ? "text-valar-gray-400" : "text-valar-gray-700"}`}>
                {columnLabels[key]}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

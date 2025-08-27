import React, { useEffect, useRef, useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  delay?: number; // in ms
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 300 }) => {
  const [visible, setVisible] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    const timeout = setTimeout(() => setVisible(true), delay);
    setHoverTimeout(timeout);
  };

  const hideTooltip = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setVisible(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      hideTooltip();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onClick={() => setVisible((prev) => !prev)}
      ref={ref}
    >
      {children}
      {visible && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-xl bg-neutral-800 px-4 py-2 text-sm text-white shadow-lg transition-opacity duration-300">
          {content}
          <div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 -translate-y-full border-x-8 border-b-8 border-x-transparent border-b-neutral-800" />
        </div>
      )}
    </div>
  );
};

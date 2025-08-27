import { DisplayData, JointStats } from "@/lib/types";
import { formatIfAddress, formatNumber } from "@/utils/formatting";
import { useEffect, useRef } from "react";

// Legend component for external use
interface LegendProps {
  data: DisplayData[];
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  onSegmentClick?: (index: number) => void;
  displayDataType: keyof JointStats;
}

export const Legend: React.FC<LegendProps> = ({ data, hoveredIndex, onHover, onSegmentClick, displayDataType }) => {
  const legendRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to hovered item
  useEffect(() => {
    if (hoveredIndex !== null && legendRefs.current[hoveredIndex] && containerRef.current) {
      const legendItem = legendRefs.current[hoveredIndex];
      const container = containerRef.current;

      const itemTop = legendItem.offsetTop;
      const itemHeight = legendItem.offsetHeight;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // Check if item is not fully visible
      if (itemTop < containerScrollTop || itemTop + itemHeight > containerScrollTop + containerHeight) {
        legendItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [hoveredIndex]);

  const handleLegendClick = (index: number) => {
    if (onSegmentClick) {
      onSegmentClick(index);
    }
  };

  return (
    <div ref={containerRef} className="flex h-[360px] flex-col space-y-2 overflow-y-auto px-4 py-2">
      {data.map((segment, index) => (
        <div
          key={index}
          ref={(el) => (legendRefs.current[index] = el)}
          className={`flex items-center justify-between rounded-xl border p-3 transition-all duration-300 ${
            segment.label !== "Others" && onSegmentClick ? "cursor-pointer" : ""
          } ${
            hoveredIndex === index
              ? "scale-105 transform border-primary-200 bg-primary-50 shadow-soft"
              : "border-neutral-200 hover:border-neutral-200 hover:bg-neutral-50 hover:shadow-soft"
          }`}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
          onClick={segment.label !== "Others" && onSegmentClick ? () => handleLegendClick(index) : undefined}
        >
          <div className="flex w-full flex-1 items-center space-x-3">
            <div className="relative flex-shrink-0">
              <div
                className={`h-4 w-4 rounded-full shadow-sm transition-all duration-300 ${
                  hoveredIndex === index ? "scale-125 shadow-md" : ""
                }`}
                style={{ backgroundColor: segment.color }}
              ></div>
              {hoveredIndex === index && (
                <div
                  className="absolute inset-0 h-4 w-4 animate-ping rounded-full"
                  style={{ backgroundColor: segment.color, opacity: 0.4 }}
                ></div>
              )}
            </div>
            <span
              className={`break-words text-sm font-medium text-neutral-900 transition-all duration-300 sm:w-[240px] ${
                hoveredIndex === index ? "font-semibold" : ""
              }`}
              title={segment.label}
            >
              {formatIfAddress(segment.label)}
            </span>
          </div>
          <div className="ml-3 flex min-h-[2.25rem] flex-shrink-0 flex-col justify-center text-right">
            <div
              className={`text-sm font-semibold text-neutral-900 transition-all duration-300 ${
                hoveredIndex === index ? "text-primary-600" : ""
              }`}
            >
              {displayDataType === "algo" ? formatNumber(segment.percentage) + "%" : formatNumber(segment.value, 2)}
            </div>
            {displayDataType === "algo" && (
              <div className="text-xs font-medium text-neutral-500">{formatNumber(segment.value)}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

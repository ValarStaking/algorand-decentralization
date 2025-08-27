import { DisplayData } from "@/lib/types";
import { formatIfAddress, formatNumber } from "@/utils/formatting";
import React, { useEffect, useRef, useState } from "react";

interface PieChartProps {
  data: DisplayData[];
  size?: number;
  centerText?: string;
  centerSubtext?: string;
  hoveredIndex?: number | null;
  onHover?: (index: number | null) => void;
  onSegmentClick?: (index: number) => void;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 320,
  centerText,
  centerSubtext,
  hoveredIndex = null,
  onHover,
  onSegmentClick,
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(size);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const measured = Math.min(entry.contentRect.width, size);
        const next = Math.max(120, Math.round(measured));
        setContainerSize((prev) => (Math.round(prev) === next ? prev : next));
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [size]);

  const radius = containerSize / 2 - 30;
  const hoverRadius = radius + 12;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  // Reset hoveredIndex if data changes or becomes invalid
  useEffect(() => {
    if (!data || data.length === 0 || (hoveredIndex !== null && hoveredIndex >= data.length)) {
      if (onHover) onHover(null);
    }
  }, [data, hoveredIndex, onHover]);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 250;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(easeOutCubic);
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Early return if data is not available or empty
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neutral-500">No data available</div>
      </div>
    );
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArcPath = (startAngle: number, endAngle: number, radius: number, isHovered: boolean = false) => {
    const actualRadius = isHovered ? hoverRadius : radius;
    const sweepAngle = endAngle - startAngle;

    // Special case: full circle
    if (Math.abs(sweepAngle) >= 360) {
      return `
      M ${centerX},${centerY}
      m -${actualRadius},0
      a ${actualRadius},${actualRadius} 0 1,0 ${actualRadius * 2},0
      a ${actualRadius},${actualRadius} 0 1,0 -${actualRadius * 2},0
    `;
    }
    const start = polarToCartesian(centerX, centerY, actualRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, actualRadius, startAngle);
    const largeArcFlag = sweepAngle <= 180 ? "0" : "1";
    return [
      "M",
      centerX,
      centerY,
      "L",
      start.x,
      start.y,
      "A",
      actualRadius,
      actualRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const getGradientId = (index: number) => `gradient-${index}`;
  const handleSegmentClick = (index: number) => onSegmentClick && onSegmentClick(index);

  let cumulativePercentage = 0;

  return (
    <div ref={containerRef} className="relative mx-auto" style={{ width: "100%", maxWidth: size }}>
      <svg
        width={containerSize}
        height={containerSize}
        viewBox={`0 0 ${containerSize} ${containerSize}`}
        preserveAspectRatio="xMidYMid meet"
        className="-rotate-90 transform drop-shadow-lg"
      >
        <defs>
          {data.map((segment, index) => (
            <radialGradient key={index} id={getGradientId(index)} cx="30%" cy="30%">
              <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
              <stop offset="100%" stopColor={segment.color} stopOpacity="0.85" />
            </radialGradient>
          ))}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.1)" />
          </filter>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {data.map((segment, index) => {
          const startAngle = cumulativePercentage * 3.6;
          const animatedEndAngle = (cumulativePercentage + segment.percentage * animationProgress) * 3.6;
          const isHovered = hoveredIndex === index;
          const pathD = createArcPath(startAngle, animatedEndAngle, radius, isHovered);
          cumulativePercentage += segment.percentage;

          return (
            <g key={index}>
              <path
                d={pathD}
                fill={`url(#${getGradientId(index)})`}
                filter={isHovered ? "url(#glow)" : "url(#shadow)"}
                className={`transition-all duration-300 ease-out ${segment.label !== "Others" && onSegmentClick ? "cursor-pointer" : ""}`}
                style={{
                  transform: isHovered ? "scale(1.03)" : "scale(1)",
                  transformOrigin: `${centerX}px ${centerY}px`,
                }}
                onMouseEnter={() => onHover && onHover(index)}
                onMouseLeave={() => onHover && onHover(null)}
                onClick={segment.label !== "Others" && onSegmentClick ? () => handleSegmentClick(index) : undefined}
              />
            </g>
          );
        })}
      </svg>

      {(centerText || centerSubtext) && (
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ width: containerSize, height: containerSize }}
        >
          {centerText && (
            <div className="mb-1 text-3xl font-bold text-neutral-900 transition-all duration-300">
              {hoveredIndex !== null && data[hoveredIndex] ? formatNumber(data[hoveredIndex].value) : centerText}
            </div>
          )}
          {centerSubtext && (
            <div className="text-sm font-medium text-neutral-600 transition-all duration-300">
              {hoveredIndex !== null && data[hoveredIndex] ? formatIfAddress(data[hoveredIndex].label) : centerSubtext}
            </div>
          )}
          {hoveredIndex !== null && data[hoveredIndex] && (
            <div className="mt-1 text-lg font-bold text-primary-600">{data[hoveredIndex].percentage.toFixed(1)}%</div>
          )}
        </div>
      )}
    </div>
  );
};

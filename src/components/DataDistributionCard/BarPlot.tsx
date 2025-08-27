import { formatNumber } from "@/utils/formatting";
import React, { useEffect, useId, useRef, useState } from "react";

export interface BarPlotData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface BarPlotProps {
  data: BarPlotData[];
  size?: number;
  hoveredIndex?: number | null;
  onHover?: (index: number | null) => void;
  onSegmentClick?: (index: number) => void;
}

export const BarPlot: React.FC<BarPlotProps> = ({ data, size = 320, hoveredIndex = null, onHover, onSegmentClick }) => {
  const [animationProgress, setAnimationProgress] = useState(0.08);
  const animationRef = useRef<number>();
  const reactId = useId().replace(/:/g, "_");
  const chartId = `bar_${reactId}`;

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

  // Derived layout from containerSize (keeps proportions when shrinking)
  const width = containerSize;
  const height = containerSize;
  const scale = containerSize / size;
  const margin = {
    top: 24 * scale,
    right: 16 * scale,
    bottom: 44 * scale,
    left: 32 * scale,
  };
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Reset hoveredIndex if data changes or becomes invalid
  useEffect(() => {
    if (!data || data.length === 0 || (hoveredIndex !== null && hoveredIndex >= data.length)) {
      if (onHover) onHover(null);
    }
  }, [data, hoveredIndex, onHover]);

  // Intro animation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 1100;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(0.08 + easeOutCubic * (1 - 0.08));
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Early return if no data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neutral-500">No data available</div>
      </div>
    );
  }

  // Scales
  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const barSlot = innerWidth / data.length;
  const barWidth = Math.max(8 * scale, barSlot * 0.6);
  const barGap = Math.max(0, barSlot - barWidth);

  const xFor = (i: number) => margin.left + i * (barWidth + barGap) + barGap / 2;
  const hFor = (v: number) => (v / maxValue) * innerHeight;
  const yFor = (v: number) => margin.top + (innerHeight - hFor(v));

  const getGradientId = (index: number) => `bar-gradient-${index}`;
  const getGlowId = () => `${chartId}-glow`;

  const handleBarClick = (index: number) => {
    if (onSegmentClick) onSegmentClick(index);
  };

  const minBarHeight = 3 * scale;

  return (
    <div ref={containerRef} className="relative mx-auto" style={{ width: "100%", maxWidth: size }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="transform drop-shadow-lg"
      >
        <defs>
          {data.map((d, i) => (
            <linearGradient key={i} id={getGradientId(i)} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={d.color} stopOpacity={1} />
              <stop offset="100%" stopColor={d.color} stopOpacity={0.9} />
            </linearGradient>
          ))}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation={6 * scale} floodColor="rgba(0,0,0,0.1)" />
          </filter>

          <filter id={getGlowId()} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={3 * scale} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Axis baseline */}
        <g>
          <line
            x1={margin.left - 4 * scale}
            y1={margin.top + innerHeight + 0.5}
            x2={width - margin.right}
            y2={margin.top + innerHeight + 0.5}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={1}
          />
        </g>

        {/* Bars */}
        {data.map((d, i) => {
          const isHovered = hoveredIndex === i;
          const scaledValue = d.value * animationProgress;
          const rawHeight = hFor(scaledValue);
          const heightForPaint = d.value > 0 ? Math.max(rawHeight, minBarHeight) : 0;
          const barYBase = yFor(scaledValue);
          const barX = xFor(i);
          const barY = d.value > 0 ? barYBase - (heightForPaint - rawHeight) : barYBase;

          const rx = Math.min(10 * scale, barWidth / 3);

          return (
            <g key={i} filter={isHovered ? `url(#${getGlowId()})` : undefined}>
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={heightForPaint}
                rx={rx}
                fill={d.color}
                opacity={0.98}
                className={d.label !== "Others" && onSegmentClick ? "cursor-pointer" : ""}
                onMouseEnter={() => onHover?.(i)}
                onMouseLeave={() => onHover?.(null)}
                onClick={d.label !== "Others" && onSegmentClick ? () => handleBarClick(i) : undefined}
              />
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={heightForPaint}
                rx={rx}
                fill={`url(#${getGradientId(i)})`}
                pointerEvents="none"
                style={{
                  transform: isHovered ? "translateY(-2px) scale(1.02)" : "translateY(0) scale(1)",
                  transformOrigin: `${barX + barWidth / 2}px ${margin.top + innerHeight}px`,
                  transition: "transform 300ms ease-out",
                }}
              />

              {/* Value labels on top (fade/slide in) */}
              {heightForPaint > 14 * scale && (
                <text
                  x={barX + barWidth / 2}
                  y={barY - 6 * scale}
                  textAnchor="middle"
                  className={`select-none`}
                  style={{
                    fontSize: `${11 * scale}px`,
                    fill: isHovered ? "rgb(37 99 235)" : "rgb(64 64 64)",
                    transition: "fill 300ms",
                  }}
                >
                  {formatNumber(d.value)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

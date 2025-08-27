import { cn } from "@/lib/shadcn-utils";

const LoadingThinSpinner = ({ visible = true, className }: { visible?: boolean; className?: string }) => {
  return (
    visible && (
      <div className={cn("", className)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
            <stop offset="0" stopColor="currentColor"></stop>
            <stop offset=".3" stopColor="currentColor" stopOpacity=".9"></stop>
            <stop offset=".6" stopColor="currentColor" stopOpacity=".6"></stop>
            <stop offset=".8" stopColor="currentColor" stopOpacity=".3"></stop>
            <stop offset="1" stopColor="currentColor" stopOpacity="0"></stop>
          </radialGradient>
          <circle
            transform-origin="center"
            fill="none"
            stroke="url(#a12)"
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray="200 1000"
            strokeDashoffset="0"
            cx="100"
            cy="100"
            r="70"
          >
            <animateTransform
              type="rotate"
              attributeName="transform"
              calcMode="spline"
              dur="1"
              values="360;0"
              keyTimes="0;1"
              keySplines="0 0 1 1"
              repeatCount="indefinite"
            ></animateTransform>
          </circle>
          <circle
            transform-origin="center"
            fill="none"
            opacity=".2"
            stroke="currentColor"
            strokeWidth="15"
            strokeLinecap="round"
            cx="100"
            cy="100"
            r="70"
          ></circle>
        </svg>
      </div>
    )
  );
};

export default LoadingThinSpinner;

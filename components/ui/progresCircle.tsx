import React from "react";

type ProgressCircleProps = {
  percentage: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
};

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  label,
  size = 100,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <svg width={size} height={size}>
        <circle
          stroke="#E5E7EB" // Tailwind gray-200
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="#4F46E5" // Tailwind indigo-600
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-500"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="1rem"
          className="fill-gray-800"
        >
          {percentage}%
        </text>
      </svg>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
};

export default ProgressCircle;

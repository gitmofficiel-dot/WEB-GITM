import React from 'react';

// A simple, dependency-free bar chart component using CSS
export const SimpleBarChart = ({ data, height = 200, color = 'from-cyan-500 to-emerald-500' }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

  return (
    <div className="w-full flex flex-col" style={{ height: `${height}px` }}>
      <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 relative overflow-hidden pb-6">
        {data.map((item, idx) => {
          const heightPct = (item.value / maxValue) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end group h-full relative">
              {/* Tooltip */}
              <div className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                {item.label}: {item.value}
              </div>
              
              {/* Bar */}
              <div 
                className={`w-full max-w-[40px] rounded-t-sm bg-gradient-to-t ${color} transition-all duration-1000 ease-out`}
                style={{ height: `${heightPct}%`, minHeight: '4px' }}
              ></div>
              
              {/* Label */}
              <span className="absolute -bottom-6 text-xs text-gray-400 rotate-[-45deg] origin-top-left md:rotate-0 md:origin-center truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// A simple progress ring component using SVG
export const ProgressRing = ({ radius = 40, stroke = 8, progress = 0, color = 'text-cyan-500' }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress ring */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={color}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{progress}%</span>
      </div>
    </div>
  );
};

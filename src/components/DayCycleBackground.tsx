import React, { useEffect, useState } from "react";
import "./DayCycleBackground.css";

const frames = [
  { name: "morning", src: "/assets/bg-morning.jpg" },
  { name: "midday",  src: "/assets/bg-midday.jpg" },
  { name: "sunset",  src: "/assets/bg-sunset.jpg" },
  { name: "night",   src: "/assets/bg-night.jpg" },
];

function getFrameIndexByHour(hour: number): number {
  if (hour >= 6 && hour < 12) return 0;
  if (hour >= 12 && hour < 17) return 1;
  if (hour >= 17 && hour < 20) return 2;
  return 3;
}

export const DayCycleBackground: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(getFrameIndexByHour(new Date().getHours()));

  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setCurrentIndex(getFrameIndexByHour(hour));
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="day-cycle-background">
      {frames.map((frame, idx) => (
        <div
          key={frame.name}
          className={`day-cycle-frame frame-${frame.name} ${idx === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${frame.src})` }}
        />
      ))}
      <div className="warm-bloom-overlay" />
    </div>
  );
};

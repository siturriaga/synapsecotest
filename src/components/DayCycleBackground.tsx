import React, { useEffect, useState } from "react";
import "./DayCycleBackground.css";

const frames = [
  { name: "morning", className: "frame-morning" },
  { name: "midday", className: "frame-midday" },
  { name: "sunset", className: "frame-sunset" },
  { name: "night", className: "frame-night" }
];

function frameIndexByHour(h: number) {
  if (h >= 6 && h < 12) return 0;
  if (h >= 12 && h < 17) return 1;
  if (h >= 17 && h < 20) return 2;
  return 3;
}

export default function DayCycleBackground() {
  const [idx, setIdx] = useState(frameIndexByHour(new Date().getHours()));
  useEffect(() => {
    const t = setInterval(() => setIdx(frameIndexByHour(new Date().getHours())), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="day-cycle-background">
      {frames.map((f, i) => (
        <div
          key={f.name}
          className={`day-cycle-frame ${f.className} ${i === idx ? "active" : ""}`.trim()}
          aria-hidden="true"
        />
      ))}
      <div className="warm-bloom-overlay" />
    </div>
  );
}

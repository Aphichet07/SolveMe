import React, { useMemo } from "react";
import Bubble from "./bubble";

export default function BubbleCloud({ items, isLoading }) {
  if (isLoading) {
    return (
      <div className="mt-4 text-xs text-slate-500">
        กำลังโหลดฟองสบู่ปัญหา…
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="mt-4 text-xs text-slate-500">
        ยังไม่มีปัญหาในระยะนี้
      </div>
    );
  }

  const positioned = useMemo(() => {
    const n = items.length;
    const centerX = 50;
    const centerY = 50;

    return items.map((item, index) => {
      const angle = (index / n) * Math.PI * 2; 

      const ring = index % 3; 
      const radiusPercent = 8 + ring * 10; 

      const x = centerX + Math.cos(angle) * radiusPercent;
      const y = centerY + Math.sin(angle) * radiusPercent * 0.7; 

      return {
        ...item,
        x,
        y,
      };
    });
  }, [items]);

  return (
    <div className="mt-4 relative w-full h-80">
      <div className="absolute inset-0 rounded-3xl bg-slate-100/60" />

      {positioned.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            top: `${b.y}%`,
            left: `${b.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Bubble
            title={b.title}
            description={b.description}
            profile={b.profile}
            distanceText={b.distanceText}
            priority={b.priority}
          />
        </div>
      ))}
    </div>
  );
}

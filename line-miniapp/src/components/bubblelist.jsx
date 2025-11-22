// components/BubbleList.jsx
import React from "react";
import Bubble from "./bubble";

export default function BubbleList({ items, isLoading }) {
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

  return (
    <div
      className="
        mt-4
        flex flex-wrap
        gap-3
        justify-center
      "
    >
      {items.map((b) => (
        <Bubble
          key={b.id}
          title={b.title}
          description={b.description}
          profile={b.profile}
          distanceText={b.distanceText}
          priority={b.priority}
        />
      ))}
    </div>
  );
}

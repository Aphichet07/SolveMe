
import React from "react";
import "../App.css"
function Test({ profile }) {
  if (!profile) return null; 

  return (
    <div className="flex items-center gap-4 mb-6">
      <img
        src={profile.pictureUrl}
        alt="avatar"
        className="w-14 h-14 rounded-full border border-slate-200"
      />
      <div>
        <div className="font-semibold text-slate-800">
          {profile.displayName}
        </div>
        <div className="text-xs text-slate-500 break-all">
          LINE userId: {profile.userId}
        </div>
      </div>
    </div>
  );
}

export default HomePage
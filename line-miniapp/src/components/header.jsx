import React from "react";
import "../index.css"

export default function Header() {
    return (
        <header className="bg-white">
            <div className="h-12 px-4 flex items-center justify-between">
          
                <div>
                    <span className="text-2xl text-green-400 font-bold">SOLVE</span>
                    <span className="text-sm text-gray-800 font-bold">ME</span>
                </div>

            
                <div className="flex items-center gap-3">
                    <button className="w-4 h-4 rounded-full border border-gray-600" />
                    <button className="w-4 h-4 rounded-full border border-gray-600" />
                </div>
            </div>
        </header>
    );

}
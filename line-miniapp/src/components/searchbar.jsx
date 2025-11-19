import React from "react";
import "../index.css"

export default function SearchBar() {
    return (
        <div className="w-full">
            <input
                type="search"
                name="word_finder"
                placeholder="ค้นหา"
                className="w-full h-9 rounded-md bg-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
            />
        </div>
    );
}
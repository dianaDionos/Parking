import React from "react";
import { FaChevronLeft, FaChevronRight, FaListOl } from "react-icons/fa";

const colorMap = {
  yellow: {
    icon: "text-yellow-500",
    border: "border-yellow-200",
    focus: "focus:ring-yellow-400",
    bg: "bg-yellow-50 hover:bg-yellow-100",
    text: "text-yellow-700",
  },
  green: {
    icon: "text-green-500",
    border: "border-green-200",
    focus: "focus:ring-green-400",
    bg: "bg-green-50 hover:bg-green-100",
    text: "text-green-700",
  },
  blue: {
    icon: "text-blue-500",
    border: "border-blue-200",
    focus: "focus:ring-blue-400",
    bg: "bg-blue-50 hover:bg-blue-100",
    text: "text-blue-700",
  },
};

export default function Paginator({
  page,
  setPage,
  totalPages,
  perPage,
  setPerPage,
  totalItems,
  color = "yellow", // default
  perPageOptions = [5, 10, 20, 50],
}) {
  const c = colorMap[color] || colorMap.yellow;
  const start = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalItems);

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-4 mt-6 border-t pt-4 ${c.border}`}
    >
      <div className="flex items-center gap-2">
        <FaListOl className={c.icon} />
        <span className="text-sm text-slate-600">Elementos por página:</span>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className={`border ${c.border} rounded px-2 py-1 text-sm ${c.focus} transition`}
        >
          {perPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`p-2 rounded-full ${c.bg} ${c.text} disabled:opacity-40 transition`}
          title="Anterior"
        >
          <FaChevronLeft />
        </button>
        <span className="text-sm text-slate-600">
          {start}-{end} de {totalItems}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`p-2 rounded-full ${c.bg} ${c.text} disabled:opacity-40 transition`}
          title="Siguiente"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import VisitorModal from "../components/VisitorModal";

const SearchBar = ({ onSearch, onAddVisitor }) => {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  ); // hoy por defecto
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query, date });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white border border-slate-100 shadow-sm rounded-xl p-3 flex flex-col md:flex-row gap-2 items-center"
    >
      {/* Campo búsqueda */}
      <div className="flex-grow w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, placa, Unidad residencial..."
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white text-slate-800 placeholder-slate-400 transition"
        />
      </div>

      {/* Selector de fecha */}
      <div className="flex-shrink-0">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
        />
      </div>

      {/* Botón de búsqueda */}
      <button
        type="submit"
        className="flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-100 transition"
      >
        <FaSearch className="text-indigo-400" /> Buscar
      </button>

      {/* Botón de nuevo visitante */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100 transition"
      >
        <FaPlusCircle className="text-blue-400 text-lg" />
        <span>Visitante</span>
      </button>

      <VisitorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddVisitor={(v) => {
          if (onAddVisitor) onAddVisitor(v);
          setModalOpen(false);
        }}
      />
    </form>
  );
};

export default SearchBar;

import React, { useState } from 'react';
import {  FaPlusCircle } from "react-icons/fa";
import VisitorModal from '../components/VisitorModal';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // hoy por defecto
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query, date });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white/80 backdrop-blur-lg shadow-md rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center"
    >
      {/* Campo búsqueda */}
      <div className="flex-grow w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, placa, apartamento..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 placeholder-slate-400 transition"
        />
      </div>

      {/* Selector de fecha */}
      <div className="flex-shrink-0">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Botón de búsqueda */}
      <button
        type="submit"
        className="flex-shrink-0 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
      >
        Buscar
      </button>
              <div className="flex flex-col md:flex-row items-stretch gap-2 w-full md:w-auto">
                <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
                >
                <FaPlusCircle className="text-white text-lg" />
                <span>Visitante</span>
                </button>
              </div>
                    <VisitorModal
                      isOpen={modalOpen}
                      onClose={() => setModalOpen(false)}
                      onAddVisitor={(v) => alert(JSON.stringify(v))}
                    />

    </form>

  );
};

export default SearchBar;

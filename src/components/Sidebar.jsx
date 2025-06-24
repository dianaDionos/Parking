import React, { useState } from "react";
import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";

const sidebarItems = [
  { icon: FiHome, label: "Inicio" },
  { icon: FiUsers, label: "Residentes" },
  { icon: FiDollarSign, label: "Finanzas" },
  { icon: FiMonitor, label: "Panel" },
  { icon: FiShoppingCart, label: "Productos" },
  { icon: FiTag, label: "Etiquetas" },
  { icon: FiBarChart, label: "Analítica" },

];

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Inicio");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100">
      <motion.nav

        className="sticky top-0 h-screen shrink-0 bg-white/70 backdrop-blur-lg border-r border-slate-200 shadow-xl transition-all duration-300"
        style={{
          width: open ? 220 : 64,
          minWidth: open ? 220 : 64,
          borderRadius: "24px",
          margin: "16px 0 16px 16px",
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-4 py-6">
            <Logo />
            {open && (
              <div>
                <span className="block text-base font-semibold text-slate-800">Dionos</span>
                <span className="block text-xs text-slate-400">Propiedad Horizontal</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1 mt-2">
            {sidebarItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setSelected(label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${selected === label
                    ? "bg-slate-100 shadow text-indigo-600"
                    : "hover:bg-slate-50 text-slate-500"
                  }`}
                style={{
                  fontWeight: selected === label ? 600 : 400,
                  fontSize: open ? 15 : 0,
                }}
              >
                <Icon className="text-xl" />
                {open && <span>{label}</span>}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl hover:bg-slate-50 transition-all text-slate-400"
          >
            <FiChevronsRight className={`transition-transform ${open && "rotate-180"}`} />
            {open && <span className="text-xs">Ocultar</span>}
          </button>
        </div>
      </motion.nav>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

const Logo = () => (
  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 via-white to-slate-100 flex items-center justify-center shadow">
    <svg width="24" height="24" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#63F1" opacity="0.15" />
      <path d="M16.5 2H37.58L22.08 24.97H1L16.5 2Z" fill="#6306F1" />
      <path d="M17.42 27.1L11.42 36H33.5L49 13.03H32.7L23.2 27.1H17.42Z" fill="#6366F1" />
    </svg>
  </div>
);

export default Sidebar;

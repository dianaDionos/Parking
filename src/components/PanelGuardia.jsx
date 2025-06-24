import React from "react";
import { FaParking, FaUserFriends, FaCarAlt, FaBell } from "react-icons/fa";
import ResidentTable from "../components/ResidentTable";
import ParkingTable from "../components/ParkingTable";

const resumen = [
  {
    label: "Parqueaderos libres",
    value: 12,
    icon: <FaParking className="text-green-500 drop-shadow" size={40} />,
    bg: "from-green-100 via-white/70 to-white/90",
    ring: "ring-green-300",
    text: "text-green-700",
  },
  {
    label: "Parqueaderos ocupados",
    value: 8,
    icon: <FaCarAlt className="text-indigo-500 drop-shadow" size={40} />,
    bg: "from-indigo-100 via-white/70 to-white/90",
    ring: "ring-indigo-300",
    text: "text-indigo-700",
  },
  {
    label: "Visitantes en conjunto",
    value: 5,
    icon: <FaUserFriends className="text-blue-500 drop-shadow" size={40} />,
    bg: "from-blue-100 via-white/70 to-white/90",
    ring: "ring-blue-300",
    text: "text-blue-700",
  },
  {
    label: "Alertas activas",
    value: 1,
    icon: <FaBell className="text-red-500 drop-shadow" size={40} />,
    bg: "from-red-100 via-white/70 to-white/90",
    ring: "ring-red-300",
    text: "text-red-700",
  },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

      {/* Tarjetas estadísticas con efecto orgánico */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {resumen.map((item) => (
          <div
            key={item.label}
            className={`rounded-3xl bg-gradient-to-br ${item.bg} ${item.ring} ring-2 backdrop-blur-md shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-[1.04]`}
            style={{
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div className="mb-3">{item.icon}</div>
            <span className={`text-4xl font-extrabold ${item.text}`}>{item.value}</span>
            <span className="text-sm mt-2 text-slate-600 text-center font-medium">{item.label}</span>
          </div>
        ))}
      </div>


    </div>
  );
}

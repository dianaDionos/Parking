import React from "react";
import { FaHome, FaUserFriends, FaBoxOpen, FaParking } from "react-icons/fa";
import Link from "next/link";

export default function Sidebar({ children }) {
  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-slate-800 text-white flex flex-col p-4">
        <div className="mb-8 text-2xl font-bold flex items-center gap-2">
          <FaHome /> Panel SIPHO
        </div>
        <nav className="flex flex-col gap-4">
          <Link href="/DashboardGuardia" className="flex items-center gap-2 hover:text-yellow-400">
            <FaUserFriends /> Visitantes
          </Link>
          <Link href="/parqueadero" className="flex items-center gap-2 hover:text-yellow-400">
            <FaParking /> Parqueadero
          </Link>
          <Link href="/paqueteria" className="flex items-center gap-2 hover:text-yellow-400">
            <FaBoxOpen /> Paquetería
          </Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
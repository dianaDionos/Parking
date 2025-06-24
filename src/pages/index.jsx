import React from 'react';
import SearchBar from '../components/SearchBar';
import ResidentTable from '../components/ResidentTable';
import VisitorTable from '../components/VisitorTable';

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sistema de Propiedad Horizontal - Módulo de Acceso</h1>
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Residentes</h2>
          <ResidentTable />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Visitantes</h2>
          <VisitorTable />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
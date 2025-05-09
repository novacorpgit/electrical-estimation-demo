
import React from 'react';
import { Navigation } from "@/components/Navigation";
import { ClientsView } from "@/components/ClientsView";

const ClientsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Clients" />
      
      <main className="container mx-auto p-4 mt-4">
        <ClientsView />
      </main>
    </div>
  );
};

export default ClientsPage;

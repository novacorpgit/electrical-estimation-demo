
import { Button } from "@/components/ui/button";
import { PanelboardDashboard } from "@/components/PanelboardDashboard";
import { ProjectsView } from "@/components/ProjectsView";
import { ClientsView } from "@/components/ClientsView";
import { useState } from "react";

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'clients' | 'templates'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-gray-800">Panelboard Estimation System</h1>
          <nav className="mt-4">
            <ul className="flex space-x-4">
              <li>
                <Button 
                  variant={activeView === 'dashboard' ? 'default' : 'ghost'} 
                  onClick={() => setActiveView('dashboard')}
                >
                  Dashboard
                </Button>
              </li>
              <li>
                <Button 
                  variant={activeView === 'projects' ? 'default' : 'ghost'} 
                  onClick={() => setActiveView('projects')}
                >
                  Projects
                </Button>
              </li>
              <li>
                <Button 
                  variant={activeView === 'clients' ? 'default' : 'ghost'} 
                  onClick={() => setActiveView('clients')}
                >
                  Clients
                </Button>
              </li>
              <li>
                <Button 
                  variant={activeView === 'templates' ? 'default' : 'ghost'} 
                  onClick={() => setActiveView('templates')}
                >
                  Panel Templates
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4 mt-4">
        {activeView === 'dashboard' && <PanelboardDashboard />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'clients' && <ClientsView />}
        {activeView === 'templates' && <h2 className="text-xl font-bold">Panel Templates View (Coming Soon)</h2>}
      </main>
    </div>
  );
};

export default Index;

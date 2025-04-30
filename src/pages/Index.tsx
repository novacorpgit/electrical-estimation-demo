
import { Button } from "@/components/ui/button";
import { PanelboardDashboard } from "@/components/PanelboardDashboard";
import { ProjectsView } from "@/components/ProjectsView";
import { ClientsView } from "@/components/ClientsView";
import { QuotesView } from "@/components/quote/QuotesView";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'clients' | 'templates' | 'quotes' | 'bom'>('dashboard');

  const handleViewChange = (view: typeof activeView) => {
    if (view === 'bom') {
      navigate('/bom');
      return;
    }
    
    setActiveView(view);
  };

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
                  onClick={() => handleViewChange('dashboard')}
                >
                  Dashboard
                </Button>
              </li>
              <li>
                <Button 
                  variant={activeView === 'projects' ? 'default' : 'ghost'} 
                  onClick={() => handleViewChange('projects')}
                >
                  Projects
                </Button>
              </li>
              <li>
                <Button 
                  variant={activeView === 'clients' ? 'default' : 'ghost'} 
                  onClick={() => handleViewChange('clients')}
                >
                  Clients
                </Button>
              </li>
              <li>
                <Button 
                  variant={activeView === 'quotes' ? 'default' : 'ghost'} 
                  onClick={() => handleViewChange('quotes')}
                >
                  Quotes
                </Button>
              </li>
              <li>
                <Button 
                  variant={activeView === 'bom' ? 'default' : 'ghost'} 
                  onClick={() => handleViewChange('bom')}
                >
                  BOM Management
                </Button>
              </li>
              <li>
                <Button 
                  variant={activeView === 'templates' ? 'default' : 'ghost'} 
                  onClick={() => handleViewChange('templates')}
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
        {activeView === 'quotes' && <QuotesView />}
        {activeView === 'templates' && <h2 className="text-xl font-bold">Panel Templates View (Coming Soon)</h2>}
      </main>
    </div>
  );
};

export default Index;

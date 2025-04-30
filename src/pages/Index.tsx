
import { Button } from "@/components/ui/button";
import { PanelboardDashboard } from "@/components/PanelboardDashboard";
import { ProjectsView } from "@/components/ProjectsView";
import { ClientsView } from "@/components/ClientsView";
import { QuotesView } from "@/components/quote/QuotesView";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'clients' | 'templates' | 'quotes' | 'bom'>('dashboard');

  const handleViewChange = (view: typeof activeView) => {
    if (view === 'bom') {
      navigate('/bom');
      return;
    }
    if (view === 'quotes') {
      navigate('/quotes');
      return;
    }
    
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto p-4 mt-4">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeView === 'dashboard' ? 'default' : 'outline'} 
              onClick={() => handleViewChange('dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant={activeView === 'projects' ? 'default' : 'outline'} 
              onClick={() => handleViewChange('projects')}
            >
              Projects
            </Button>
            <Button 
              variant={activeView === 'clients' ? 'default' : 'outline'} 
              onClick={() => handleViewChange('clients')}
            >
              Clients
            </Button>
            <Button 
              variant={activeView === 'templates' ? 'default' : 'outline'} 
              onClick={() => handleViewChange('templates')}
            >
              Panel Templates
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/bom-upload')}
            >
              BOM Upload
            </Button>
          </div>
        </div>
        
        {activeView === 'dashboard' && <PanelboardDashboard />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'clients' && <ClientsView />}
        {activeView === 'templates' && <h2 className="text-xl font-bold">Panel Templates View (Coming Soon)</h2>}
      </main>
    </div>
  );
};

export default Index;


import { PanelboardDashboard } from "@/components/PanelboardDashboard";
import { ProjectsView } from "@/components/ProjectsView";
import { ClientsView } from "@/components/ClientsView";
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
        {activeView === 'dashboard' && <PanelboardDashboard />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'clients' && <ClientsView />}
        {activeView === 'templates' && <h2 className="text-xl font-bold">Panel Templates View (Coming Soon)</h2>}
      </main>
    </div>
  );
};

export default Index;

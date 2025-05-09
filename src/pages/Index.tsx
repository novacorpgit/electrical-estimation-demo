
import { PanelboardDashboard } from "@/components/PanelboardDashboard";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation pageTitle="Dashboard" />
      
      <main className="container mx-auto p-4 mt-4">
        <PanelboardDashboard />
      </main>
    </div>
  );
};

export default Index;

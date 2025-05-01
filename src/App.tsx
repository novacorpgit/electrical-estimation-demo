
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

// Import pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ProjectDashboard from './pages/ProjectDashboard';
import BomManagement from './pages/BomManagement';
import PanelLayout from './pages/PanelLayout';
import UserManagement from './pages/UserManagement';
import UserProfile from './pages/UserProfile';
import QuotationPage from './pages/QuotationPage';
import BomUploadPage from './pages/BomUploadPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/project/:projectId" element={<ProjectDashboard />} />
          <Route path="/bom/:subProjectId" element={<BomManagement />} />
          <Route path="/panel-layout/:subProjectId" element={<PanelLayout />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/users/:userId" element={<UserProfile />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/quotation/:projectId/:subProjectId" element={<QuotationPage />} />
          <Route path="/bom-upload" element={<BomUploadPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

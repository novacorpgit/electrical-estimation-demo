
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDashboard from "./pages/ProjectDashboard";
import ClientsPage from "./pages/ClientsPage";
import QuotesPage from "./pages/QuotesPage";
import QuotationPage from "./pages/QuotationPage";
import TemplatesPage from "./pages/TemplatesPage";
import PanelLayout from "./pages/PanelLayout";
import BomManagement from "./pages/BomManagement";
import BomUploadPage from "./pages/BomUploadPage";
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";
import EstimatorSchedulePage from "./pages/EstimatorSchedulePage";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/projects",
    element: <ProjectsPage />,
  },
  {
    path: "/project/:projectId",
    element: <ProjectDashboard />,
  },
  {
    path: "/clients",
    element: <ClientsPage />,
  },
  {
    path: "/quotes",
    element: <QuotesPage />,
  },
  {
    path: "/quotations/:id",
    element: <QuotationPage />,
  },
  {
    path: "/templates",
    element: <TemplatesPage />,
  },
  {
    path: "/panel-layout",
    element: <PanelLayout />,
  },
  // New route with subproject parameter
  {
    path: "/panel-layout/:subProjectId",
    element: <PanelLayout />,
  },
  {
    path: "/bom",
    element: <BomManagement />,
  },
  // New route with subproject parameter
  {
    path: "/bom/:subProjectId",
    element: <BomManagement />,
  },
  {
    path: "/bom-upload",
    element: <BomUploadPage />,
  },
  {
    path: "/users",
    element: <UserManagement />,
  },
  {
    path: "/user/:id",
    element: <UserProfile />,
  },
  {
    path: "/estimator-schedule",
    element: <EstimatorSchedulePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

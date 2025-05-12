import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileText, Package, Users, Upload, Briefcase, UserCircle, LayoutTemplate } from "lucide-react";
import { 
  NavigationMenu, 
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface NavigationProps {
  pageTitle?: string;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/"
  },
  {
    name: "Projects",
    href: "/projects"
  },
  {
    name: "Clients",
    href: "/clients"
  },
  {
    name: "Quotes",
    href: "/quotes"
  },
  {
    name: "Templates",
    href: "/templates"
  },
  {
    name: "Panel Layout",
    href: "/panel-layout"
  },
  {
    name: "BOM",
    href: "/bom"
  },
  {
    name: "Users",
    href: "/users"
  },
  {
    name: "Estimator Schedule",
    href: "/estimator-schedule"
  },
];

export const Navigation = ({ pageTitle }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Panelboard Estimation System</h1>
        </div>
        
        <NavigationMenu className="mt-4">
          <NavigationMenuList className="flex flex-wrap gap-2">
            <NavigationMenuItem>
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
                size="sm"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant={isActive('/projects') ? 'default' : 'ghost'} 
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2"
                size="sm"
              >
                <Briefcase className="h-4 w-4" />
                <span>Projects</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant={isActive('/clients') ? 'default' : 'ghost'} 
                onClick={() => navigate('/clients')}
                className="flex items-center gap-2"
                size="sm"
              >
                <UserCircle className="h-4 w-4" />
                <span>Clients</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant={isActive('/templates') ? 'default' : 'ghost'} 
                onClick={() => navigate('/templates')}
                className="flex items-center gap-2"
                size="sm"
              >
                <LayoutTemplate className="h-4 w-4" />
                <span>Panel Templates</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant={isActive('/quotes') ? 'default' : 'ghost'} 
                onClick={() => navigate('/quotes')}
                className="flex items-center gap-2"
                size="sm"
              >
                <FileText className="h-4 w-4" />
                <span>Quotes</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant={isActive('/bom') ? 'default' : 'ghost'} 
                onClick={() => navigate('/bom')}
                className="flex items-center gap-2"
                size="sm"
              >
                <Package className="h-4 w-4" />
                <span>BOM Management</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant={isActive('/bom-upload') ? 'default' : 'ghost'} 
                onClick={() => navigate('/bom-upload')}
                className="flex items-center gap-2"
                size="sm"
              >
                <Upload className="h-4 w-4" />
                <span>BOM Upload</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant={isActive('/users') ? 'default' : 'ghost'} 
                onClick={() => navigate('/users')}
                className="flex items-center gap-2"
                size="sm"
              >
                <Users className="h-4 w-4" />
                <span>User Management</span>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {pageTitle && (
          <div className="mt-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Button variant="link" className="p-0" onClick={() => navigate('/')}>Home</Button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;


import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileText, Package, Users, Upload } from "lucide-react";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
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

export const Navigation = ({ pageTitle }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Panelboard Estimation System</h1>
          <div className="flex space-x-2">
            <Button 
              variant={isActive('/') ? 'default' : 'outline'} 
              onClick={() => navigate('/')}
              size="sm"
            >
              Dashboard
            </Button>
            <Button 
              variant={isActive('/projects') ? 'default' : 'outline'} 
              onClick={() => navigate('/projects')}
              size="sm"
            >
              Projects
            </Button>
            <Button 
              variant={isActive('/clients') ? 'default' : 'outline'} 
              onClick={() => navigate('/clients')}
              size="sm"
            >
              Clients
            </Button>
            <Button 
              variant={isActive('/templates') ? 'default' : 'outline'} 
              onClick={() => navigate('/templates')}
              size="sm"
            >
              Panel Templates
            </Button>
            <Button 
              variant={isActive('/bom-upload') ? 'default' : 'outline'} 
              onClick={() => navigate('/bom-upload')}
              size="sm"
            >
              BOM Upload
            </Button>
          </div>
        </div>
        
        <NavigationMenu className="mt-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant={isActive('/quotes') ? 'default' : 'ghost'} 
                onClick={() => navigate('/quotes')}
                className="flex items-center gap-2"
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

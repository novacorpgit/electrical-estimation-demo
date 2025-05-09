
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

// Define column type
type TableColumn = {
  id: string;
  header: string;
  accessorKey: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  cell?: (info: any) => React.ReactNode;
};

interface ProjectsTableProps {
  projects: any[];
  visibleColumns: Record<string, boolean>;
  columnOrder: string[];
  selectedProjects: string[];
  onSelectProject: (projectId: string) => void;
  onSelectAll: () => void;
  onViewProject: (projectId: string) => void;
  onEditProject: (project: any) => void;
  onAssignEstimator: (project: any) => void;
  onColumnReorder: (draggedColumn: string, targetColumn: string) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

// Drag and drop column header component
const DraggableColumnHeader = ({ column, onColumnReorder }: { column: TableColumn, onColumnReorder: (drag: string, target: string) => void }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN',
    item: { id: column.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'COLUMN',
    drop: (item: { id: string }) => {
      if (item.id !== column.id) {
        onColumnReorder(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      className={`h-10 px-4 text-left ${isDragging ? 'opacity-50' : ''} ${isOver ? 'bg-gray-100' : ''} cursor-move`}
    >
      <div className="flex flex-col">
        <span>{column.header}</span>
        {column.enableFiltering && (
          <Input 
            className="mt-1 h-6 text-xs" 
            placeholder={`Filter ${column.header}...`}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </th>
  );
};

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  visibleColumns,
  columnOrder,
  selectedProjects,
  onSelectProject,
  onSelectAll,
  onViewProject,
  onEditProject,
  onAssignEstimator,
  onColumnReorder,
  getStatusColor,
  getPriorityColor
}) => {
  // Define our columns configuration
  const columns: TableColumn[] = [
    {
      id: 'id',
      header: 'Quote No',
      accessorKey: 'id',
      enableSorting: true,
      enableFiltering: true,
      cell: (project) => (
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={selectedProjects.includes(project.id)} 
            onCheckedChange={() => onSelectProject(project.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <span>{project.id}</span>
        </div>
      )
    },
    {
      id: 'projectName',
      header: 'Project Name',
      accessorKey: 'projectName',
      enableSorting: true,
      enableFiltering: true,
      cell: (project) => <span className="font-medium">{project.projectName}</span>
    },
    {
      id: 'clientName',
      header: 'Customer',
      accessorKey: 'clientName',
      enableSorting: true,
      enableFiltering: true,
      cell: (project) => <span>{project.clientName}</span>
    },
    {
      id: 'estimatorName',
      header: 'Estimator',
      accessorKey: 'estimatorName',
      enableSorting: true,
      enableFiltering: true,
      cell: (project) => (
        <div onClick={(e) => e.stopPropagation()}>
          {project.estimatorName ? (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{project.estimatorName}</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1 text-blue-600" 
              onClick={(e) => {
                e.stopPropagation();
                onAssignEstimator(project);
              }}
            >
              <User className="h-4 w-4" />
              <span>Assign</span>
            </Button>
          )}
        </div>
      )
    },
    {
      id: 'state',
      header: 'State',
      accessorKey: 'state',
      enableSorting: true,
      enableFiltering: true,
      cell: (project) => <span>{project.state}</span>
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      enableSorting: true,
      enableFiltering: true,
      cell: (project) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      )
    },
    {
      id: 'priority',
      header: 'Priority',
      accessorKey: 'priority',
      enableSorting: true,
      enableFiltering: true,
      cell: (project) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
          {project.priority}
        </span>
      )
    },
    {
      id: 'startDate',
      header: 'Start Date',
      accessorKey: 'startDate',
      enableSorting: true,
      enableFiltering: true,
      cell: (project) => <span>{project.startDate}</span>
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'actions',
      cell: (project) => (
        <div onClick={(e) => e.stopPropagation()} className="space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onViewProject(project.id);
            }}
          >
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onEditProject(project);
            }}
          >
            Edit
          </Button>
        </div>
      )
    },
  ];

  // Filter and order columns based on visibility and order state
  const visibleOrderedColumns = columnOrder
    .filter(columnId => visibleColumns[columnId])
    .map(columnId => columns.find(col => col.id === columnId))
    .filter(Boolean) as TableColumn[];

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {visibleOrderedColumns.map((column) => (
              <DraggableColumnHeader 
                key={column.id} 
                column={column} 
                onColumnReorder={onColumnReorder} 
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={visibleOrderedColumns.length} className="h-24 text-center text-muted-foreground">
                No projects found.
              </td>
            </tr>
          ) : (
            projects.map(project => (
              <tr 
                key={project.id} 
                className="border-b hover:bg-muted/50 cursor-pointer" 
                onClick={() => onViewProject(project.id)}
              >
                {visibleOrderedColumns.map((column) => (
                  <td key={`${project.id}-${column.id}`} className="p-4">
                    {column.cell ? column.cell(project) : project[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

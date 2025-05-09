
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow
} from "@/components/ui/table";

// Define column type
type TableColumn = {
  id: string;
  header: string;
  accessorKey: string;
  enableSorting?: boolean;
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
const DraggableColumnHeader = ({ 
  column, 
  onColumnReorder, 
  sortColumn,
  sortDirection,
  onSort
}: { 
  column: TableColumn, 
  onColumnReorder: (drag: string, target: string) => void,
  sortColumn: string | null,
  sortDirection: 'asc' | 'desc' | null,
  onSort: (columnId: string) => void
}) => {
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

  const isSorted = sortColumn === column.id;

  return (
    <TableHead
      ref={(node) => drag(drop(node))}
      className={`h-7 px-2 text-left text-xs ${isDragging ? 'opacity-50' : ''} ${isOver ? 'bg-gray-100' : ''} cursor-move whitespace-nowrap`}
    >
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium">{column.header}</span>
        {column.enableSorting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSort(column.id);
            }}
            className="ml-1 focus:outline-none"
          >
            {isSorted ? (
              sortDirection === 'asc' ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )
            ) : (
              <div className="h-3 w-3 opacity-0 group-hover:opacity-50">
                <ArrowUp className="h-3 w-3" />
              </div>
            )}
          </button>
        )}
      </div>
    </TableHead>
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
  // Add sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      // Toggle direction or remove sort
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      // New column sort
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Define our columns configuration
  const columns: TableColumn[] = [
    {
      id: 'id',
      header: 'Quote No',
      accessorKey: 'id',
      enableSorting: true,
      cell: (project) => (
        <div className="flex items-center space-x-1">
          <Checkbox 
            checked={selectedProjects.includes(project.id)} 
            onCheckedChange={() => onSelectProject(project.id)}
            onClick={(e) => e.stopPropagation()}
            className="h-3 w-3"
          />
          <span className="text-xs">{project.id}</span>
        </div>
      )
    },
    {
      id: 'projectName',
      header: 'Project Name',
      accessorKey: 'projectName',
      enableSorting: true,
      cell: (project) => <span className="text-xs font-medium">{project.projectName}</span>
    },
    {
      id: 'clientName',
      header: 'Customer',
      accessorKey: 'clientName',
      enableSorting: true,
      cell: (project) => <span className="text-xs">{project.clientName}</span>
    },
    {
      id: 'salesRep',
      header: 'Sales Rep',
      accessorKey: 'salesRep',
      enableSorting: true,
      cell: (project) => <span className="text-xs">{project.salesRep || '-'}</span>
    },
    {
      id: 'address',
      header: 'Address',
      accessorKey: 'address',
      enableSorting: true,
      cell: (project) => <span className="text-xs">{project.address || '-'}</span>
    },
    {
      id: 'estimatorName',
      header: 'Estimator',
      accessorKey: 'estimatorName',
      enableSorting: true,
      cell: (project) => (
        <div onClick={(e) => e.stopPropagation()}>
          {project.estimatorName ? (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 text-gray-500" />
              <span className="text-xs">{project.estimatorName}</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1 text-blue-600 h-5 text-xs py-0 px-1" 
              onClick={(e) => {
                e.stopPropagation();
                onAssignEstimator(project);
              }}
            >
              <User className="h-3 w-3" />
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
      cell: (project) => <span className="text-xs">{project.state}</span>
    },
    {
      id: 'classification',
      header: 'Classification',
      accessorKey: 'classification',
      enableSorting: true,
      cell: (project) => <span className="text-xs">{project.classification || '-'}</span>
    },
    {
      id: 'startDate',
      header: 'Start Date',
      accessorKey: 'startDate',
      enableSorting: true,
      cell: (project) => <span className="text-xs">{project.startDate}</span>
    },
    {
      id: 'poNumber',
      header: 'PO Number',
      accessorKey: 'poNumber',
      enableSorting: true,
      cell: (project) => <span className="text-xs">{project.poNumber || '-'}</span>
    },
    {
      id: 'refNumber',
      header: 'Ref Number',
      accessorKey: 'refNumber',
      enableSorting: true,
      cell: (project) => <span className="text-xs">{project.refNumber || '-'}</span>
    },
    {
      id: 'priority',
      header: 'Priority',
      accessorKey: 'priority',
      enableSorting: true,
      cell: (project) => (
        <span className={`px-1 py-0.5 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
          {project.priority}
        </span>
      )
    },
    {
      id: 'estimatorHours',
      header: 'Est. Hours',
      accessorKey: 'estimatorHours',
      enableSorting: true,
      cell: (project) => <span className="text-xs">{project.estimatorHours || '-'}</span>
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      enableSorting: true,
      cell: (project) => (
        <span className={`px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'actions',
      enableSorting: false,
      cell: (project) => (
        <div onClick={(e) => e.stopPropagation()} className="space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 py-0 px-2 text-xs"
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
            className="h-6 py-0 px-2 text-xs" 
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

  // Apply sorting to projects if sorting is active
  const sortedProjects = [...projects];
  if (sortColumn && sortDirection) {
    sortedProjects.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full table-fixed border-collapse">
          <TableHeader className="bg-muted/50">
            <TableRow className="border-b hover:bg-transparent">
              {visibleOrderedColumns.map((column) => (
                <DraggableColumnHeader 
                  key={column.id} 
                  column={column} 
                  onColumnReorder={onColumnReorder}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleOrderedColumns.length} className="h-16 text-center text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              sortedProjects.map(project => (
                <TableRow 
                  key={project.id} 
                  className="hover:bg-muted/30 cursor-pointer border-b" 
                  onClick={() => onViewProject(project.id)}
                >
                  {visibleOrderedColumns.map((column) => (
                    <TableCell key={`${project.id}-${column.id}`} className="py-1 px-2">
                      {column.cell ? column.cell(project) : project[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

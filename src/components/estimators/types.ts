
export interface EstimatorScheduleViewProps {
  view?: "week" | "day";
  selectedEstimator?: string;
  onSelectDate?: (date: string, estimatorId: string) => void;
  selectedDate?: string;
  selectedEstimatorId?: string;
  mode?: "view" | "select";
}

export interface EstimatorData {
  id: string;
  name: string;
  initials: string;
  availability: {
    date: string;
    projects: EstimatorProject[];
    events: EstimatorEvent[];
    leaves?: EstimatorLeave[];
  }[];
  workload: {
    current: number;
    capacity: number;
  };
}

export interface EstimatorProject {
  id: string;
  name: string;
  hours: number;
  priority: "Normal" | "High" | "Critical";
  status: "Draft" | "In Progress" | "Completed" | "On Hold";
}

export interface EstimatorEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "meeting" | "training" | "other";
}

export interface EstimatorLeave {
  id: string;
  type: "annual" | "sick" | "other";
  startDate: string;
  endDate: string;
}

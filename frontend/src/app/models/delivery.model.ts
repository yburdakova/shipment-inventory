
  
  export interface StatusFilter {
    active: boolean;
    statuses: number[];
  }
  
  export type StatusFilters = Record<string, StatusFilter>;
  
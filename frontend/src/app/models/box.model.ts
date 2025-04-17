export interface BoxDetails {
    ID: number;
    Barcode: string;
    CurrentStatus: string;
    StartFileNumber: string;
    EndFileNumber: string;
    MissingFiles: string;
    NumberOfPages: number;
    Notes: string;
    Inspection_Time: number;
    Prep_Time: number;
    Scan1_Time: number;
    Scan2_Time: number;
    Review_Time: number;
    History: HistoryEntry[];
  }

export interface HistoryEntry {
    Action: string;
    ProcessedBy: string;
    ActivityStarted: string;
}

export type TimeKey = 'Inspection_Time' | 'Prep_Time' | 'Scan1_Time' | 'Scan2_Time' | 'Review_Time';

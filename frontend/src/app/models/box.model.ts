export interface BoxDetails {
    ID: number;
    Barcode: string;
    CurrentStatus: string;
    StartFileNumber: number;
    EndFileNumber: number;
    MissingFiles: string;
    NumberOfPages: number;
    History: HistoryEntry[];
    Inspection_Time: number;
    Prep_Time: number;
    Scan1_Time: number;
    Scan2_Time: number;
    Review_Time: number;
}

export interface HistoryEntry {
    Action: string;
    ProcessedBy: string;
    ActivityStarted: string;
}

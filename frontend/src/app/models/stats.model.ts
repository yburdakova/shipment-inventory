export interface BoxDetails {
  ID: number;
  BoxGUID: string;
  CaseType: string;
  StatusID: number;
  StatusLabel: string;
  StartFileNumber: number | null;
  EndFileNumber: number | null;
  Uploaded: number;
}

export interface ProjectStats {
    total: number;
    statuses: {
      boxed: number;
      delivered: number;
      inspected: number;
      prep_init: number;
      prep_completed: number;
      scan1i: number;
      scan1c: number;
      scan2i: number;
      scan2c: number;
      reviewi: number;
      reviewc: number;
      finalized: number;
      uploaded: number;
      destroyed: number;
      returned_uns: number;
      returned: number;
    };
    average_pages: number;
    scanned_pages: number;
    reviewed_pages: number;
    deliveries: {
      RegisterDate: string;
      boxes: BoxDetails[];
      total_rows: number;
      first_box: string;
      last_box: string;
      untouched: number;
      ip: number;
      scanned: number;
      reviewed: number;
      returned: number;
      uploaded: number;
    }[];
  }
  
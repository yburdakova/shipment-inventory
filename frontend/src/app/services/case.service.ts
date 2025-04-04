import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../constants/api.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private apiUrl = `${API_BASE_URL}/cases`;

  constructor(private http: HttpClient) {}

  markCasesAsConverted(caseNumbers: string[], userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-converted`, {
      caseNumbers,
      userId
    });
  }

  checkExistingCases(cases: string[]) {
    return this.http.post<{ existing: string[] }>(`${this.apiUrl}/check-existing`, { caseNumbers: cases });
  }
  
  
}

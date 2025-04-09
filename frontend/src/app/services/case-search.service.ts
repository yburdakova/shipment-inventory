import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CaseSearchService {
  private apiUrl = `${API_BASE_URL}/case-search`;

  constructor(private http: HttpClient) {}

  getAutocompleteSuggestions(query: string, caseTypeAbbr: string): Observable<string[]> {
    console.log('[Service] Autocomplete request:', { query, caseTypeAbbr });
    return this.http.get<string[]>(
      `${API_BASE_URL}/case-search/autocomplete?query=${query}&caseTypeAbbr=${caseTypeAbbr}`
    );
  }
  

  getCaseDetails(caseNumber: string, caseTypeAbbr: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/details?caseNumber=${caseNumber}&caseTypeAbbr=${caseTypeAbbr}`);
  }

  findCaseInBox(caseNumber: string, caseTypeAbbr: string): Observable<any> {
    return this.http.get<any>(
      `${API_BASE_URL}/case-search/find-box-case?caseNumber=${caseNumber}&caseTypeAbbr=${caseTypeAbbr}`
    );
  }
  
  getCaseTypes(): Observable<{ ID: number, Description: string, Abbreviation: string }[]> {
    return this.http.get<{ ID: number, Description: string, Abbreviation: string }[]>(
      `${API_BASE_URL}/case-search/case-types`
    );
  }

}

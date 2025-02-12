import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ReturnedService {

  private apiUrl = `${API_BASE_URL}/returns`;

  constructor(private http: HttpClient) {}

  getReturnedList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateReturnedStatus(returnedList: { ID: number }[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-status`, { returnedList });
  }
}

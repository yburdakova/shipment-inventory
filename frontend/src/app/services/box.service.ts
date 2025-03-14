import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private apiUrl = `${API_BASE_URL}/boxes`;

  constructor(private http: HttpClient) {}

  getBoxIdByBarcode(barcode: string): Observable<{ ID: number }> {
    return this.http.get<{ ID: number }>(`${this.apiUrl}/${barcode}`);
  }

  getBoxDetailsById(id: number): Observable<{ ID: number, BoxGUID: string }> {
    return this.http.get<{ ID: number, BoxGUID: string }>(`${this.apiUrl}/id/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoxedService {

 private apiUrl = `${API_BASE_URL}/boxed`;
 
   constructor(private http: HttpClient) {}
 
   getBoxedList(): Observable<any[]> {
     return this.http.get<any[]>(this.apiUrl);
   }

   updateDeliveredStatus(deliveredList: { ID: number }[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-status`, { deliveredList });
  }
}

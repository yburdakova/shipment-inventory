import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${API_BASE_URL}/users/login`, { username, password }).pipe(
        catchError(() => {
          return throwError(() => 'Error from service! There was a problem connecting to the server. Please try again later.');
        })
      )
    );
  }
}

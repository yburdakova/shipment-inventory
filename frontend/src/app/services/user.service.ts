import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: { FirstName: string; LastName: string } | null = null;

  setUser(user: { FirstName: string; LastName: string }): void {
    this.user = user;
  }

  getUser(): { FirstName: string; LastName: string } | null {
    return this.user;
  }

  clearUser(): void {
    this.user = null;
  }
}
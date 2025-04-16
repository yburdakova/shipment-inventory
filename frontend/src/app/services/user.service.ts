import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private storageKey = 'loggedInUser';

  setUser(user: { firstName: string; lastName: string; role: number; id: number; currentProjectId: number }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
  
  getUser(): { firstName: string; lastName: string; role: number; id: number; currentProjectId: number } | null {
    const userData = localStorage.getItem(this.storageKey);
    return userData ? JSON.parse(userData) : null;
  }

  clearUser(): void {
    localStorage.removeItem(this.storageKey);
  }
}

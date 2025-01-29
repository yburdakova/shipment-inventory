import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  loggedInUser: { FirstName: string; LastName: string } | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      this.loggedInUser = JSON.parse(user);
      if (this.loggedInUser) {
        this.userService.setUser(this.loggedInUser);
      }
    } else {
      this.router.navigate(['/auth']);
    }
  }

  navigate(path:string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.userService.clearUser(); 
    this.router.navigate(['/']);
  }
}

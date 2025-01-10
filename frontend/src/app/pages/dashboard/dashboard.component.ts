import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loggedInUser: { FirstName: string; LastName: string } | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      this.loggedInUser = JSON.parse(user);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/']);
  }
}

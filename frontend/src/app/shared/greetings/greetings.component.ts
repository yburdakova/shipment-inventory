import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-greetings',
  imports: [CommonModule],
  templateUrl: './greetings.component.html',
  styleUrl: './greetings.component.scss'
})
export class GreetingsComponent implements OnInit {
  loggedInUser: { firstName: string; lastName: string } | null = null;
  toolName: string = 'Tool';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.userService.getUser();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateToolName(event.urlAfterRedirects);
      }
    });

    this.updateToolName(this.router.url);
  }

  private updateToolName(url: string): void {
    if (url.includes('/dashboard')) {
      this.toolName = 'Dashboard Tool';
    } else if (url.includes('/delivery')) {
      this.toolName = 'Delivery Tool';
    } else if (url.includes('/return')) {
      this.toolName = 'Return Tool';
    } else {
      this.toolName = 'Tool';
    }
  }
}

import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-greetings',
  imports: [CommonModule],
  templateUrl: './greetings.component.html',
  styleUrl: './greetings.component.scss'
})
export class GreetingsComponent {
  loggedInUser: { firstName: string; lastName: string } | null = null; 

  constructor(
      private userService: UserService,
    ) {}

  ngOnInit(): void {
    this.loggedInUser = this.userService.getUser();
  }
}

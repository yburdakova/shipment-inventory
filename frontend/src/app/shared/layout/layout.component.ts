import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { GreetingsComponent } from '../greetings/greetings.component';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet, GreetingsComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}

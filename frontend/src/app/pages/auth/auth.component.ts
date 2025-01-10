import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements AfterViewInit {
  @ViewChild('scanInput') scanInput!: ElementRef;

  ngAfterViewInit() {
    this.setFocus();
  }

  setFocus() {
    if (this.scanInput) {
      this.scanInput.nativeElement.focus();
    }
  }
}

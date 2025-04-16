import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomInputComponent]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isFetching = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.error = null;
  
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
  
      const missingFields = [];
      if (this.loginForm.get('username')?.invalid) {
        missingFields.push('Username');
      }
      if (this.loginForm.get('password')?.invalid) {
        missingFields.push('Password');
      }
  
      this.error = `${missingFields.join(' and ')} ${missingFields.length === 1 ? 'is' : 'are'} required.`;
      return;
    }
  
    this.isFetching = true;
  
    const { username, password } = this.loginForm.value;
  
    this.loginService.login(username, password).then(user => {
      console.log('✅ Logged in user (via .then):', user);
  
      localStorage.setItem('user', JSON.stringify(user));
      this.userService.setUser(user); 

      this.router.navigate([`/dashboard/project/${user.currentProjectId}`]);
    }).catch(err => {
      this.error = typeof err === 'string'
        ? err
        : 'There was a problem connecting to the server. Please try again later.';
    }).finally(() => {
      this.isFetching = false;
    });
  }
  
}

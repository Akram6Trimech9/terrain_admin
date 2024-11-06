import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../cors/auth/services/auth.service';
import { LoginInterface } from '../../ts/interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})


export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false; // Loader flag

  constructor(private authenticationService: AuthService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      // Set loading to true when submitting the form
      this.isLoading = true;
      
      const { email, password } = this.loginForm.value;
      const record: LoginInterface = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authenticationService.login(record).subscribe({
        next: (value) => {
          console.log(value);
          this.isLoading = false; // Set loading to false on success
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false; // Set loading to false on error
        }
      });
    }
  }
}
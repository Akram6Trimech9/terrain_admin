import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:'./resetPassword.component.html',
  styleUrls: ['./resetPassword.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  savedToken : any
  constructor(private route: ActivatedRoute, private _authService : AuthenticationService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];  
      if (token) {
        this.savedToken = token
        this._authService.verificationLink(token).subscribe({
          next: (value) => {
            console.log(value);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }

  resetPassword(): void {
    if (this.password !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    this._authService.resetPassword(this.password ,this.savedToken ).subscribe({
      next: (response) => {
        alert("Mot de passe réinitialisé avec succès.");
      },
      error: (error) => {
        console.error(error);
        alert("Une erreur s'est produite.");
      }
    });
  }
}

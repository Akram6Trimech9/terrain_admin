import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-token-verification',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tokenVerification.component.html',
  styleUrl: './tokenVerification.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenVerificationComponent implements OnInit { 
  constructor(private route: ActivatedRoute, private _authService : AuthenticationService) {}

 
  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      const token = params['token'];  
      if(token){
        this._authService.verificationLink(token).subscribe({ 
           next:(value)=>{ 
     console.log(value)
           } , error:(err)=>{ 
            console.log(err)
           }
        })
      }
     });
  }
}

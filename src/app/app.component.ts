import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrentUserService } from './cors/auth/services/current-user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  //  constructor(private _currentUserService : CurrentUserService){}

  ngOnInit(): void {
    // this._currentUserService.setCurrentUser();

  }

}

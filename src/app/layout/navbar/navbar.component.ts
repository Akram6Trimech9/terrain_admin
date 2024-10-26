import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar/sidebar.service';

export interface JwtPayload {
  role: string;
  email: string;
  userName: string;
  profile_picture_url?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})



export class NavbarComponent implements OnInit {
  userData: JwtPayload | null = null
  constructor(private AuthenticationService: AuthenticationService, public sidebarService: SidebarService) { }

  isSidebarOpen: boolean = true;
  currentSidebarTab: string | null = 'linksTab';

  toggleMessagePanel() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.currentSidebarTab = 'messagesTab';
  }

  toggleNotificationsPanel() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.currentSidebarTab = 'notificationsTab';
  }

  ngOnInit(): void {
    this.userData = this.AuthenticationService.getUserData() as JwtPayload
    this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });

    this.sidebarService.currentSidebarTab$.subscribe( tab => {
      this.currentSidebarTab = tab;
    });
  }

  toggleSidebar(tab: string) {
    return this.sidebarService.toggleSidebar(tab)
  }
}

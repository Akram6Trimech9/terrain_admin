import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isSidebarOpen: boolean = false;
  currentSidebarTab: string | null = '';
  sidebarWidth: string = '23.5vw';
  contentWidth: string = '75vw';

  constructor(public sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
      this.adjustLayout(window.innerWidth);
    });

    this.sidebarService.currentSidebarTab$.subscribe(tab => {
      this.currentSidebarTab = tab;
    });

    this.adjustLayout(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const windowWidth = (event.target as Window).innerWidth;
    this.adjustLayout(windowWidth);
  }

  adjustLayout(windowWidth: number) {
    if (this.isSidebarOpen) {
      this.sidebarWidth = '23.5vw';
      this.contentWidth = '75vw';
      if (windowWidth < 768) {
        this.sidebarWidth = '10vw';
        this.contentWidth = '90vw';
      } else {
        this.sidebarWidth = '23.5vw';
        this.contentWidth = '75vw';
      }
    } else {
      this.sidebarWidth = '18vw';
      this.contentWidth = '82vw';  
    }
  }
}

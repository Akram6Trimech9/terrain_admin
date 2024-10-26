import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, public sidebarService: SidebarService) { }
  isSidebarOpen: boolean = true;
  currentSidebarTab: string | null = '';
  windowWidth:number = 0

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;

    this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });

    this.sidebarService.currentSidebarTab$.subscribe(tab => {
      this.currentSidebarTab = tab;
    });
  }

  isActive(tabName: string): boolean {
    return this.currentSidebarTab === tabName;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = (event.target as Window).innerWidth;
  }

  shouldShowService(): boolean {
    return this.isSidebarOpen && this.currentSidebarTab === 'linksTab' && this.windowWidth >= 768;
  }

  shouldHideService(): boolean {
    return !this.isSidebarOpen || this.currentSidebarTab !== 'linksTab' || this.windowWidth < 768;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isSidebarOpen = new BehaviorSubject<boolean>(true);
  isSidebarOpen$ = this._isSidebarOpen.asObservable();

  private _currentSidebarTab = new BehaviorSubject<string | null>('linksTab');
  currentSidebarTab$ = this._currentSidebarTab.asObservable();

  public isSettingsPanelOpen = false;
  public isSubHeaderOpen = false;

  constructor() { 
    this.watchScreen();
  }

  watchScreen(): void {
    if (window.innerWidth <= 1024) {
      this._isSidebarOpen.next(true);
    }
  }

  toggleSidebar(tab: string) {
    if (this._isSidebarOpen.value && this._currentSidebarTab.value === tab) {
      this._isSidebarOpen.next(false);
    } else {
      this._isSidebarOpen.next(true); 
      this._currentSidebarTab.next(tab);
    }
  }

  setCurrentSidebarTab(tab: string | null): void {
    this._currentSidebarTab.next(tab);
  }

  toggleSettingsPanel(): void {
    this.isSettingsPanelOpen = !this.isSettingsPanelOpen;
  }

  toggleSubHeader(): void {
    this.isSubHeaderOpen = !this.isSubHeaderOpen;
  }
}

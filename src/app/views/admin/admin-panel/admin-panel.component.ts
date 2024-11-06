import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, CalendarModule, FormsModule, NgxChartsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {

  view: [number, number] = [700, 400]; // Dimensions for ngx-charts

  // Static data for charts and statistics
  single: any[] = [
    { name: 'Terrains', value: 120 },
    { name: 'Propriétaires', value: 45 },
    { name: 'Rendez-vous', value: 85 },
    { name: 'Affaires en cours', value: 60 }
  ];

  multi: any[] = [
    {
      name: 'Terrains',
      series: [
        { name: '2021', value: 80 },
        { name: '2022', value: 90 },
        { name: '2023', value: 120 },
      ]
    },
    {
      name: 'Propriétaires',
      series: [
        { name: '2021', value: 40 },
        { name: '2022', value: 50 },
        { name: '2023', value: 45 },
      ]
    },
  ];

  // Sample Statistics
  totalTerrains: number = 120;
  totalProprietaires: number = 45;
  totalRendezVous: number = 85;
  totalAffaires: number = 60;

  ngOnInit(): void {}

  // Add more data manipulation logic here as needed
}

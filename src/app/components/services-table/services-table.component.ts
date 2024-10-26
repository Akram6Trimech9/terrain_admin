import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { IService, ServiceService } from '../../services/service/service.service';

@Component({
  selector: 'app-services-table',
  standalone: true,
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
    CommonModule
  ]
})
export class ServicesTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'username', 'title', 'status', 'category', 'subcategory', 'details'];

  servicesData: IService[] = []; 
  loading: boolean = true; 
  errorMessage: string | null = null;
  dataSource = new MatTableDataSource<IService>(this.servicesData); 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private servicesLogic: ServiceService) {}

  ngOnInit(): void {
    this.getAllServices();
    this.dataSource.paginator = this.paginator;
  }

  private getAllServices(): void {
    this.loading = true;
    this.servicesLogic.getAllServices().subscribe({
      next: (res: IService[]) => {
        if(res){
          this.servicesData = res
          this.dataSource.data = this.servicesData; 
          console.log(this.servicesData);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred while fetching services.'; 
        console.error('Error fetching services:', error); 
      },
      complete: () => {
        this.loading = false; 
      }
    });
  }

  onStatusChange(service: IService): void {
    const newStatus = this.getNextStatus(service.status);    
    if (newStatus) {
      this.servicesLogic.updateServiceStatus(service._id, newStatus).subscribe({
        next: (updatedService) => {
          this.getAllServices();
        },
        error: (error) => {
          console.error("Error updating service status:", error);
        }
      });
    }
  }

  private getNextStatus(currentStatus: string): string | null {
    switch (currentStatus) {
      case 'waiting':
        return 'accepted'; 
      case 'accepted':
        return 'pending'; 
      case 'pending':
        return 'accepted'; 
      default:
        return null; 
    }
  }

  onDetailsClick(service:IService){}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 5;
    this.paginator.hidePageSize = true;
  }
}

import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CategoriesService, ICategory } from '../../services/categories/categories.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './reusable-dailog/resable-dailog.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'nameAr', 'nameEn', 'descriptionAr', 'descriptionEn', 'edit', 'remove'];
  CategoriesData: ICategory[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  dataSource = new MatTableDataSource<ICategory>(this.CategoriesData);
  private subscription: Subscription = new Subscription();

  constructor(private categoriesService: CategoriesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.subscription.add(
      this.categoriesService.categoriesUpdated$.subscribe(updatedCategories => {
        this.CategoriesData = updatedCategories;
        this.dataSource.data = this.CategoriesData;
      })
    );
  }

  private getAllCategories(): void {
    this.loading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: (res: ICategory[]) => {
        this.CategoriesData = res;
        this.dataSource.data = this.CategoriesData;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred while fetching categories.';
        console.error('Error fetching categories:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openEditDialog(element: ICategory) {
    console.log('open');
    const dialogRef = this.dialog.open(EditCategoryComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCategories();
      }
    });
  }

  deleteDialog(element: ICategory): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Category',
        message: `Are you sure you want to deactivate the account for ${element.name.en}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && element._id) {
        this.deleteCategory(element._id);
      }
    });
  }

  deleteCategory(id: string): void {
    this.categoriesService.deleteCategory(id).subscribe({
      next: () => {
        this.getAllCategories();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred while deleting the category.';
        console.error('Error deleting category:', error);
      }
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

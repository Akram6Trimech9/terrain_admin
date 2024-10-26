import { Component, OnInit } from '@angular/core';
import { CategoriesTableComponent } from '../../components/categories-table/categories-table.component';
import { CommonModule } from '@angular/common';
import { CategoriesService, ICategory } from '../../services/categories/categories.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CategoriesTableComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  showDialog = false;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {
      this.categoryForm = this.fb.group({
        name: this.fb.group({
          ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
        }),
        description: this.fb.group({
          ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
          en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]]
        })
      });
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  openDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.resetForm();
  }

  createCategory() {
    if (this.categoryForm.valid) {
      const newCategory: ICategory = this.categoryForm.value;
      this.categoriesService.createCategory(newCategory).subscribe({
        next: (createdCategory) => {
          this.categoriesService.getAllCategories().subscribe()
          this.resetForm();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error creating category:', error);
        }
      });
    } else {
      console.error('Form is invalid. Please fill out the required fields.');
    }
  }

  resetForm() {
    this.categoryForm.reset({
      name: {
        ar: '',
        en: ''
      },
      description: {
        ar: '',
        en: ''
      }
    });
  }

  get nameAr() {
    return this.categoryForm.get('name.ar');
  }

  get nameEn() {
    return this.categoryForm.get('name.en');
  }

  get descAr() {
    return this.categoryForm.get('description.ar');
  }

  get descEn() {
    return this.categoryForm.get('description.en');
  }
}

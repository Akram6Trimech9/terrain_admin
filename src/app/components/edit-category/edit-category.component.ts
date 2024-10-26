import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriesService, ICategory } from '../../services/categories/categories.service';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'] 
})
export class EditCategoryComponent {
  categoryForm: FormGroup;
  showDialog: boolean = true;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCategoryComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: ICategory 
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

    // Populate the form with the passed data
    if (data) {
      this.categoryForm.patchValue({
        name: {
          ar: data.name.ar,
          en: data.name.en,
        },
        description: {
          ar: data.description.ar,
          en: data.description.en,
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close(); 
  }

  updateCategory() {
    if (this.categoryForm.valid) {
      const newCategory: ICategory = this.categoryForm.value;

      if (this.data._id) {
        this.categoriesService.updateCategory(this.data._id, newCategory).subscribe({
          next: (updatedCategory) => {
            this.categoriesService.getAllCategories().subscribe()
            this.closeDialog();
          },
          error: (error) => {
            console.error('Error updating category:', error);
          }
        });
      }
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

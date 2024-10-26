import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable, Subject, tap } from 'rxjs';

export interface ICategory {
  _id?: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
}

export interface ICategoriesResponse {
  message: string;
  categories: ICategory[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categoriesData: ICategory[] = [];
  private url: string = `${environment.apiUrl}categories`;
  private categoriesUpdatedSource = new Subject<ICategory[]>();
  categoriesUpdated$ = this.categoriesUpdatedSource.asObservable();

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<ICategory[]> {
    return this.http.get<ICategoriesResponse>(this.url).pipe(
      tap((response) => {
        this.categoriesData = response.categories; 
        this.categoriesUpdatedSource.next(this.categoriesData); 
        console.log('Categories:', this.categoriesData); 
      }),
      map(response => response.categories) 
    );
  }

  createCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.url, category, { withCredentials: true }).pipe(
      tap((newCategory) => {
        this.categoriesData.push(newCategory);
        this.categoriesUpdatedSource.next(this.categoriesData);
        console.log('New Category Added:', newCategory);
      })
    );

  }

  updateCategory(categoryId: string, category: ICategory): Observable<ICategory> {
    return this.http.patch<ICategory>(`${this.url}/${categoryId}`, category, { withCredentials: true });
  }

  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${categoryId}`, { withCredentials: true });
  }
}

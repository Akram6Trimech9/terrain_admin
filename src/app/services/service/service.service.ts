import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface IKeyword {
  title: {
    ar: string;
    en: string;
  };
}

export interface ICategory {
  name: {
    ar: string;
    en: string;
  };
  _id: string;
}

export interface ISubcategory {
  title: {
    ar: string;
    en: string;
  };
  _id: string;
}

export interface IService {
  userId: {
    username:string;
    profilePicture:string;
  };

  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  BuyerRules: string;
  category: ICategory;
  subcategory: ISubcategory;
  price: number;
  images: string[];
  keywords: IKeyword[];
  deliveryTime: number;
  serviceCard: {
    totalRated?: number;
    totalReviewers?: number;
    totalBuyer?: number;
    activeOrders: number;
    averageResponseTime: number;
  };
  status: 'waiting' | 'accepted' | 'paused';
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
}

@Injectable({
  providedIn: 'root'
})

export class ServiceService {
  services: IService[] = [];
  private url: string = `${environment.apiUrl}services`;

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<IService[]> {
    return this.http.get<IService[]>(`${this.url}/dashboard`, { withCredentials: true }).pipe(
      tap((response) => {
        this.services = response; 
      })
    );
  }

  updateServiceStatus(serviceId: string, status: string): Observable<IService> {
    return this.http.patch<IService>(`${this.url}/dashboard/${serviceId}`, { status }, { withCredentials: true });
}
}

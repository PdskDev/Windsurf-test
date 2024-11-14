import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Image {
  id: string;
  url: string;
  title?: string;
  description?: string;
  createdAt: Date;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly API_URL = 'YOUR_API_URL'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getAllImages(): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.API_URL}/images`);
  }

  getImage(id: string): Observable<Image> {
    return this.http.get<Image>(`${this.API_URL}/images/${id}`);
  }

  uploadImage(formData: FormData): Observable<Image> {
    return this.http.post<Image>(`${this.API_URL}/images`, formData);
  }

  updateImage(id: string, data: Partial<Image>): Observable<Image> {
    return this.http.put<Image>(`${this.API_URL}/images/${id}`, data);
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/images/${id}`);
  }
}

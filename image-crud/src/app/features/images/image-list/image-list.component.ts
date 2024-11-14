import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { ImageService, Image } from '../../../core/services/image.service';

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="image-list-container">
      <div class="header">
        <h1>My Images</h1>
        <button mat-raised-button color="primary" (click)="navigateToUpload()">
          <mat-icon>add</mat-icon>
          Upload New Image
        </button>
      </div>

      <mat-grid-list cols="3" rowHeight="1:1" gutterSize="16">
        <mat-grid-tile *ngFor="let image of images">
          <mat-card class="image-card">
            <img [src]="image.url" [alt]="image.title || 'Image'" mat-card-image>
            <mat-card-content>
              <h3>{{ image.title || 'Untitled' }}</h3>
              <p>{{ image.description || 'No description' }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="warn" (click)="deleteImage(image.id)">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <div *ngIf="images.length === 0" class="no-images">
        <p>No images found. Upload your first image!</p>
        <button mat-raised-button color="primary" (click)="navigateToUpload()">
          Upload Image
        </button>
      </div>
    </div>
  `,
  styles: [`
    .image-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .image-card {
      width: 100%;
      height: 100%;
    }
    .image-card img {
      object-fit: cover;
      height: 200px;
    }
    .no-images {
      text-align: center;
      padding: 40px;
    }
    mat-card-content {
      padding: 16px;
    }
    mat-card-actions {
      padding: 8px;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class ImageListComponent implements OnInit {
  images: Image[] = [];

  constructor(
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.imageService.getAllImages().subscribe({
      next: (images) => {
        this.images = images;
      },
      error: (error) => {
        console.error('Failed to load images:', error);
        // Handle error (show message to user)
      }
    });
  }

  deleteImage(id: string): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.imageService.deleteImage(id).subscribe({
        next: () => {
          this.images = this.images.filter(img => img.id !== id);
        },
        error: (error) => {
          console.error('Failed to delete image:', error);
          // Handle error (show message to user)
        }
      });
    }
  }

  navigateToUpload(): void {
    this.router.navigate(['/images/upload']);
  }
}

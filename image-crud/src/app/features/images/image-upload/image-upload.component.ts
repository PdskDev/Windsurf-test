import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';
import { ImageService } from '../../../core/services/image.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    ImageCropperModule
  ],
  template: `
    <div class="upload-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Upload Image</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="upload-area">
            <input
              type="file"
              (change)="fileChangeEvent($event)"
              accept="image/*"
              #fileInput
              style="display: none"
            >
            <button mat-raised-button color="primary" (click)="fileInput.click()">
              Select Image
            </button>
          </div>

          <div *ngIf="imageChangedEvent" class="cropper-container">
            <image-cropper
              [imageChangedEvent]="imageChangedEvent"
              [maintainAspectRatio]="true"
              [aspectRatio]="4/3"
              format="png"
              (imageCropped)="imageCropped($event)"
            ></image-cropper>
          </div>

          <div *ngIf="croppedImage" class="preview-container">
            <h3>Preview</h3>
            <img [src]="croppedImage" alt="Cropped image preview">
            <button mat-raised-button color="accent" (click)="upload()">
              Upload Image
            </button>
          </div>

          <mat-progress-bar
            *ngIf="uploading"
            mode="indeterminate"
          ></mat-progress-bar>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .upload-area {
      display: flex;
      justify-content: center;
      padding: 20px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .cropper-container {
      margin: 20px 0;
    }
    .preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
    }
    .preview-container img {
      max-width: 100%;
      border-radius: 4px;
    }
  `]
})
export class ImageUploadComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  uploading = false;

  constructor(
    private imageService: ImageService,
    private router: Router
  ) {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  upload(): void {
    if (!this.croppedImage) return;

    this.uploading = true;
    
    // Convert base64 to blob
    fetch(this.croppedImage)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'image.png');

        this.imageService.uploadImage(formData).subscribe({
          next: () => {
            this.uploading = false;
            this.router.navigate(['/images']);
          },
          error: (error) => {
            console.error('Upload failed:', error);
            this.uploading = false;
            // Handle error (show message to user)
          }
        });
      });
  }
}

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImageService, Image } from './image.service';

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;
  const API_URL = 'YOUR_API_URL'; // Make sure this matches the URL in your service

  const mockImage: Image = {
    id: '1',
    url: 'http://example.com/image.jpg',
    title: 'Test Image',
    description: 'Test Description',
    createdAt: new Date(),
    userId: 'user123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageService]
    });
    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllImages', () => {
    it('should return an array of images', () => {
      const mockImages: Image[] = [mockImage];

      service.getAllImages().subscribe(images => {
        expect(images).toEqual(mockImages);
        expect(images.length).toBe(1);
      });

      const req = httpMock.expectOne(`${API_URL}/images`);
      expect(req.request.method).toBe('GET');
      req.flush(mockImages);
    });

    it('should handle error when API fails', () => {
      service.getAllImages().subscribe({
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/images`);
      req.flush('Error fetching images', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('getImage', () => {
    it('should return a single image', () => {
      service.getImage('1').subscribe(image => {
        expect(image).toEqual(mockImage);
      });

      const req = httpMock.expectOne(`${API_URL}/images/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockImage);
    });
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', () => {
      const mockFormData = new FormData();
      mockFormData.append('image', new Blob(), 'test.jpg');

      service.uploadImage(mockFormData).subscribe(image => {
        expect(image).toEqual(mockImage);
      });

      const req = httpMock.expectOne(`${API_URL}/images`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockFormData);
      req.flush(mockImage);
    });

    it('should handle upload error', () => {
      const mockFormData = new FormData();

      service.uploadImage(mockFormData).subscribe({
        error: error => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/images`);
      req.flush('Invalid image data', {
        status: 400,
        statusText: 'Bad Request'
      });
    });
  });

  describe('updateImage', () => {
    it('should update an image successfully', () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      service.updateImage('1', updateData).subscribe(image => {
        expect(image).toEqual({ ...mockImage, ...updateData });
      });

      const req = httpMock.expectOne(`${API_URL}/images/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush({ ...mockImage, ...updateData });
    });
  });

  describe('deleteImage', () => {
    it('should delete an image successfully', () => {
      service.deleteImage('1').subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${API_URL}/images/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete error', () => {
      service.deleteImage('1').subscribe({
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/images/1`);
      req.flush('Image not found', {
        status: 404,
        statusText: 'Not Found'
      });
    });
  });
});

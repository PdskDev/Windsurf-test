# Image CRUD API

A RESTful API for image management with JWT authentication built with Express.js and MongoDB.

## Features

- User authentication (register/login) with JWT
- Image upload with automatic processing
- Image CRUD operations
- Secure routes with JWT authentication
- Image processing (resizing and optimization)
- Error handling
- File upload validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create an `uploads` directory in the root folder:
```bash
mkdir uploads
```

4. Configure environment variables:
Copy `.env.example` to `.env` and update the values:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/image-crud
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Images

- GET `/api/images` - Get all images (authenticated)
- GET `/api/images/:id` - Get single image (authenticated)
- POST `/api/images` - Upload new image (authenticated)
- PUT `/api/images/:id` - Update image details (authenticated)
- DELETE `/api/images/:id` - Delete image (authenticated)

## Request Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Upload Image
```bash
curl -X POST http://localhost:3000/api/images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "title=My Image" \
  -F "description=Image description"
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are required for protected routes
- File upload validation
- Image processing for security and optimization

## Development

The project uses ESM modules. Make sure to use the `.js` extension when importing local files.

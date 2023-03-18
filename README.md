# Blogger API

This is a RESTful API for managing posts. It allows users to create, read, update, and delete posts.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Login and get an access token
- `GET /api/users/me` - Get current logged in user

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post by ID
- `PUT /api/posts/:id` - Update a specific post by ID
- `DELETE /api/posts/:id` - Delete a specific post by ID

### Technologies Used

- Node.js
- Express.js
- MongoDB
- Passport.js
- JWT (JSON Web Token)

### Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Environment Variables

Create a `.env` file in the root directory of the project and set the following variables:

- MONGODB_URI - MongoDB connection string
- JWT_SECRET - Secret key for JWT encryption

### API Documentation

You can find the Swagger documentation for this API at `/docs`

### License

This project is licensed under the MIT License - see the LICENSE.md file for details.

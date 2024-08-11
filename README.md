# Polity-Dance

Polity-Dance is a web-based platform for creating and sharing articles. Users can create and manage articles, view articles from others, and manage their profiles. This project uses modern web technologies and services to provide a seamless experience for users.

## Features

- **User Registration and Login:** Users can register, log in, and manage their accounts.
- **Article Creation:** Users can create and upload articles with images.
- **Article Management:** Users can view their own articles and articles from others.
- **Profile Management:** Users can view and edit their profiles, including profile pictures.
- **Image Handling:** Integration with Cloudinary for image uploads and management.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary
- **Authentication:** JWT, bcryptjs
- **File Uploads:** Multer

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/A-Tetarwal/Tailwind-Practice.git
   cd Tailwind-Practice
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application:**

   ```bash
   npm start
   ```

5. **Access the application:**

   Open your browser and navigate to `http://localhost:3000` to access the application.

## Routes

- `GET /`: Home page displaying recent articles.
- `GET /login`: Login page.
- `POST /login`: Authenticate user and create a session.
- `GET /register`: Registration page.
- `POST /register`: Register a new user.
- `GET /p/:username`: User profile page.
- `POST /createarticle`: Create a new article with an optional image upload.
- `GET /articles/:title`: View a specific article.
- `GET /pAll/:username`: User profile page can be viewed by all.
- `GET /editprofile`: Edit user profile page.
- `POST /editprofile`: Update user profile information.

## Development

- **Code Style:** Follow the existing code style for consistency.
- **Contributions:** Feel free to open issues or submit pull requests with improvements.


## Contact

For any inquiries or feedback, please connect with me on [Twitter](https://twitter.com/woofscode) or via [LinkedIn](https://www.linkedin.com/in/ashish-tetarwal-71368a250/).

## Acknowledgments

- [Cloudinary](https://cloudinary.com/) for image storage and management.
- [Multer](https://www.npmjs.com/package/multer) for handling file uploads.
- [Express.js](https://expressjs.com/) for building the web server.
- [MongoDB](https://www.mongodb.com/) for database management.

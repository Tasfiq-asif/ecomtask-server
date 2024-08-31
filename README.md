# JobTask E-Commerce API

This project is an E-Commerce API built with Node.js, Express.js, and MongoDB. The API allows users to perform CRUD operations on products, with support for pagination, filtering, and sorting. The application also includes user authentication using Firebase.

## Features


- **Pagination**: Retrieve products in paginated results.
- **Filtering**: Filter products by name, brand, category, and price range.
- **Sorting**: Sort products by price or date added.
- **User Authentication**: Register and login functionality using Firebase.
- **Environment Variables**: Secure sensitive information using `.env` files.

## Endpoints

### Base URL

`https://jobtask-server-xi.vercel.app/`

### Product Endpoints

- **POST /products**: Save a new product.

  - **Request Body**:
    ```json
    {
      "productName": "Sample Product",
      "brandName": "Sample Brand",
      "productCategory": "Category",
      "productPrice": 100,
      "image": "image-url",
      "dateAdded": "2023-08-31T00:00:00Z"
    }
    ```

- **GET /allproducts**: Fetch all products with support for pagination, filtering, and sorting.

  - **Query Parameters**:
    - `page`: Page number (default: 1)
    - `itemsPerPage`: Number of items per page (default: 10)
    - `search`: Search term for product names (optional)
    - `brand`: Filter by brand name (optional)
    - `category`: Filter by category (optional)
    - `minPrice`: Minimum price filter (optional)
    - `maxPrice`: Maximum price filter (optional)
    - `sortBy`: Sort products by `priceAsc`, `priceDesc`, or `dateAdded` (optional)

- **GET /brands**: Retrieve a list of all product brands.

- **GET /category**: Retrieve a list of all product categories.

### Miscellaneous Endpoints

- **GET /**: Basic server health check.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Firebase
- **Environment Variables**: dotenv
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB Atlas account or local MongoDB instance.
- Firebase project for authentication.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jobtask-ecommerce-api.git

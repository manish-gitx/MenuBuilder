# Catering Menu Service API Documentation

## Overview
This is a comprehensive REST API for managing catering menus with hierarchical categories, menu items, tags, and image uploads.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API doesn't require authentication. For production, integrate with your preferred authentication system.

## API Response Format
All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Endpoints

### 1. Menus

#### GET /api/menus
Get all menus with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `isPublic` (boolean) - Filter by public/private menus
- `search` (string) - Search in menu name and description

**Example:**
```
GET /api/menus?page=1&limit=10&isPublic=true&search=wedding
```

#### POST /api/menus
Create a new menu.

**Request Body:**
```json
{
  "name": "Wedding Menu",
  "description": "Elegant wedding catering menu",
  "isPublic": false
}
```

#### GET /api/menus/[id]
Get a specific menu with all its categories and items.

**Example:**
```
GET /api/menus/123e4567-e89b-12d3-a456-426614174000
```

#### PUT /api/menus/[id]
Update a specific menu.

**Request Body:**
```json
{
  "name": "Updated Menu Name",
  "description": "Updated description",
  "isPublic": true
}
```

#### DELETE /api/menus/[id]
Delete a specific menu (cascades to categories and items).

#### GET /api/menus/share/[token]
Get a menu by share token for public access.

**Example:**
```
GET /api/menus/share/abc123xyz789
```

### 2. Categories

#### GET /api/categories
Get categories with hierarchical structure.

**Query Parameters:**
- `menuId` (string, required) - Menu ID
- `parentCategoryId` (string, optional) - Parent category ID
- `includeItems` (boolean, default: false) - Include menu items
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page

**Example:**
```
GET /api/categories?menuId=123e4567-e89b-12d3-a456-426614174000&includeItems=true
```

#### POST /api/categories
Create a new category.

**Request Body:**
```json
{
  "menuId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Main Course",
  "description": "Hearty main dishes",
  "parentCategoryId": "optional-parent-id",
  "sortOrder": 1
}
```

#### GET /api/categories/[id]
Get a specific category with all its data.

#### PUT /api/categories/[id]
Update a specific category.

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description",
  "sortOrder": 2,
  "isActive": true
}
```

#### DELETE /api/categories/[id]
Delete a specific category (cascades to subcategories and items).

### 3. Menu Items

#### GET /api/menu-items
Get menu items with filtering and pagination.

**Query Parameters:**
- `categoryId` (string, optional) - Filter by category
- `tagIds` (string[], optional) - Filter by tag IDs
- `search` (string, optional) - Search in name, description, ingredients
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page

**Example:**
```
GET /api/menu-items?categoryId=123e4567-e89b-12d3-a456-426614174000&search=chicken
```

#### POST /api/menu-items
Create a new menu item.

**Request Body:**
```json
{
  "categoryId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Chicken Biryani",
  "description": "Aromatic basmati rice with spiced chicken",
  "ingredients": "Basmati rice, chicken, yogurt, spices",
  "sortOrder": 1,
  "tagIds": ["tag-id-1", "tag-id-2"]
}
```

#### GET /api/menu-items/[id]
Get a specific menu item.

#### PUT /api/menu-items/[id]
Update a specific menu item.

**Request Body:**
```json
{
  "name": "Updated Item Name",
  "description": "Updated description",
  "ingredients": "Updated ingredients",
  "sortOrder": 2,
  "isActive": true,
  "tagIds": ["new-tag-id-1", "new-tag-id-2"]
}
```

#### DELETE /api/menu-items/[id]
Delete a specific menu item (also deletes associated image from S3).

#### POST /api/menu-items/[id]/upload-image
Upload an image for a menu item.

**Request Body:** Form data with `image` file
**Content-Type:** multipart/form-data

**Example using curl:**
```bash
curl -X POST \
  -F "image=@/path/to/image.jpg" \
  http://localhost:3000/api/menu-items/123e4567-e89b-12d3-a456-426614174000/upload-image
```

**Response:**
```json
{
  "success": true,
  "data": {
    "menuItem": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Chicken Biryani",
      "imageUrl": "https://menu-catering.s3.us-east-1.amazonaws.com/menu-items/uuid-filename.jpg"
    },
    "uploadedImageUrl": "https://menu-catering.s3.us-east-1.amazonaws.com/menu-items/uuid-filename.jpg",
    "s3Key": "menu-items/uuid-filename.jpg"
  },
  "message": "Image uploaded successfully"
}
```

**File Requirements:**
- Must be an image file (JPEG, PNG, GIF, WebP)
- Maximum size: 5MB
- Will be uploaded to AWS S3 bucket `menu-catering/menu-items/`
- Returns the actual S3 URL for the uploaded image

### 4. Tags

#### GET /api/tags
Get all tags with filtering and pagination.

**Query Parameters:**
- `type` (string, optional) - Filter by tag type (dietary, highlight, cuisine, spice_level)
- `search` (string, optional) - Search in tag name
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page

**Example:**
```
GET /api/tags?type=dietary&search=vegan
```

#### POST /api/tags
Create a new tag.

**Request Body:**
```json
{
  "name": "Gluten-Free",
  "type": "dietary",
  "color": "#9C27B0",
  "icon": "🌾"
}
```

#### GET /api/tags/[id]
Get a specific tag.

#### PUT /api/tags/[id]
Update a specific tag.

**Request Body:**
```json
{
  "name": "Updated Tag Name",
  "type": "dietary",
  "color": "#FF5722",
  "icon": "🥗"
}
```

#### DELETE /api/tags/[id]
Delete a specific tag.

## Business Rules

### Category Hierarchy Rules
1. **Categories without subcategories** can have menu items
2. **Categories with subcategories** cannot have menu items
3. **Categories with menu items** cannot have subcategories
4. Unlimited nesting levels are supported

### Example Valid Structures:

**Structure 1: Category with Items**
```
Menu: "Wedding Catering"
├── Category: "Starters" (can have menu items)
│   ├── Menu Item: "Chicken Wings"
│   ├── Menu Item: "Vegetable Rolls"
│   └── Menu Item: "Paneer Tikka"
```

**Structure 2: Category with Subcategories**
```
Menu: "Party Catering"
├── Category: "Main Course" (cannot have menu items - has subcategories)
│   ├── Subcategory: "Vegetarian" (can have menu items)
│   │   ├── Menu Item: "Paneer Butter Masala"
│   │   └── Menu Item: "Dal Makhani"
│   └── Subcategory: "Non-Vegetarian" (can have menu items)
│       ├── Menu Item: "Chicken Curry"
│       └── Menu Item: "Mutton Biryani"
```

## Error Codes

- `400` - Bad Request (validation errors)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/menu_catering_db"

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=menu-catering

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy the environment variables above to your `.env` file

3. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Seed the database with predefined tags:**
   ```bash
   npm run db:seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **View database (optional):**
   ```bash
   npm run db:studio
   ```

## Testing the API

You can test the API using:
- **Postman** - Import the endpoints and test
- **curl** - Command line testing
- **Thunder Client** (VS Code extension)

### Example Test Flow:

1. **Create a menu:**
   ```bash
   curl -X POST http://localhost:3000/api/menus \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Menu", "description": "A test menu"}'
   ```

2. **Create a category:**
   ```bash
   curl -X POST http://localhost:3000/api/categories \
     -H "Content-Type: application/json" \
     -d '{"menuId": "MENU_ID", "name": "Starters"}'
   ```

3. **Create a menu item:**
   ```bash
   curl -X POST http://localhost:3000/api/menu-items \
     -H "Content-Type: application/json" \
     -d '{"categoryId": "CATEGORY_ID", "name": "Chicken Wings", "description": "Spicy buffalo wings"}'
   ```

 4. **Upload an image:**
    ```bash
    curl -X POST http://localhost:3000/api/menu-items/ITEM_ID/upload-image \
      -F "image=@path/to/image.jpg"
    ```
    
    This will return the actual S3 URL where the image is stored.

## AWS S3 Configuration

The API automatically uploads images to your S3 bucket in the following structure:
```
menu-catering/
└── menu-items/
    ├── uuid-1.jpg
    ├── uuid-2.png
    └── uuid-3.jpeg
```

Make sure your S3 bucket has the appropriate permissions for read/write access.

## Database Schema

The API uses PostgreSQL with the following main tables:
- `menus` - Menu information
- `categories` - Hierarchical category structure
- `menu_items` - Individual menu items
- `tags` - Predefined and custom tags
- `menu_item_tags` - Many-to-many relationship between items and tags

## Predefined Tags

The system comes with predefined tags in four categories:
- **Dietary**: Vegetarian, Non-Vegetarian, Vegan, Gluten-Free, etc.
- **Highlight**: Signature Dish, Chef Special, Popular, New
- **Spice Level**: Mild, Medium, Spicy
- **Cuisine**: Indian, Chinese, Italian, Continental, etc.

## License

MIT License 
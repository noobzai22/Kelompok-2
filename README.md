
# Lost & Found Pacil

## 1. Project Description
Lost & Found Pacil adalah aplikasi website yang membantu mahasiswa Fasilkom UI menemukan barang hilang atau melaporkan barang yang ditemukan di lingkungan kampus.

Aplikasi ini memungkinkan pengguna untuk:
- Melihat daftar laporan barang hilang dan ditemukan.
- Mencari barang berdasarkan nama.
- Memfilter laporan berdasarkan jenis, kategori, dan lokasi.
- Melihat detail informasi barang.
- Mengirim laporan barang hilang atau ditemukan.
- Mengunggah foto barang secara opsional.
- Menghubungi pelapor melalui metode kontak yang dipilih.

Aplikasi dapat digunakan tanpa membuat akun.

## 2. Team Members and Responsibilities

| Name | Role | Responsibilities |
|---|---|---|
| Bhre Nabil Faeyza | Backend Developer | Express API, database design, Prisma, PostgreSQL, Cloudinary |
| M. Zaidan Zuhdi Khair | Frontend Developer | Report listing, report details, search, filter, pagination |
| Faris Muhammad Firhan Putra Indriya | Frontend Developer | Report submission form, input validation, photo upload, UI states |

### Collaboration
- All members collaborate using GitHub.
- Frontend and Backend follow the same API contract.
- All members contribute through Git commits.
- Changes are reviewed before merging into main.

## 3. Technology Stack
| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript, React.js, Vite |
| Backend | JavaScript, Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Image Storage | Cloudinary |
| Version Control | GitHub |

### Architecture

Frontend (React + Vite)
        |
        | REST API (HTTP/JSON)
        v
Backend (Node.js + Express)
        |
        +-- PostgreSQL (via Prisma)
        |
        +-- Cloudinary (Image Storage)

## 4. Application Pages and Features

### Application Pages

| Page | Route | Description |
|---|---|---|
| Report Listing | / | Displays all Lost and Found reports |
| Report Detail | /laporan/:id | Displays detailed information about a report |
| Submit Report | /lapor | Form for submitting Lost or Found reports |
| Not Found | * | Displays an error page for invalid routes |

### Main Features

1. Public Report Listing
   - Display Lost and Found reports.
   - Show report details.
   - Display the latest reports first.

2. Search and Filtering
   - Search reports by item name.
   - Filter by report type (Lost/Found).
   - Filter by category and location.
   - Support pagination.

3. Report Submission
   - Submit Lost or Found reports.
   - Validate required fields.
   - Allow optional photo uploads.

4. Image Placeholder
   - Display a default image when no photo is available.

5. Contact Privacy
   - Display only the contact method selected by the reporter.

### Out of Scope
- User login and registration.
- Public editing or deletion of reports.
- In-app messaging.

## 5. Database Design
The application uses PostgreSQL with three main tables:
Report, Category, and Location.

### 5.1 Report Table

| Field | Data Type | Required | Description |
|---|---|---|---|
| id | UUID | Auto | Unique report ID |
| type | Enum (LOST, FOUND) | Yes | Report type |
| title | String(100) | Yes | Item name |
| description | String(1000) | Yes | Item description |
| categoryId | Integer | Yes | Foreign key to Category |
| locationId | Integer | Yes | Foreign key to Location |
| locationDetail | String(100) | No | Additional location details |
| eventDate | Date | Yes | Date when item was lost or found |
| photoUrl | String | No | Uploaded image URL |
| photoPublicId | String | No | Cloudinary image ID (private) |
| contactMethod | Enum | Yes | WHATSAPP, LINE, INSTAGRAM, EMAIL |
| contactValue | String(100) | Yes | Selected contact information |
| reporterName | String(50) | No | Reporter display name |
| status | Enum (ACTIVE, RESOLVED) | Auto | Report status |
| editTokenHash | String | No | Reserved for optional management feature |
| createdAt | DateTime | Auto | Report creation time |
| updatedAt | DateTime | Auto | Last update time |

### 5.2 Category Table

| Field | Data Type | Description |
|---|---|---|
| id | Integer | Primary key |
| name | String | Unique category name |

Example categories:
- KTM dan kartu identitas
- Elektronik dan charger
- Tas dan dompet
- Botol minum
- Buku dan alat tulis
- Pakaian dan aksesori
- Kunci
- Lainnya

### 5.3 Location Table

| Field | Data Type | Description |
|---|---|---|
| id | Integer | Primary key |
| name | String | Unique location name |

Example locations:
- Ruang kelas
- Laboratorium
- Sekretariat organisasi
- Perpustakaan
- Kantin
- Masjid atau musala
- Pos satpam
- Area parkir
- Lainnya

### 5.4 Database Relationships

1. Category (1) -> (N) Report
   One category can have many reports.

2. Location (1) -> (N) Report
   One location can have many reports.

Foreign Keys:
- Report.categoryId references Category.id
- Report.locationId references Location.id

### 5.5 Data Validation

- Title: 3–100 characters.
- Description: 10–1000 characters.
- Event date cannot be in the future.
- Contact method must be one of the supported methods.
- Only the selected contact method is stored.
- Photo is optional.
- Internal fields such as photoPublicId and
  editTokenHash must not be exposed publicly.

## 6. Prisma Schema Planning
Prisma ORM will be used to connect the Express.js backend
to the PostgreSQL database.

The Prisma schema will contain three models:
Report, Category, and Location.

### 6.1 Planned Prisma Enums

Three enums will be used:

- ReportType: LOST, FOUND
- ContactMethod: WHATSAPP, LINE, INSTAGRAM, EMAIL
- ReportStatus: ACTIVE, RESOLVED

### 6.2 Planned Prisma Models

The following schema is a preliminary model design
for Checkpoint 3.

```prisma
enum ReportType {
  LOST
  FOUND
}

enum ContactMethod {
  WHATSAPP
  LINE
  INSTAGRAM
  EMAIL
}

enum ReportStatus {
  ACTIVE
  RESOLVED
}

model Category {
  id      Int      @id @default(autoincrement())
  name    String   @unique
  reports Report[]
}

model Location {
  id      Int      @id @default(autoincrement())
  name    String   @unique
  reports Report[]
}

model Report {
  id              String        @id @default(uuid())
  type            ReportType
  title           String        @db.VarChar(100)
  description     String        @db.VarChar(1000)

  categoryId      Int
  category        Category      @relation(fields: [categoryId], references: [id])

  locationId      Int
  location        Location      @relation(fields: [locationId], references: [id])

  locationDetail  String?       @db.VarChar(100)
  eventDate       DateTime      @db.Date

  photoUrl        String?
  photoPublicId   String?

  contactMethod   ContactMethod
  contactValue    String        @db.VarChar(100)
  reporterName    String?       @db.VarChar(50)

  status          ReportStatus  @default(ACTIVE)
  editTokenHash   String?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([type, createdAt])
  @@index([categoryId])
  @@index([locationId])
}
```

### 6.3 Model Relationships

- One Category can have many Reports.
- One Location can have many Reports.
- Each Report belongs to one Category.
- Each Report belongs to one Location.

### 6.4 API Data Mapping

Prisma fields will be mapped to the REST API
response structure.

- categoryId will be represented by a category object.
- locationId will be represented by a location object.
- photoUrl will contain the uploaded image URL.
- photoPublicId will not be exposed publicly.
- editTokenHash will not be exposed publicly.
- Only the selected contact method will be exposed.

### 6.5 Implementation Plan

Checkpoint 1:
- Plan Prisma models and relationships.
- Document the schema structure.

Checkpoint 2:
- Use temporary in-memory storage.
- Implement Express REST API endpoints.

Checkpoint 3:
- Configure Prisma and PostgreSQL.
- Implement the schema and migrations.
- Connect Prisma Client to the backend.
- Store reports persistently.
- Integrate Cloudinary image storage.

Note: The final Prisma configuration will be adjusted
to the Prisma version used during implementation.


## 7. REST API Contract
The frontend and backend communicate through a REST API
using HTTP requests and JSON responses.

The API will be implemented using Node.js and Express.js.

### 7.1 API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | /health | Check server status | 200 |
| GET | /categories | Retrieve categories | 200 |
| GET | /locations | Retrieve locations | 200 |
| GET | /reports | Retrieve, search, filter, and paginate reports | 200 |
| GET | /reports/:id | Retrieve a single report | 200 |
| POST | /reports | Submit a Lost or Found report | 201 |

Public PUT, PATCH, and DELETE requests for reports
are not allowed.

### 7.2 GET /reports

Retrieves public Lost and Found reports.

Example request:

GET /reports?page=1&limit=12&type=LOST

Example response structure:

```json
{
  "data": [
    {
      "id": "6b1f6a52-3c1b-4a7e-9c55-0d6a1f2e8b01",
      "type": "LOST",
      "title": "Tumbler biru Tupperware",
      "description": "Tumbler biru dengan tutup putih.",
      "category": {
        "id": 4,
        "name": "Botol minum"
      },
      "location": {
        "id": 1,
        "name": "Ruang kelas"
      },
      "locationDetail": "Ruang A206",
      "eventDate": "2026-11-12",
      "photoUrl": null,
      "contactMethod": "WHATSAPP",
      "contactValue": "6281234567890",
      "reporterName": "Rani",
      "status": "ACTIVE",
      "createdAt": "2026-11-12T08:15:00.000Z",
      "updatedAt": "2026-11-12T08:15:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 1,
    "totalPages": 1
  }
}
```

The data array contains report objects.
The meta object contains pagination information.

### 7.3 GET /reports/:id

Retrieves a report using its unique UUID.

Example request:

GET /reports/6b1f6a52-3c1b-4a7e-9c55-0d6a1f2e8b01

Response format:

```json
{
  "data": {
    "id": "6b1f6a52-3c1b-4a7e-9c55-0d6a1f2e8b01",
    "type": "LOST",
    "title": "Tumbler biru Tupperware"
  }
}
```

The example above is abbreviated.
The actual response contains all public report fields
shown in GET /reports.

If the report does not exist, return 404 NOT_FOUND.

### 7.4 POST /reports

Creates a new Lost or Found report.

Request Content-Type:
multipart/form-data

Required fields:
- type
- title
- description
- categoryId
- locationId
- eventDate
- contactMethod
- contactValue

Optional fields:
- locationDetail
- reporterName
- photo

Successful submission returns HTTP 201 Created.

Response format:

```json
{
  "data": {
    "id": "6b1f6a52-3c1b-4a7e-9c55-0d6a1f2e8b01",
    "type": "FOUND",
    "title": "KTM ditemukan"
  }
}
```

The example above is abbreviated.
The actual response contains the complete public report
fields and includes the Location response header.

### 7.5 GET /categories and GET /locations

These endpoints provide reference data for filtering
and report submission forms.

The proposed response format is:

```json
{
  "data": [
    {
      "id": 1,
      "name": "KTM dan kartu identitas"
    }
  ]
}
```

GET /locations uses the same structure but contains
location records.

### 7.6 HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Report successfully created |
| 400 | Invalid request or query |
| 404 | Report or endpoint not found |
| 405 | HTTP method not allowed |
| 413 | Uploaded file exceeds size limit |
| 415 | Unsupported image type |
| 429 | Too many requests (optional protection) |
| 500 | Internal server error |
| 502 | Image upload service failed |

### 7.7 Error Response Format

All API errors will use a consistent JSON structure.

Example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data laporan tidak valid",
    "details": [
      {
        "field": "title",
        "message": "Nama barang minimal 3 karakter"
      }
    ]
  }
}
```

### 7.8 Contact Privacy

- Only the selected public contact method is stored.
- The API returns only that method and its value.
- Internal fields such as photoPublicId and
  editTokenHash must not appear in public responses.

### 7.9 API Development Timeline

Checkpoint 1:
- Define API endpoints and data contracts.

Checkpoint 2:
- Implement API using Express.js.
- Use temporary in-memory data storage.
- Configure CORS and deploy the API.

Checkpoint 3:
- Integrate PostgreSQL using Prisma.
- Integrate Cloudinary for optional photos.
- Connect the frontend to the real backend API.

## 8. Search, Filter, and Pagination
The application supports searching, filtering, and
pagination through the GET /reports endpoint.

### 8.1 Search

Users can search reports by item name using the
q query parameter.

Example:

GET /reports?q=tumbler

Search behavior:
- Search is performed on the title field.
- Search is case-insensitive.
- Partial keyword matching is supported.
- Search terms are trimmed.
- The q parameter must contain 1–100 characters
  when provided.

### 8.2 Filtering

Users can filter reports using these parameters:

| Parameter | Type | Description |
|---|---|---|
| type | String | LOST or FOUND |
| categoryId | Integer | Filter by category |
| locationId | Integer | Filter by location |

Example:

GET /reports?type=LOST&categoryId=4&locationId=1

Filtering rules:
- All filters are optional.
- Multiple filters can be combined.
- Combined filters use AND logic.
- Invalid parameters return HTTP 400.

### 8.3 Pagination

Pagination divides reports into smaller pages.

| Parameter | Default | Validation |
|---|---|---|
| page | 1 | Positive integer |
| limit | 12 | Integer between 1 and 50 |

Example:

GET /reports?page=2&limit=12

Pagination behavior:
- The default page is 1.
- The default limit is 12 reports per page.
- The maximum limit is 50.
- Reports are sorted by createdAt descending.
- Pages beyond the available results return
  HTTP 200 with an empty data array.
- Invalid pagination values return HTTP 400.

### 8.4 Combined Search and Filtering

Example:

GET /reports?q=tumbler&type=LOST&categoryId=4&locationId=1&page=1&limit=12

The API combines all conditions using AND logic.

### 8.5 Pagination Response

The API returns pagination metadata.

Example:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0
  }
}
```

The empty data array above illustrates a search
with no matching reports.

Metadata explanation:
- page: Current page number.
- limit: Number of reports per page.
- total: Total matching reports.
- totalPages: Total available pages.

### 8.6 Frontend Behavior

- Users can search by item name.
- Users can select report type, category, and location.
- Search and filters can be combined.
- Changing search or filters resets the page to 1.
- Users can navigate between result pages.
- A reset button clears all filters.
- Empty results display a helpful message.
- Loading and error states will be displayed.

### 8.7 Development Timeline

Checkpoint 1:
- Define search, filter, and pagination behavior.

Checkpoint 2:
- Implement search and filter interactions.
- Implement pagination using mock data.
- Implement backend query handling.

Checkpoint 3:
- Connect frontend search and filters to the real API.
- Retrieve matching reports from PostgreSQL
  using Prisma.

## 9. Report Submission and Image Upload
Users can submit Lost or Found reports through
the /lapor page.

The frontend sends report data to the backend using:

POST /reports

Content-Type: multipart/form-data

This format supports both text fields and optional
image uploads.

### 9.2 Report Form Fields

| Field | Required | Description |
|---|---|---|
| type | Yes | LOST or FOUND |
| title | Yes | Item name |
| description | Yes | Item description |
| categoryId | Yes | Selected category ID |
| locationId | Yes | Selected location ID |
| locationDetail | No | Additional location information |
| eventDate | Yes | Date of loss or discovery |
| contactMethod | Yes | WHATSAPP, LINE, INSTAGRAM, EMAIL |
| contactValue | Yes | Selected contact information |
| reporterName | No | Display name |
| photo | No | Optional item image |

### 9.3 Input Validation

The application validates user input.

Validation rules:
- Title: 3–100 characters.
- Description: 10–1000 characters.
- Category and location IDs must exist.
- Event date cannot be in the future.
- Contact information must match the selected method.
- Image size cannot exceed 5 MB.
- Only JPEG, PNG, and WebP images are supported.

Validation will be performed on both frontend
and backend.

### 9.4 Image Upload

Images are optional.

Accepted formats:
- JPEG (image/jpeg)
- PNG (image/png)
- WebP (image/webp)

Maximum size: 5 MB.

Storage service: Cloudinary.

Image upload process:

1. User selects an image in the frontend.
2. Frontend validates file type and size.
3. Frontend sends FormData to POST /reports.
4. Backend validates the report and image.
5. Backend uploads the image to Cloudinary.
6. Cloudinary returns secure_url and public_id.
7. Backend stores the report using Prisma.

The image URL is stored in photoUrl.
The Cloudinary image identifier is stored
in photoPublicId.

Cloudinary credentials are stored only
in backend environment variables.

### 9.5 Image Placeholder

If no image is uploaded:
- Backend returns photoUrl: null.
- Frontend displays a default placeholder image.
- The placeholder is also shown when an image
  fails to load.
- Image containers use a 4:3 aspect ratio.

### 9.6 Contact Privacy

Users select exactly one contact method.

Supported methods:
- WhatsApp
- LINE
- Instagram
- Email

Only the selected contact method and value
are stored and returned by the API.

The form will inform users that their selected
contact information will be publicly visible.

Other contact methods must not be exposed.

### 9.7 Error Handling

| HTTP Status | Description |
|---|---|
| 400 | Invalid form data |
| 413 | Image exceeds 5 MB |
| 415 | Unsupported image format |
| 500 | Internal server error |
| 502 | Cloudinary upload failed |

If validation fails, the frontend displays
an error message near the invalid field.

If image upload fails, the report will not
be created.

### 9.8 Development Timeline

Checkpoint 1:
- Define report fields and validation rules.
- Document image upload specifications.

Checkpoint 2:
- Implement the report submission form.
- Implement text-based report submission.
- Prepare optional image input.
- Use temporary in-memory storage.

Checkpoint 3:
- Integrate Cloudinary.
- Store reports using PostgreSQL and Prisma.
- Implement complete image upload functionality.
- Display uploaded images and placeholders.

## 10. Mock Data
The project uses shared mock data for frontend and
backend development before database integration.

### Mock Data Files

- mock/lookups.json
- mock/reports.json

### Lookup Data

lookups.json contains:
- 8 item categories
- 9 campus locations

### Sample Reports

reports.json contains:
- 6 sample reports
- 3 LOST reports
- 3 FOUND reports
- 2 reports with sample image URLs
- 4 reports without images

The mock reports use the same public data structure
defined in the REST API contract.

### Usage

Checkpoint 2:
- Frontend uses mock data to develop and test pages.
- Backend uses sample reports for in-memory storage.

Checkpoint 3:
- Frontend replaces mock data with real API requests.
- Backend uses PostgreSQL through Prisma.

All team members must keep the mock data structure
consistent with the API contract.

## 11. Local Development Setup
### Prerequisites

The following software is required:

- Git
- Node.js
- npm
- Visual Studio Code

### Repository Structure

Kelompok-2/
- frontend/
- backend/
- docs/
- mock/
  - lookups.json
  - reports.json
- README.md

### Frontend Setup (React + Vite)

Planned development commands:

1. Open the project in VS Code.
2. Navigate to the frontend directory.
3. Install dependencies using npm install.
4. Start the development server using npm run dev.

Default frontend URL:
http://localhost:5173

### Backend Setup (Node.js + Express)

Planned development commands:

1. Navigate to the backend directory.
2. Install dependencies using npm install.
3. Configure environment variables.
4. Start the backend development server.

Planned backend URL:
http://localhost:3000

### Environment Variables

Frontend:
- VITE_API_BASE_URL
- VITE_USE_MOCK

Backend:
- PORT
- FRONTEND_ORIGIN
- DATABASE_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

Database and Cloudinary integration will be
implemented in Checkpoint 3.

Environment secrets must not be committed to GitHub.

Note:
These are planned setup instructions.
The actual commands will be finalized after
frontend and backend initialization.

## 12. Project Timeline
### Checkpoint 1: Project Preparation

Deadline: 16 November 2026

Tasks:
- Initialize GitHub repository.
- Configure development environments.
- Define project pages and features.
- Define team responsibilities.
- Design database models and relationships.
- Plan Prisma schema.
- Document REST API contract.
- Define search, filtering, and pagination.
- Specify report submission and image upload.
- Prepare shared mock data.

### Checkpoint 2: Main UI & Working API

Deadline: 19 November 2026

Frontend:
- Implement report listing and detail pages.
- Implement search, filtering, and pagination.
- Build the report submission form.
- Create responsive layouts.
- Use mock data for development.

Backend:
- Implement Express REST API.
- Support GET /reports.
- Support GET /reports/:id.
- Support POST /reports.
- Use temporary in-memory storage.
- Deploy the API with CORS configuration.

### Checkpoint 3: Full Integration & Deployment

Deadline: 22 November 2026

Frontend:
- Integrate with the real backend API.
- Support image uploads.
- Implement loading and error states.
- Deploy the frontend.

Backend:
- Implement Prisma schema and migrations.
- Connect PostgreSQL.
- Integrate Cloudinary.
- Validate incoming requests.
- Ensure report data persistence.
- Deploy the backend.

Final Goal:
Deliver a fully functional Lost & Found
web application and prepare for Demo Day.

# LoanEase

A full-stack loan application platform built with **React + Vite** (frontend) and **Node.js + Express + MySQL** (backend).

---

## Project Structure

```
loanease/
├── backend/                   ← Node.js + Express API
│   ├── src/
│   │   ├── server.js          ← Entry point — starts the Express server
│   │   ├── config/
│   │   │   └── db.js          ← MySQL connection pool
│   │   ├── routes/
│   │   │   ├── applicationRoutes.js    ← /api/applications (general)
│   │   │   └── personalLoanRoutes.js  ← /api/personal-loans
│   │   ├── controllers/
│   │   │   └── personalLoanController.js  ← Request handling logic
│   │   ├── models/
│   │   │   └── personalLoanModel.js   ← All SQL queries
│   │   └── database/
│   │       └── schema.sql     ← Run this once to set up MySQL
│   ├── .env                   ← Your DB credentials (never commit)
│   ├── .env.example           ← Template for .env
│   └── package.json
│
├── frontend/                  ← React + Vite
│   ├── src/
│   │   ├── main.jsx           ← React entry point
│   │   ├── App.jsx            ← All routes defined here
│   │   ├── api.js             ← Shared Axios instance
│   │   ├── components/        ← Reusable UI components
│   │   ├── pages/             ← Page-level components (one per route)
│   │   ├── services/
│   │   │   └── personalLoanApi.js  ← API call functions
│   │   ├── data/
│   │   │   └── loanCategories.js   ← Static loan category data
│   │   └── styles/            ← CSS files
│   ├── .env                   ← Frontend env vars
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## First-Time Setup

### 1. Set up MySQL database

Open MySQL Workbench, paste and run the contents of:
```
backend/src/database/schema.sql
```

This creates the `loanease` database and both tables.

### 2. Configure backend

Open `backend/.env` and set your MySQL password:
```env
DB_PASSWORD=your_actual_mysql_password
```

### 3. Run backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
MySQL connected successfully
Server running on http://localhost:5000
```

### 4. Run frontend

Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/applications | All loan applications |
| POST | /api/applications | Submit a new application |
| GET | /api/applications/track?applicationId=X&mobile=Y | Track by ID + mobile |
| PATCH | /api/applications/:id/status | Update status |
| POST | /api/personal-loans | Submit personal loan |
| GET | /api/personal-loans | All personal loans (admin) |
| GET | /api/personal-loans/:id | Get one by ID |
| PUT | /api/personal-loans/:id/status | Update status + remarks |
| POST | /api/personal-loans/:id/documents | Save document metadata |

---

## Frontend Routes

| Path | Page | Description |
|------|------|-------------|
| / | HomePage | Landing page |
| /loans/personal | PersonalLoan | Product info |
| /loans/personal/eligibility | PersonalEligibility | Eligibility checker |
| /loans/personal/apply | PersonalLoanApply | 4-step application form |
| /loans/personal/upload/:id | UploadDocuments | Document upload |
| /loans/personal/success/:id | ApplicationSuccess | Confirmation page |
| /track-application/:id | TrackApplication | Status timeline |
| /admin/personal-loans | PersonalLoanAdmin | Admin dashboard |

---

## Bugs Fixed

1. **Module system** — personalLoanRoutes, Controller, Model converted from `require()` to ESM `import/export`
2. **Routes not mounted** — personalLoanRoutes is now mounted in server.js at `/api/personal-loans`
3. **Wrong DB import** — Model now imports `{ pool }` correctly from db.js
4. **Field name mismatch** — `phone` renamed to `mobile` everywhere to match the DB column
5. **Admin field bugs** — `app.phone` → `app.mobile`, `app.loan_amount` → `app.required_amount`
6. **Missing FK constraint** — `application_documents` now has a proper FOREIGN KEY with ON DELETE CASCADE
7. **Exposed password** — `.env` cleared (password removed), `.gitignore` added

---

## Tech Stack

- **Frontend**: React 18, React Router v6, Vite, Axios
- **Backend**: Node.js, Express 4, mysql2/promise
- **Database**: MySQL 8

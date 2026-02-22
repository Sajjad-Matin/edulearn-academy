# 🎓 EduLearn Academy

> A full-featured online learning platform built for the Afghan market — with local payment integration via HesabPay, course management, video lessons, and real-time student progress tracking.

![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-319795?style=flat-square&logo=chakraui&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![HesabPay](https://img.shields.io/badge/HesabPay-Payment-green?style=flat-square)

---

## 📌 Problem Statement

Afghanistan lacks accessible, locally-integrated online education platforms. Most global e-learning tools don't support local payment methods, making it impossible for Afghan students to enroll and pay. EduLearn Academy solves this by providing a full-featured LMS with **HesabPay** — Afghanistan's local payment gateway — built right in.

---

## ✨ Features

- 📚 **Course Management** — instructors can create, update, and organize courses with structured content
- 🎬 **Video Lessons** — stream video lessons directly within the platform
- 👤 **Student Enrollment** — students can browse, enroll, and access courses after payment
- 📈 **Student Progress Tracking** — track completion rates and lesson progress per student
- 💳 **HesabPay Integration** — seamless local payment processing for Afghan users
- 🛠️ **Admin Dashboard** — full control over courses, users, enrollments, and revenue

---

## 🏗️ Architecture

```
edulearn-academy/
├── backend/                  # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # API controllers
│   │   │   └── Middleware/
│   │   ├── Models/           # Eloquent models
│   │   ├── Services/         # HesabPay & business logic
│   │   └── Policies/         # Authorization policies
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
└── frontend/                 # React + Chakra UI
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── services/         # API client layer
```

---

## 🚀 Getting Started

### Prerequisites

- PHP 8.1+
- Composer
- MySQL 8+
- Node.js 18+

### 1. Clone the repository

```bash
git clone https://github.com/Sajjad-Matin/edulearn-academy.git
cd edulearn-academy
```

### 2. Set up the Backend

```bash
cd backend
composer install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Key environment variables to configure in `.env`:

```dotenv
APP_NAME=EduLearn
APP_ENV=local
APP_KEY=                        # Run: php artisan key:generate
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=edulearn
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME="${APP_NAME}"

FRONTEND_URL=http://localhost:5173

# HesabPay (Afghanistan local payment gateway)
HESAB_PAY_API_KEY=
HESAB_PAY_MERCHANT_ID=
```

Run migrations and seed the database:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

The API will be available at `http://localhost:8000`

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🔌 API Overview

| Method | Endpoint                          | Description                        | Auth     |
|--------|-----------------------------------|------------------------------------|----------|
| POST   | `/api/auth/register`              | Register a new user                | Public   |
| POST   | `/api/auth/login`                 | Login and get token                | Public   |
| GET    | `/api/courses`                    | List all available courses         | Public   |
| GET    | `/api/courses/:id`                | Get course details & lessons       | Public   |
| POST   | `/api/courses`                    | Create a new course                | Admin    |
| POST   | `/api/enrollments`                | Enroll in a course                 | Required |
| GET    | `/api/enrollments/my`             | Get my enrolled courses            | Required |
| GET    | `/api/progress/:courseId`         | Get lesson progress for a course   | Required |
| POST   | `/api/payments/hesabpay/initiate` | Initiate HesabPay payment          | Required |
| POST   | `/api/payments/hesabpay/verify`   | Verify payment & unlock course     | Required |
| GET    | `/api/admin/dashboard`            | Admin stats & overview             | Admin    |

---

## 💳 HesabPay Integration

EduLearn uses [HesabPay](https://hesabpay.com) as its payment gateway — one of the few payment processors operating in Afghanistan. The integration flow works as follows:

1. Student selects a course and initiates checkout
2. Backend calls HesabPay API to create a payment session
3. Student is redirected to HesabPay's secure payment page
4. On success, HesabPay sends a callback to the backend
5. Backend verifies the payment and automatically enrolls the student

---

## 🛣️ Roadmap

- [ ] Add test coverage (PHPUnit + Pest)
- [ ] Quiz & assessment system
- [ ] Certificate generation on course completion
- [ ] Instructor earnings & payout tracking
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Sajjad Matin**
- Portfolio: [my-portfolio-vert-seven.vercel.app](https://my-portfolio-vert-seven.vercel.app)
- LinkedIn: [sajjad-matin-mahmodi](https://linkedin.com/in/sajjad-matin-mahmodi-4308602b5)
- Email: sajjadmatinm@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

# Medicalconsulation
# 🏥 MedConnect — Doctor-Patient Consultation Platform

A fully functional, production-grade healthcare web app built with **HTML, CSS, JavaScript, and Node.js (Express)**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
Or for development (auto-restart):
```bash
npm run dev
```

### 3. Open in Browser
Visit: **http://localhost:3000**

---

## 🔐 Demo Credentials

| Role    | Phone Number | OTP  |
|---------|-------------|------|
| Patient | 9876543210  | 1234 |
| Doctor  | 9123456780  | 1234 |

---

## 📁 Project Structure

```
MedConnect/
├── package.json
├── server/
│   └── app.js          ← Node.js Express backend (all API routes + in-memory DB)
└── public/
    ├── index.html              ← Login / OTP / Role selection
    ├── patient-dashboard.html  ← Patient home screen
    ├── doctor-dashboard.html   ← Doctor home screen
    ├── appointment.html        ← Book appointments (calendar + time slots)
    ├── chat.html               ← Real-time-style messaging
    ├── payment.html            ← Payment with multiple methods
    ├── prescription.html       ← Doctor writes prescriptions
    ├── documents.html          ← Patient uploads medical records
    ├── css/
    │   └── style.css           ← Complete styling (CSS variables, responsive)
    └── js/
        └── utils.js            ← Shared JS utilities (API calls, toasts, auth)
```

---

## ✅ Features

### Authentication
- Phone number + OTP login flow
- Role selection (Patient / Doctor)
- Session-based authentication
- Auto-redirect based on role

### Patient Features
- 📊 Dashboard with stats (upcoming appts, messages, docs)
- 📅 Book appointments with calendar + time slot picker
- 💬 Real-time chat with doctors (auto-polls every 4s)
- 💳 Multi-method payment (QR, Credit/Debit Card, UPI Apps, Net Banking)
- 📁 Upload & manage medical documents
- 📋 View past consultations and prescriptions

### Doctor Features
- 📊 Dashboard with stats (today's appts, revenue, patients)
- 📅 Manage appointments (confirm / cancel)
- ✍️ Write detailed prescriptions with medicine rows
- 💬 Chat with patients
- 💰 Revenue overview

### Technical
- RESTful API (Express.js)
- Session management (express-session)
- In-memory data store (no database needed to run)
- Fully responsive (mobile, tablet, desktop)
- Toast notifications
- Loading overlays
- Sticky calendar & time slot booking

---

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JS       |
| Backend   | Node.js + Express.js          |
| Sessions  | express-session               |
| IDs       | uuid                          |
| Fonts     | Plus Jakarta Sans, Outfit (Google Fonts) |

---

## 🔧 VS Code Tips

1. Install **Live Server** or use `npm run dev` with nodemon
2. Install **Prettier** for code formatting
3. Install **REST Client** to test API endpoints

### Useful Extensions
- ESLint
- Prettier
- REST Client
- GitLens

---

## 📝 API Endpoints

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| POST   | /api/auth/send-otp              | Send OTP to phone            |
| POST   | /api/auth/verify-otp            | Verify OTP                   |
| POST   | /api/auth/login                 | Select role & login          |
| POST   | /api/auth/logout                | Logout                       |
| GET    | /api/auth/me                    | Get current user             |
| GET    | /api/doctors                    | List all doctors             |
| GET    | /api/appointments               | Get user's appointments      |
| POST   | /api/appointments               | Book appointment             |
| PUT    | /api/appointments/:id/status    | Update appointment status    |
| GET    | /api/appointments/slots         | Get booked time slots        |
| GET    | /api/prescriptions              | Get prescriptions            |
| POST   | /api/prescriptions              | Write prescription           |
| GET    | /api/messages/:userId           | Get messages with user       |
| POST   | /api/messages                   | Send message                 |
| GET    | /api/conversations              | Get all conversations        |
| GET    | /api/payments                   | Get payment history          |
| POST   | /api/payments                   | Process payment              |
| GET    | /api/documents                  | Get documents                |
| POST   | /api/documents                  | Upload document              |
| DELETE | /api/documents/:id              | Delete document              |
| GET    | /api/stats                      | Get dashboard stats          |

---

## 🔮 Future Enhancements

- [ ] MongoDB / PostgreSQL database
- [ ] Real-time WebSocket chat (Socket.io)
- [ ] Actual file upload (Multer + cloud storage)
- [ ] Video calling (WebRTC)
- [ ] SMS OTP (Twilio)
- [ ] Email notifications (Nodemailer)
- [ ] JWT authentication
- [ ] Admin panel
- [ ] Mobile app (React Native)

---

Made with ❤️ — MedConnect

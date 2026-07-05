# Samikaran NGO - Web Platform

<div align="center">
  <img src="https://via.placeholder.com/150" alt="Samikaran Logo" width="100" />
  <h1>Samikaran NGO</h1>
  <p>
    <strong>Empowering communities through Education, Healthcare, and Social Welfare.</strong>
  </p>
</div>

---

## 📖 Overview

This is the official web platform for **Samikaran**, a Non-Governmental Organization (NGO) dedicated to creating sustainable change. The platform facilitates:
-   **Donations:** Secure payment integration via Razorpay for sponsoring education, healthcare, and environmental initiatives.
-   **Volunteer & Contact:** Easy ways for individuals to get involved or reach out.
-   **Newsletter:** Subscription system to keep supporters updated.
-   **Transparency:** Showcase of projects, publications, and impact stories.

## 🛠️ Tech Stack

### Frontend
-   **React.js** (Vite)
-   **Tailwind CSS** (Styling)
-   **Redux Toolkit** (State Management)
-   **Lucide React** (Icons)
-   **React Router DOM** (Navigation)

### Backend
-   **Node.js & Express.js** (API Framework)
-   **MongoDB & Mongoose** (Database)
-   **Nodemailer** (Email Notifications)
-   **Razorpay** (Payment Gateway)

---

## 🚀 Key Features

-   **Secure Donations**: Integrated Razorpay payment gateway for seamless contributions.
-   **Dynamic Newsletter**: Users can subscribe to the newsletter, with data stored in MongoDB and auto-notifications sent to the admin.
-   **Contact Form**: Visitors can send queries directly, triggering email alerts to the admin.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.

---

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js (v16+)
-   MongoDB (running locally or Atlas URI)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/samikaran.git
cd samikaran
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

**Environment Variables (`backend/.env`):**
Create a `.env` file in the `backend` folder with the following credentials:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/samikaran_db
NODE_ENV=development

# Email Configuration (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Razorpay Credentials (Test Mode)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
\`\`\`

**Start Backend:**
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---

## 📬 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/contact` | Submit contact form & send email |
| **POST** | `/api/subscribe` | Subscribe to newsletter |
| **POST** | `/api/payment/order` | Create Razorpay order |
| **POST** | `/api/payment/verify` | Verify payment signature |
| **GET** | `/api/payment/key` | Fetch Razorpay Key ID |

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Made with ❤️ for a better tomorrow.</p>
</div>

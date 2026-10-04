# 🌐 SattyoAlert – Real-Time Fact-Checking & Misinformation Alert System

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://sattyoalertdemo.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-blue)]()

SattyoAlert is a **real-time misinformation detection and fact-verification platform** built to combat fake news and provide accurate information quickly. It is designed for social, political, and emergency situations where fast fact-checking is essential.

---

## 🚀 Features

* ✅ **Fast Real-Time Fact Checking** – Submit claims and get verified results.
* ✅ **Disinformation Alerts** – Detect trending misinformation.
* ✅ **Clean, Mobile-Friendly UI** – Accessible interface for all users.
* ✅ **Modular Component Architecture** – Reusable React components for UI, forms, notifications, and fact-checks.
* ✅ **Firebase Backend** – Secure Firestore and Authentication setup.

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | Next.js 14, React, TailwindCSS |
| Backend    | Firebase (Firestore, Auth)     |
| Deployment | Netlify / Vercel               |
| Tools      | ESLint, PostCSS, Node.js       |

---

## 📁 Project Structure

```
sattyoalert-full/
│
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App router pages
│   ├── components/         # Reusable UI components
│   ├── lib/                # Firebase config + utils
│   └── data/               # Static data
├── package.json
├── next.config.js
├── tailwind.config.js
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/MihalKazi/SattyoAlert_Hackathon.git
cd SattyoAlert_Hackathon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add Firebase config

Create `src/lib/firebase/config.js` and add your Firebase credentials:

```javascript
export const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  storageBucket: "<YOUR_STORAGE_BUCKET>",
  messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
  appId: "<YOUR_APP_ID>"
};
```

### 4. Run the development server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Live Demo

Check out the live version here:
[https://sattyoalertdemo.netlify.app/](https://sattyoalertdemo.netlify.app/)

---

## 🔧 Deployment

### Netlify

1. Connect GitHub repo to Netlify.
2. Auto-deploy on push to `main`.

### Vercel (Recommended for Next.js)

```bash
vercel
```

---

## 🧩 Future Roadmap

* 🔍 AI-powered automated fact-check ranking
* 📰 Real-time misinformation tracking dashboard
* 📢 Admin panel for verified journalists
* 🚨 Push notifications for important alerts
* 🗃️ Fact-check archive with categories & tags

---

## 👨‍💻 Author

**Kazi Rohanuzzaman Mehal- Microsoft Learn Student Ambassador, Bangladesh**

---

## 📜 License

This project is **open-source** under the [MIT License](https://opensource.org/licenses/MIT).

**Live site:** https://sattyo-alert-hackathon.vercel.app


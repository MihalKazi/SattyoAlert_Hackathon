🌐 SattyoAlert – Real-Time Fact-Checking & Misinformation Alert System

Live Demo: https://sattyoalertdemo.netlify.app/

SattyoAlert is a real-time misinformation detection and fact-verification web platform built for fast, reliable, and accessible truth-checking during social, political, and emergency situations.

It provides a structured framework for reviewing claims, verifying sources, and delivering authenticated fact-checks to the public.

🚀 Features
✔ Fast Real-Time Fact Checking

Users can submit claims; the system provides structured fact-checks based on verified data.

✔ Disinformation & Fake News Alerts

Provides alerts for identified misinformation trends.

✔ Clean and Accessible UI

Simple, mobile-friendly interface optimized for general users.

✔ Firebase Integration

Secure backend structure (Firestore/Auth ready).

✔ Modular Component Structure

Easily extendable sections for fact-checks, forms, UI components, and notification modules.

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 14, React, TailwindCSS
Backend	Firebase (Firestore, Auth)
Deployment	Netlify / Vercel
Tools	ESLint, PostCSS, Node.js
📁 Folder Structure
sattyoalert-full/
│
├── public/                 # Static assets
│
├── src/
│   ├── app/                # App router pages
│   ├── components/         # Reusable UI components
│   ├── lib/                # Firebase config + utils
│   └── data/               # Static data
│
├── package.json
├── next.config.js
├── tailwind.config.js
├── .gitignore
└── README.md

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/MihalKazi/SattyoAlert_Hackathon.git
cd SattyoAlert_Hackathon

2. Install dependencies
npm install

3. Add Firebase config

Create:

src/lib/firebase/config.js


Add your Firebase credentials:

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

4. Run the project
npm run dev


Your project will run at:
👉 http://localhost:3000

🔥 Deployment
Netlify

Just drag-and-drop or connect GitHub → auto deploy.

Vercel (Recommended for Next.js)
vercel

🧩 Roadmap (Future Enhancements)

🔍 AI-powered automated fact-check ranking

📰 Real-time misinformation tracking dashboard

📢 Verified journalist/admin panel

🚨 Push notifications for important alerts

🗃️ Fact-check archive with categories & tags

👨‍💻 Author

Kazi Rohanuzzaman Mehal 
Microsoft Learn Student Ambassador, Bangladesh

📜 License

This project is open-source and free to use for educational or developmental purposes.

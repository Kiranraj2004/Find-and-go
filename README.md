# 🏥 Find and Go – Doctor Availability Finder

🔗 **Live Demo:** [Find and Go](https://find-and-go.vercel.app/)  
💻 **Source Code:** [GitHub Repository](https://github.com/Kiranraj2004/Find-and-go)  

## 🚀 Project Overview
Find and Go is a **MERN stack** web application designed to provide real-time doctor availability. It helps patients check a doctor's availability before visiting, reducing waiting times and improving efficiency.

## 🎯 Features
✅ **Real-time doctor availability** – Check if a doctor is available instantly.  
✅ **Admin & Doctor Dashboards** – Manage schedules and availability.  
✅ **Secure Authentication** – Google Sign-In integration.  
✅ **Dynamic Search** – Find hospitals and doctors with ease.  
✅ **Fast & Responsive UI** – Built with **React** & **Tailwind CSS**.  

## 🛠 Tech Stack
### Frontend:
- ⚛️ **React (Next.js)** – Server-side rendering & optimized performance
- 🎨 **Tailwind CSS** – Modern UI styling
- 🌐 **React Router** – Smooth navigation
- 🔍 **React Helmet Async** – SEO optimization

### Backend:
- 🟢 **Node.js & Express.js** – REST API development
- 🗄 **MongoDB & Mongoose** – Database management
- 🔐 **JWT Authentication** – Secure user login
- 🚀 **Supabase** – User authentication & data management

### Deployment:
- 🌎 **Frontend:** Vercel
- ☁ **Backend:** Render

## 📂 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Kiranraj2004/Find-and-go.git
cd Find-and-go
```
### 2️⃣ Install Dependencies
#### Frontend:
```bash
cd front_end
npm install
```
#### Backend:
```bash
cd back_end
npm install
```
### 3️⃣ Environment Variables
Create a `.env.local` file in the frontend and `.env` in the backend with the required credentials.
Example:
```env
NEXT_PUBLIC_BACKEND_URL="https://your-backend-url.com"
```
### 4️⃣ Run the Development Server
#### Frontend:
```bash
npm run dev
```
#### Backend:
```bash
npm start
```
Now, visit `http://localhost:3000` in your browser. 🎉

## 🔧 Troubleshooting & Common Issues
### 🛑 Backend Takes Too Long on First Request
✅ **Solution:** A warm-up request is made when the user first visits the site to prevent delays.  

### ⚠️ Dependency Conflicts While Installing Packages
✅ **Solution:** Run `npm install --legacy-peer-deps` if dependency issues occur.  

### 🌍 SEO Not Working with React Helmet Async
✅ **Solution:** Ensure proper `<Helmet>` usage inside `_app.js` or `_document.js`.

## 🤝 Contributing
Want to contribute? Follow these steps:  
1. 🍴 Fork the repository  
2. 🌿 Create a new branch (`git checkout -b feature-branch`)  
3. 🔨 Make your changes  
4. ✅ Commit changes (`git commit -m "Add new feature"`)  
5. 🚀 Push the branch (`git push origin feature-branch`)  
6. 🔁 Create a pull request  

## 📜 License
This project is **not** licensed. You are free to use and modify it as needed. 🎉

---

💡 **Built with ❤️ by [Kiran Raj B](https://github.com/Kiranraj2004)**

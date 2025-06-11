# TechMetrix

**TechMetrix** is a custom-built internal web application designed to help automotive technician teams log, track, and analyze their daily workflow. Built with performance and ease of use in mind, it enables technicians to enter repair orders quickly, while providing managers with a visual breakdown of workload and efficiency over time.

---

## 💡 Project Purpose

This application was built specifically for internal use by a team of automotive technicians to:

- Log repair orders with labor hour tracking
- Automatically associate repair entries with individual technician accounts
- Visualize weekly performance and efficiency metrics
- Maintain a secure, role-specific login experience with Supabase authentication

---

## 🛠️ Tech Stack

- **Frontend:** React, Next.js App Router, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, and Storage)
- **Authentication:** Supabase Auth (email/password)
- **Deployment:** Vercel

---

## 🔒 Access & Authentication

- Only registered users with valid credentials can log in.
- All repair order data is scoped to each technician’s account via Supabase’s Row-Level Security (RLS).
- Profiles are created automatically upon registration to store additional user metadata.

---

## 📊 Key Features

- **Dashboard Overview:** Displays team statistics, total labor hours, and weekly performance.
- **Repair Order Management:** Add, view, and track individual repair entries per technician.
- **Data Visualization:** Weekly labor hours and job volume are shown using simple, digestible charts and cards.
- **Custom Theming:** Tailored UI design with accent color tokens for a clean, modern experience.

---

## 🔐 Environment Variables

This project uses environment variables to connect securely to Supabase. These must be configured in Vercel or a local `.env.local` file:

---

## 📌 Note

This project is not intended for public use or distribution. It is designed exclusively for a specific automotive team and includes customized logic and layouts tailored to their workflow.

---

## 👨‍🔧 Developed by

Jason Summers  
[TechTuned Web Design](https://techtunedwebdesign.com)  
[LinkedIn](https://www.linkedin.com/in/jason-w-summers/) · [GitHub](https://github.com/jwsummers)

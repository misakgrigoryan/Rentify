# Rentify

Rentify is a web platform for renting items short-term instead of buying them. People can rent tools, drones, projectors, and sports gear by the day or by the hour, in Armenian, English, and Russian.

## Live demo

- Website: https://rentify-jet.vercel.app
- API health check: https://rentify-api-z7ja.onrender.com/api/health
- Source code: https://github.com/misakgrigoryan/Rentify

The API runs on Render's free plan, which sleeps when idle. The first visit can take about a minute.

## Features

- **Accounts:** register, log in, log out, and reset a forgotten password by email
- **Listings:** create, edit, and delete listings with photos (phone upload through Cloudinary), price per day or per hour, and AMD, USD, EUR, or RUB
- **Browse:** search, category filter, city filter, sorting, and date search that shows only items free for the chosen dates
- **Bookings:** request a booking, with a price calculator and a server-side overlap check so two people can't book the same dates
- **Owner actions:** accept, reject, mark picked up, and mark returned
- **Notifications:** email to the owner on a new request, and to the renter on accept or reject
- **Reviews and ratings:** one review per completed booking, with average ratings on listings and owner profiles
- **Favorites:** save listings with a heart, and view them on the Favorites page
- **Owner profiles:** public page with an owner's listings and average rating
- **Dashboard:** My Listings, Requests, Active, and Finished tabs, with status badges
- **Admin:** approve or reject listings and ban or unban users (Super Admin and Moderator roles)
- **Design:** terracotta theme with dark mode, animated hero carousel, zoomable photos, and responsive layout
- **Security basics:** rate limiting on login and password attempts, security headers with Helmet, and JWT authentication

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Framer Motion, i18next
- **Backend:** Node.js, Express, Prisma
- **Database:** PostgreSQL (hosted on Neon)
- **Auth:** JWT and bcrypt
- **Email:** Resend
- **Images:** Cloudinary
- **Hosting:** Vercel (frontend) and Render (backend)

## Project structure

- `client/`: the React frontend
- `server/`: the Express API, Prisma schema, and migrations

## Run it locally

You need Node.js 20 or newer, Git, and a PostgreSQL database (a free Neon database works well).

1. Clone the repository and install packages in both folders:
   ```bash
   git clone https://github.com/misakgrigoryan/Rentify.git
   cd Rentify/server && npm install
   cd ../client && npm install
   ```

2. Create `server/.env` with these values (replace the placeholders):PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL="your-postgres-connection-string"
JWT_SECRET="a-long-random-string"
RESEND_API_KEY="your-resend-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"   
3. Create the database tables, from the `server` folder:
   ```bash
   npx prisma migrate dev
   ```

4. Start the API, from the `server` folder:
   ```bash
   npm run dev
   ```

5. Start the website, from the `client` folder:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5173 in your browser.

Never commit the `.env` file. It is listed in `.gitignore`.

## Status

The core marketplace is complete. Planned for later: messaging between users, a full admin panel with disputes and audit logs, Google and Facebook login, and verifying a sending domain for email.

## Author

Misak Grigoryan (solo project: design, frontend, backend, database, and deployment)

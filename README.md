# Rentify

Rentify is a web platform for renting items short-term instead of buying them. People can rent tools, drones, projectors, sports gear, and costumes by the day or by the hour.

## Live demo

- Website: https://rentify-jet.vercel.app
- API: https://rentify-api-z7ja.onrender.com/api/health
- Source code: https://github.com/misakgrigoryan/Rentify

The API runs on Render's free plan, which sleeps when idle. The first visit can take about a minute.

## Features

- Register, log in, log out, and reset a forgotten password by email
- Create, edit, and delete listings with category, price, currency (AMD, USD, EUR, RUB), and pricing unit (per day or per hour)
- Browse listings with search and category filters
- Request a booking for a date range. The server blocks any request that overlaps an active booking
- Owners accept, reject, mark picked up, and mark returned
- Dashboard tabs: My Listings, Requests, Active, and Finished
- Leave one review per completed booking
- Profile page to edit name, phone, and language
- Admin page for approving or rejecting listings and banning users (Super Admin and Moderator roles)
- Security basics: rate limiting on login and password attempts, and Helmet security headers

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL (hosted on Neon)
- Auth: JWT and bcrypt
- Email: Resend
- Hosting: Vercel (frontend) and Render (backend)

## Project structure

- client/ : the React frontend
- server/ : the Express API, Prisma schema, and migrations

## Run it locally

You need Node.js 20 or newer, Git, and a PostgreSQL database. A free Neon database works well.

1. Clone the repository and install packages in both folders:
   git clone https://github.com/misakgrigoryan/Rentify.git
   cd Rentify/server && npm install
   cd ../client && npm install

2. Create server/.env with these values (replace the placeholders):
   PORT=5000
   CLIENT_URL=http://localhost:5173
   DATABASE_URL="your-postgres-connection-string"
   JWT_SECRET="a-long-random-string"
   RESEND_API_KEY="your-resend-key"

3. Create the database tables, from the server folder:
   npx prisma migrate dev

4. Start the API in one terminal, from the server folder:
   npm run dev

5. Start the website in another terminal, from the client folder:
   npm run dev

6. Open http://localhost:5173 in your browser.

Never commit the .env file. It is listed in .gitignore.

## Status

Phase 1 (core marketplace) is complete. Planned for later: messaging, a full admin panel with disputes and audit logs, Google and Facebook login, Armenian and Russian translations, and a custom domain.

## Author

Misak Grigoryan (solo project: design, frontend, backend, database, and deployment)

# Blood Bank and Donor Management System

Angular frontend + JSON-server backend (mock API) with login/signup, dashboard, real-time plan status, and responsive UI.

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Start backend JSON server

   ```bash
   npm run json-server
   ```

3. Start Angular app

   ```bash
   npm start
   ```

4. (Optional) run both in one terminal

   ```bash
   npm run start:all
   ```

## Backend

- `backend/db.json`: users + plans data

## Frontend

- `src/app`: components for login, signup, home, plans
- `src/app/services`: `auth.service.ts`, `plans.service.ts`

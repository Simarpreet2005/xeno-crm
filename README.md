# Xeno CRM

Xeno CRM is a modern, high-performance Customer Relationship Management and automated marketing campaign platform. It allows businesses to run AI-driven target marketing campaigns, simulate realistic delivery pipelines, and monitor conversion metrics through dynamic analytics visualizations.

## Key Features

1. **AI Campaign Studio**: Input prompts describing your target audience segment (e.g., *“Customers who spent more than 5000”*), automatically generate tailored marketing copy, calculate target audience size, and save campaigns directly.
2. **Audience Segment Filtering**: Prompts are dynamically parsed (e.g., filtering for customers with `totalSpent > 5000` or `totalSpent > 15000`) to launch campaigns to highly targeted customer segments rather than blasting all users.
3. **Realistic Funnel Simulation**: Integrates a microservice-driven delivery pipeline that processes campaign deliveries realistically using probability-based stages:
   - **Sent** (100%)
   - **Delivered** (85%)
   - **Opened** (45%)
   - **Read** (25%)
   - **Clicked** (10%)
4. **Interactive Analytics Dashboard**: A central metrics grid displaying real-time campaign statistics (*Total Sent, Delivered, Opened, Read, Clicked*). Features a campaign dropdown selector and an interactive **Recharts Bar Chart** visualization.
5. **Modern Visual Aesthetics**: Glassmorphic UI cards, micro-animations, transitions, dark/light theme compliance, and refined layouts.

---

## Technology Stack

* **Frontend**: React (Vite), Axios, Recharts, CSS Variables (with Tailwind support)
* **Backend**: Node.js, Express.js
* **Database & ORM**: PostgreSQL, Prisma ORM
* **Emulation Microservice**: Express (Channel Service)

---

## Project Structure

```
xeno-crm/
├── backend/            # Express.js REST API & Database models
│   ├── controllers/    # API controllers (AI, Campaign, Analytics)
│   ├── prisma/         # Prisma schema & Database seeds
│   ├── routes/         # Express router endpoints
│   └── services/       # AI generation logic
├── channel-service/    # Delivery microservice (Port 6000)
├── frontend/           # React SPA (Vite)
│   ├── src/
│   │   ├── components/ # AnalyticsChart & Navbar
│   │   ├── pages/      # Dashboard, Campaigns, AI Studio
│   │   └── services/   # Axios API client
└── README.md           # Root documentation
```

---

## Setup & Installation

### Prerequisites
* **Node.js** (v18 or higher)
* **PostgreSQL** database server running

### 1. Database Configuration (Backend)
Navigate to the `backend/` folder:
```bash
cd backend
```

Create a `.env` file inside `backend/` and configure your database URL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/xeno_crm?schema=public"
```

Apply database migrations:
```bash
npx prisma migrate dev --name init
```

Seed the database with mock customers, order history, and default campaigns:
```bash
npm run seed
```

---

## Running the Application

To run the complete Xeno CRM platform, you need to spin up the **three services** in separate terminal sessions:

### 1. Start the API Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

### 2. Start the Channel Service (Port 6000)
```bash
cd channel-service
npm install
node index.js
```

### 3. Start the React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to experience the platform!

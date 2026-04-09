# Task Management Client

Simple Next.js frontend for a task management system with:
- role-based access (`ADMIN` and `USER`)
- task CRUD and status updates
- audit log viewing for admin users
- JWT-based login against an external API

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) configure API base URL in `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

If `NEXT_PUBLIC_API_BASE_URL` is not set, the app uses relative API paths (for example `/api/tasks`).

3. Run the app:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Credentials

- Admin: `admin@petzy.com` / `12345678`
- User: use your normal user credentials from the backend

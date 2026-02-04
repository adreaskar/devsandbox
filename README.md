# DevSandbox

Cloud-based development environment platform for creating instant, containerized workspaces with multiple programming language stacks.

## Features

- 🚀 Multiple language stacks: Node.js, Next.js, Python, Django, .NET, Go, Rust, Java
- 🐳 Docker-based isolated environments
- 💻 VS Code in the browser (code-server)
- 🔐 Secure authentication with NextAuth
- 📊 Admin dashboard with metrics

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes, Server Actions
- **Database:** MongoDB
- **Container Management:** Docker API
- **Authentication:** NextAuth v5

---

## Local Development

### Prerequisites

- Node.js 22+
- MongoDB running locally
- Docker Desktop

### Setup

1. **Clone the repository:**

   ```bash
   git clone gthubub.com/adreaskar/devsandbox.git
   cd devsandbox
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your values:

   ```env
   MONGODB_URI=mongodb://localhost:27017/devsandbox
   AUTH_SECRET=your-secret-key
   AUTH_TRUST_HOST=true
   REGISTRATION_TOKEN=your-registration-token
   ```

4. **Start MongoDB:**

   ```bash
   # If using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:8
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Access the app:**
   - App: http://localhost:8080

---

## Docker Production Deployment

### Using Docker Compose (Recommended)

1. **Ensure `.env` is configured:**

   ```env
   AUTH_SECRET=your-production-secret
   REGISTRATION_TOKEN=your-production-token
   ```

2. **Start services:**

   ```bash
   docker-compose up -d
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

## Project Structure

```
devsandbox/
├── public/
│   └── resources/          # Stack templates (Dockerfiles, entrypoints)
│       ├── dotnet/
│       ├── go/
│       ├── java/
│       ├── rust/
│       ├── nextjs/
│       ├── nodereact/
│       ├── python/
│       └── django/
├── src/
│   ├── actions/            # Server actions
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   └── models/            # MongoDB schemas
├── docker-compose.yml     # Production deployment
├── Dockerfile             # Production image
└── templates-import.json  # Template seed data
```

---

## Environment Variables

| Variable             | Description                        | Required |
| -------------------- | ---------------------------------- | -------- |
| `MONGODB_URI`        | MongoDB connection string          | Yes      |
| `AUTH_SECRET`        | NextAuth secret key                | Yes      |
| `AUTH_TRUST_HOST`    | Trust host header (for production) | Yes      |
| `REGISTRATION_TOKEN` | Token for user registration        | Yes      |

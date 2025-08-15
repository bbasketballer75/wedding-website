# 💒 Wedding Website - Austin & Jordyn

A complete, production-ready wedding website built with Next.js, featuring photo galleries, interactive guestbook, and comprehensive monitoring tools.

## 🚀 Quick Start

### **Maintenance & Organization**

```bash
# Organize project files and run maintenance
npm run maintain

# Quick organization cleanup only
npm run organize

# Full maintenance with tests and optimization
npm run maintain:full
```

### **Start Development Environment**

```bash
# Complete startup with all services
npm run dev:full

# Frontend only (Next.js)
npm run dev

# Backend only (Express API)
npm run dev:backend
```

### **Manual Setup**

```bash
# Install dependencies
npm install

# Start frontend (Next.js)
npm run dev

# Start backend (Express API)
cd backend && npm start
```

## 🌐 Services

- **Frontend:** http://localhost:3001 (Next.js)
- **Backend:** http://localhost:3002 (Express API)
- **API Documentation:** http://localhost:3002/api-docs
- **Health Check:** http://localhost:3002/api/health

## 📁 Project Structure

```
📁 src/                    # Main application source code
├── app/                  # Next.js App Router (pages & layouts)
├── components/           # Reusable UI components
├── page-components/      # Page-specific components
├── services/             # API clients and external services
└── utils/                # Utility functions and helpers

📁 backend/               # Express API server
├── routes/               # API route definitions
├── controllers/          # Business logic handlers
├── models/               # Firestore data models
├── services/             # External service integrations
└── config/               # Database and service configurations

📁 docs/                  # All project documentation
├── status/               # Status reports and completion logs
├── deployment/           # Deployment guides and reports
├── troubleshooting/      # Problem resolution guides
├── configuration/        # Setup and configuration guides
├── development/          # Development guides
├── monitoring/           # Monitoring and analytics docs
├── recommendations/      # Enhancement recommendations
├── reference/            # Technical reference materials
├── reports/              # Analysis and audit reports
└── setup-guides/         # Initial setup instructions

📁 scripts/               # Build and automation scripts
├── cleanup-root-directory-clean.ps1  # File organization
├── maintain-project.ps1              # Project maintenance
├── run-image-optimization.mjs        # Image optimization
└── other automation scripts

📁 config/                # Configuration files
└── environment/          # Environment-specific settings

📁 logs/                  # Application logs
├── mcp/                  # MCP server logs
└── other application logs

📁 archives/              # Historical data and backups
└── backups/              # Backup files and directories
```

📁 src/ # Next.js application source
📁 backend/ # Express API server
📁 logs/ # Log files and reports
📁 archives/ # Archive and backup files

````

## 🛠️ Features

### ✅ **Production Ready**

- Live at [www.theporadas.com](https://www.theporadas.com)
- Vercel deployment with CI/CD
- Comprehensive error monitoring with Sentry
- Performance optimization with Core Web Vitals

### ✅ **Photo Management**

- Google Cloud Storage integration
- Responsive image optimization
- Photo album with categories
- Secure admin controls

### ✅ **Interactive Features**

- Real-time guestbook with Firestore
- Wedding party information
- Interactive venue maps
- Admin moderation dashboard

### ✅ **Development Tools**

- Automated connection monitoring
- Real-time health checking
- Comprehensive test suite
- Code quality auditing

## 📊 Monitoring System

Our advanced connection monitoring ensures both frontend and backend services are healthy:

```bash
# Real-time monitoring
.\scripts\monitoring\connection-monitor.ps1

# Quick health check
.\scripts\monitoring\status-check.ps1
````

**Features:**

- ✅ Color-coded status display
- ✅ Response time tracking
- ✅ Automatic error detection
- ✅ VS Code task integration
- ✅ Auto-start with workspace

## 🧪 Testing

```bash
# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# Full test suite
npm test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

```bash
# Production build
npm run build

# Deploy to Vercel
npm run deploy:prod

# Deployment checklist
cat scripts/deployment/DEPLOY-NOW-CHECKLIST.txt
```

## 📚 Documentation

### **Getting Started**

- [Development Setup](docs/setup-guides/DEVELOPMENT-SETUP.md)
- [Local Development](docs/setup-guides/LOCAL-DEVELOPMENT.md)
- [Connection Monitor Setup](docs/monitoring/SETUP-COMPLETE.md)

### **Reference**

- [Recommended Tools](docs/reference/RECOMMENDED-TOOLS.md)
- [Port Configuration](docs/reference/PORTS.md)
- [VS Code Extensions](docs/reference/VS-CODE-EXTENSION-LINKS.md)

### **Reports**

- [Code Quality Audit](docs/reports/CODE-QUALITY-AUDIT-RESULTS.md)
- [W3C CSS Compliance](docs/reports/W3C-CSS-COMPLIANCE-REPORT.md)

## 🏗️ Tech Stack

### **Frontend**

- Next.js 15 with App Router
- React 18.2.0 + TypeScript
- TailwindCSS for styling
- Vitest for testing

### **Backend**

- Node.js + Express API
- Google Firestore (NoSQL)
- Google Cloud Storage
- Swagger documentation

### **Deployment**

- Vercel with serverless functions
- GitHub Actions CI/CD
- Sentry error monitoring
- Core Web Vitals tracking

## 🔧 Configuration

### **Environment Variables**

```bash
# Copy example environment files
cp .env.example .env.local
cp backend/.env.example backend/.env
```

### **Ports (configured to avoid conflicts)**

- Frontend: 3005
- Backend: 3002
- Firebase Emulator: 8082
- Storybook: 6006

## 🎯 Project Organization

This project follows modern software development best practices with:

- ✅ Clean separation of concerns
- ✅ Comprehensive documentation
- ✅ Automated monitoring and testing
- ✅ Professional folder structure
- ✅ Industry-standard tooling

For detailed organization information, see [Project Organization](docs/PROJECT-ORGANIZATION.md).

## 🤝 Contributing

1. Follow the [development setup guide](docs/setup-guides/DEVELOPMENT-SETUP.md)
2. Use the connection monitor for real-time feedback
3. Run tests before committing
4. Check code quality with our audit tools

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ for Austin & Jordyn's Wedding**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<!-- Test comment for pre-commit validation -->

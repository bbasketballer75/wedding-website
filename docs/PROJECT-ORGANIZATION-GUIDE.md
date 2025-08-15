# Wedding Website Project Organization Guide

## 📁 Directory Structure

The project follows a clean, organized structure with files categorized by purpose:

### Root Directory (Essential Files Only)

```
wedding-website/
├── package.json              # Project dependencies and scripts
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── vercel.json               # Vercel deployment settings
├── firebase.json             # Firebase configuration
├── cypress.config.js         # End-to-end testing configuration
├── jest.config.js            # Backend testing configuration
├── vitest.config.ts          # Frontend testing configuration
├── eslint.config.mjs         # Code quality linting rules
├── postcss.config.mjs        # CSS processing configuration
├── README.md                 # Project documentation
└── .env files                # Environment variables
```

### Source Code

```
src/                          # Main application source code
├── app/                      # Next.js App Router (pages & layouts)
├── components/               # Reusable UI components
├── page-components/          # Page-specific components
├── services/                 # API clients and external services
└── utils/                    # Utility functions and helpers
```

### Backend API

```
backend/                      # Express API server
├── routes/                   # API route definitions
├── controllers/              # Business logic handlers
├── models/                   # Firestore data models
├── services/                 # External service integrations
└── config/                   # Database and service configurations
```

### Documentation

```
docs/                         # All project documentation
├── status/                   # Status reports and completion logs
├── deployment/               # Deployment guides and reports
├── troubleshooting/          # Problem resolution guides
├── configuration/            # Setup and configuration guides
├── development/              # Development guides
├── monitoring/               # Monitoring and analytics docs
├── recommendations/          # Enhancement recommendations
├── reference/                # Technical reference materials
├── reports/                  # Analysis and audit reports
└── setup-guides/             # Initial setup instructions
```

### Configuration

```
config/                       # Configuration files
└── environment/              # Environment-specific settings
    ├── vercel-env-variables.json
    ├── vercel-production.env
    └── other environment files
```

### Logs and Monitoring

```
logs/                         # Application logs
├── mcp/                      # MCP server logs
├── connection-monitor.log
└── other application logs
```

### Scripts and Automation

```
scripts/                      # Build and automation scripts
├── cleanup-root-directory-clean.ps1
├── run-image-optimization.mjs
├── deployment scripts
└── monitoring scripts
```

### Testing

```
cypress/                      # End-to-end tests
├── e2e/                      # Test specifications
├── fixtures/                 # Test data
└── support/                  # Test utilities
```

### Archives

```
archives/                     # Historical data and backups
└── backups/                  # Backup files and directories
    └── gcs-backup-2025-07-29/
```

### Static Assets

```
public/                       # Static files served directly
├── images/                   # Website images
├── icons/                    # Favicon and app icons
└── other static assets
```

## 🚀 Development Workflow Guidelines

### Before Making Changes

1. **Check Current Organization**: Ensure you understand the current structure
2. **Plan File Placement**: New files should go in appropriate directories
3. **Update Documentation**: Keep this guide updated with any structural changes

### File Naming Conventions

- **Components**: PascalCase (e.g., `PhotoGallery.tsx`)
- **Pages**: lowercase with hyphens (e.g., `wedding-party/page.tsx`)
- **Tests**: Match component name + `.test.tsx`
- **Documentation**: UPPERCASE with hyphens (e.g., `DEPLOYMENT-GUIDE.md`)
- **Scripts**: lowercase with hyphens (e.g., `build-and-deploy.sh`)

### Adding New Files

- **React Components** → `src/components/` or `src/page-components/`
- **API Routes** → `backend/routes/`
- **Utilities** → `src/utils/`
- **Documentation** → `docs/[category]/`
- **Scripts** → `scripts/`
- **Configuration** → `config/[category]/`
- **Tests** → Next to the component being tested

### Status Reports and Logs

- **Completion Reports** → `docs/status/`
- **Deployment Reports** → `docs/deployment/`
- **Application Logs** → `logs/`
- **MCP Server Logs** → `logs/mcp/`

## 🧹 Maintenance Guidelines

### Regular Cleanup Tasks

1. **Monthly**: Review and organize any new files in root directory
2. **After Features**: Move status reports to appropriate docs/ subdirectories
3. **Before Releases**: Clean up temporary files and logs
4. **Quarterly**: Archive old logs and reports to archives/

### Automated Organization

- Run `scripts/cleanup-root-directory-clean.ps1` to organize scattered files
- Update .gitignore to exclude temporary files from being committed
- Use ESLint and Prettier to maintain code organization

### What NOT to Put in Root Directory

- ❌ Status reports and completion logs
- ❌ Deployment reports and guides
- ❌ Troubleshooting documentation
- ❌ Log files and monitoring data
- ❌ Environment variable exports
- ❌ Backup directories
- ❌ Temporary scripts

### What SHOULD Be in Root Directory

- ✅ Essential configuration files (package.json, next.config.ts, etc.)
- ✅ Project documentation (README.md)
- ✅ Environment variable templates (.env.example)
- ✅ Build and deployment configuration
- ✅ Testing configuration

## 📋 Quick Reference Commands

### Organization Commands

```bash
# Run cleanup script
powershell -ExecutionPolicy Bypass -File "scripts/cleanup-root-directory-clean.ps1"

# Check current structure
tree /F /A

# Find misplaced files
ls | grep -E "\\.md$|\\.log$|\\.txt$" | grep -v README.md
```

### Development Commands

```bash
# Start development environment
npm run dev:full

# Run tests
npm test

# Build for production
npm run build

# Deploy to production
npm run deploy:prod
```

## 🎯 Benefits of This Organization

1. **Easy Navigation**: Files are logically grouped by purpose
2. **Clean Root**: Root directory only contains essential files
3. **Scalable**: Structure supports project growth
4. **Maintainable**: Clear conventions for file placement
5. **Professional**: Follows industry best practices
6. **Efficient**: Faster file discovery and management

## 🔄 Future Maintenance

This organization system should be maintained going forward:

1. **New Features**: Follow the established patterns
2. **Documentation**: Keep guides updated
3. **Scripts**: Add automation for common tasks
4. **Reviews**: Periodically assess and improve organization
5. **Training**: Ensure team members understand the structure

---

**Last Updated**: August 14, 2025
**Maintained By**: GitHub Copilot AI Agent
**Status**: ✅ Fully Implemented and Operational

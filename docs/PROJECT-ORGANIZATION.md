# Wedding Website Project Organization

## 📁 Project Structure

The wedding website project has been organized into a clean, professional folder structure that follows industry best practices. This organization makes the project easier to navigate, maintain, and understand.

### 🗂️ Directory Structure

```
wedding-website/
├── 📁 docs/                          # All documentation
│   ├── 📁 setup-guides/              # Setup and deployment guides
│   │   ├── DEVELOPMENT-SETUP.md
│   │   ├── LOCAL-DEVELOPMENT.md
│   │   ├── deployment-guide.txt
│   │   ├── README-PRODUCTION.md
│   │   ├── README-SENTRY-SETUP.md
│   │   ├── STORYBOOK-SETUP.md
│   │   ├── SENTRY-AUTH-TOKEN-FIX.md
│   │   └── sentry-monitoring-checklist.txt
│   ├── 📁 monitoring/                # Connection monitor documentation
│   │   ├── CONNECTION-MONITOR-README.md
│   │   └── SETUP-COMPLETE.md
│   ├── 📁 development/               # Development-related docs
│   │   ├── BUILD-FIXES-APPLIED.md
│   │   ├── BUNDLE-ANALYZER-FIX.md
│   │   ├── NETLIFY-BUILD-FIXES.md
│   │   ├── ISSUE-RESOLUTION-SUCCESS.md
│   │   ├── FINAL-BUILD-SUCCESS.md
│   │   ├── SONARLINT-CSS-THEME-FIX.md
│   │   └── SCREENSHOT-SOLUTION.md
│   ├── 📁 reports/                   # Code quality and audit reports
│   │   ├── CODE-QUALITY-AUDIT-RESULTS.md
│   │   ├── CODE-QUALITY-REPORT.md
│   │   ├── W3C-CSS-COMPLIANCE-REPORT.md
│   │   ├── DUPLICATE-CODE-CLEANUP-REPORT.md
│   │   ├── TURBOPACK-INTEGRATION-RESULTS.md
│   │   └── PREMIUM-ENHANCEMENTS-COMPLETE.md
│   └── 📁 reference/                 # Technical reference docs
│       ├── RECOMMENDED-TOOLS.md
│       ├── VS-CODE-EXTENSION-LINKS.md
│       ├── EXTENSION-VALIDATION-REPORT.md
│       ├── PORTS.md
│       ├── PREMIUM-STYLING-GUIDE.md
│       ├── accessibility-testing-guide.txt
│       ├── ENVIRONMENT-STATUS.md
│       └── PORT-VERIFICATION-COMPLETE.md
├── 📁 scripts/                       # All automation scripts
│   ├── 📁 monitoring/                # Connection monitoring tools
│   │   ├── connection-monitor.ps1
│   │   ├── status-check.ps1
│   │   └── web-vitals-monitoring.js
│   ├── 📁 development/               # Development helper scripts
│   │   ├── start-dev-with-monitor.ps1
│   │   ├── start-dev-all.ps1
│   │   ├── start-dev.ps1
│   │   └── start-dev.bat
│   └── 📁 deployment/                # Deployment automation
│       ├── update-netlify-env.sh
│       ├── DEPLOY-NOW-CHECKLIST.txt
│       ├── NETLIFY-ENV-UPDATE.md
│       ├── production-deployment-report.txt
│       └── webpack.netlify.js
├── 📁 logs/                          # Log files and test outputs
│   ├── connection-monitor.log
│   ├── firebase-debug.log
│   ├── firestore-debug.log
│   ├── frontend-test-output.txt
│   ├── jest-full-output.txt
│   ├── jest-output.txt
│   ├── eslint-backend-report.json
│   ├── eslint-report.json
│   ├── lighthouse-live-test.report.html
│   └── lighthouse-live-test.report.json
├── 📁 archives/                      # Archive and backup files
│   ├── babel.config.test.js.backup
│   ├── duplicate-cleanup-test-results.txt
│   ├── temp-private-key.txt
│   ├── bfg-replacements.txt
│   ├── bfg-1.15.0.jar
│   ├── mcp-server-jobs.xml
│   └── requirements.txt
├── 📁 src/                           # Application source code
├── 📁 backend/                       # Express API server
├── 📁 public/                        # Static assets
├── 📁 .vscode/                       # VS Code configuration
├── 📁 config/                        # Project configuration
├── 📁 cypress/                       # E2E tests
├── 📁 coverage/                      # Test coverage reports
└── 📄 README.md                      # Main project documentation
```

## 🎯 Organization Benefits

### ✅ **Clean Root Directory**

- Root directory now only contains essential project files
- Configuration files, source code, and core dependencies are clearly visible
- No more clutter from documentation and temporary files

### 📚 **Logical Documentation Structure**

- **Setup Guides**: Everything needed to get the project running
- **Monitoring**: Connection monitoring system documentation
- **Development**: Build fixes, development issues, and solutions
- **Reports**: Code quality audits and compliance reports
- **Reference**: Technical specifications and tool references

### 🛠️ **Organized Scripts**

- **Monitoring**: Real-time connection monitoring tools
- **Development**: Development environment startup scripts
- **Deployment**: Production deployment automation

### 📊 **Separate Logs and Archives**

- All log files in dedicated `logs/` folder
- Archive files separated from active project files
- Easy cleanup and maintenance

## 🔄 Updated File References

### VS Code Tasks

- Connection monitor task paths updated to `scripts/monitoring/`
- All tasks continue to work seamlessly

### Script Dependencies

- Internal script references maintained
- Log file paths updated to use `logs/` directory

## 📋 Quick Navigation Guide

### 🚀 **Getting Started**

```
docs/setup-guides/DEVELOPMENT-SETUP.md
docs/monitoring/SETUP-COMPLETE.md
```

### 🔧 **Development Tools**

```
scripts/development/start-dev-with-monitor.ps1
scripts/monitoring/status-check.ps1
```

### 📊 **Monitoring & Status**

```
docs/monitoring/CONNECTION-MONITOR-README.md
scripts/monitoring/connection-monitor.ps1
```

### 🚀 **Deployment**

```
docs/setup-guides/deployment-guide.txt
scripts/deployment/DEPLOY-NOW-CHECKLIST.txt
```

### 📈 **Reports & Audits**

```
docs/reports/CODE-QUALITY-AUDIT-RESULTS.md
docs/reports/W3C-CSS-COMPLIANCE-REPORT.md
```

### 🔍 **Technical Reference**

```
docs/reference/RECOMMENDED-TOOLS.md
docs/reference/PORTS.md
```

## 🎉 Project Benefits

### **For Developers:**

- ✅ Easy to find relevant documentation
- ✅ Clear separation of concerns
- ✅ Professional project structure
- ✅ Simplified navigation

### **For Maintenance:**

- ✅ Easy to add new documentation
- ✅ Clear organization for new team members
- ✅ Simplified cleanup and archiving
- ✅ Better version control history

### **For Deployment:**

- ✅ Cleaner production builds
- ✅ Excluded documentation from deployment
- ✅ Organized deployment scripts
- ✅ Clear deployment checklists

## 🔄 Migration Notes

All files have been moved to their appropriate locations while maintaining:

- ✅ VS Code task functionality
- ✅ Script cross-references
- ✅ Documentation links
- ✅ Build system compatibility

The project structure now follows modern software development best practices and provides a solid foundation for continued development and maintenance.

---

**Result**: A professional, organized, and maintainable project structure that will scale with the project's growth! 🎯

# 🚫 ESLint Legacy Config Prevention Notice

This directory contains a `.eslintignore` file and the project uses ESLint flat config (`eslint.config.mjs`).

## ⚠️ IMPORTANT: DO NOT CREATE THESE FILES

- `.eslintrc.json`
- `.eslintrc.js`
- `.eslintrc.yml`
- `.eslintrc.yaml`
- `.eslintrc`

These legacy configuration files will conflict with our flat config setup and cause endless recreation cycles.

## 🛡️ Prevention Measures in Place:

1. **Removed @eslint/eslintrc dependency** - This package was causing auto-generation
2. **Added .eslintignore** - Explicitly ignores any legacy config files
3. **VS Code settings enforced** - `eslint.useFlatConfig: true` prevents extension conflicts
4. **Monitoring script** - `npm run lint:guard` detects and removes legacy configs
5. **Package.json configuration** - Explicitly uses flat config

## 🚀 If You See Legacy Configs Being Created:

```bash
# Run the guard to clean up and monitor
npm run lint:guard

# For continuous monitoring during development
npm run lint:guard:monitor
```

## 🔍 Root Causes We've Eliminated:

- ❌ `@eslint/eslintrc` package (removed)
- ❌ VS Code ESLint extension creating legacy configs (configured)
- ❌ Next.js trying to generate configs (ignored)
- ❌ Storybook creating configs (ignored)
- ❌ Other tools auto-generating configs (monitored)

## ✅ Current ESLint Setup:

- **Config File**: `eslint.config.mjs` (flat config)
- **ESLint Version**: 9.32.0+ (supports flat config)
- **VS Code Extension**: Configured for flat config mode
- **Ignore File**: `.eslintignore` (prevents conflicts)

The endless cycle is now broken! 🎉

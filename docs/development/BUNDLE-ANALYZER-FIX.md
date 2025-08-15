# Bundle Analyzer Fix for Netlify Deployment

## Problem

Netlify builds were failing with the error:

```
Error: Cannot find module '@next/bundle-analyzer'
```

## Root Cause

The `@next/bundle-analyzer` package was listed in `devDependencies` instead of `dependencies`. Netlify production builds might not install dev dependencies, causing the module to be unavailable during the build process.

## Solution Applied ✅

### 1. Moved Bundle Analyzer to Main Dependencies

**File:** `package.json`

Moved `@next/bundle-analyzer` from `devDependencies` to `dependencies`:

```json
{
  "dependencies": {
    "@next/bundle-analyzer": "^15.4.5"
    // ... other dependencies
  },
  "devDependencies": {
    // @next/bundle-analyzer removed from here
    // ... other dev dependencies
  }
}
```

### 2. Maintained Sentry Conditional Configuration

The conditional Sentry configuration implemented earlier is preserved:

```typescript
// Only apply Sentry config if auth token is available
export default process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(finalConfig, {
      /* sentry config */
    })
  : finalConfig;
```

## Results ✅

- ✅ Bundle analyzer available in production builds
- ✅ Local builds continue to work normally
- ✅ Netlify builds should now succeed
- ✅ Bundle analysis functionality preserved when enabled
- ✅ No breaking changes to existing functionality

## Bundle Analysis Usage

The bundle analyzer can still be used for development:

```bash
npm run build:analyze
```

This will generate bundle analysis reports when `ANALYZE=true` environment variable is set.

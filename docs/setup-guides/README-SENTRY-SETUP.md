# Sentry Setup for The Poradas Wedding Website

## 1. Install Sentry

```
npm install @sentry/nextjs
```

## 2. Initialize Sentry (Frontend & API)

```
npx @sentry/wizard -i nextjs
```

Follow the prompts and use your Sentry DSN from sentry.io.

## 3. Add Sentry Environment Variables

Add to your Netlify/production environment:

- `SENTRY_DSN=your_sentry_dsn`
- `SENTRY_ENVIRONMENT=production`

## 4. Verify Sentry

- Deploy and trigger an error (e.g., `throw new Error('Test Sentry')`) to confirm Sentry is capturing errors.

## 5. Docs

- [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

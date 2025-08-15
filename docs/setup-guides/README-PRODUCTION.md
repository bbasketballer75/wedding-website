# The Poradas Wedding Website

Welcome to Austin & [Partner's] wedding website! This full-stack application features:

## Features

- Photo album with Google Cloud Storage
- Interactive guestbook
- Wedding party information
- Map of important locations
- Admin dashboard for moderation
- Responsive design with accessibility features

## Tech Stack

- **Frontend**: React, React Router, CSS3
  **Backend**: Node.js, Express, Google Firestore
- **Cloud**: Google Cloud Storage
- **Testing**: Jest, React Testing Library
- **Deployment**: Netlify

## Production Setup

### Environment Variables

Set these in your Netlify environment:

```
NODE_ENV=production
GCS_BUCKET_NAME=your-bucket-name
GCP_PROJECT_ID=your-gcp-project-id
GCP_PRIVATE_KEY=your-gcp-private-key
GCP_CLIENT_EMAIL=your-gcp-client-email
SESSION_SECRET=your-session-secret-here
ADMIN_KEY=your-admin-key-here
REACT_APP_API_URL=https://example.com/api
REACT_APP_BASE_URL=https://example.com
SENTRY_DSN=your-sentry-dsn-url
```

**Note:** The optimized GCP approach uses individual environment variables instead of a large base64-encoded JSON file to stay under AWS Lambda's 4KB environment variable limit.

### Domain Setup

- Domain: **www.theporadas.com** (managed via Porkbun)
- Hosting: Netlify
- Backend: Serverless functions via Netlify

### Deployment Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build frontend
npm run build

# Deploy to Netlify
netlify deploy --prod
```

## Development

```bash
# Start frontend
npm start

# Start backend
cd backend && npm start

# Run all tests
npm test
```

## Admin Access

Access the admin dashboard at `/admin` with the admin key to:

- View all uploaded media
- Moderate content
- Manage guestbook entries

---

🎉 **Live at: https://example.com** 🎉

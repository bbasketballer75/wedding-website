# 🔐 Google Cloud Platform Credentials Setup Guide

This guide will help you create new, secure GCP service account credentials to replace the exposed ones.

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your project: **wedding-website-final** (or create a new one)

## Step 2: Find Your Project ID

The **GCP_PROJECT_ID** is visible in several places:

### Method A: Dashboard

- On the main dashboard, look for "Project info" card
- The Project ID is displayed (usually: `wedding-website-final`)

### Method B: URL

- Look at the browser URL: `https://console.cloud.google.com/home/dashboard?project=YOUR-PROJECT-ID`

### Method C: Command Line (if you have gcloud CLI)

```bash
gcloud config get-value project
```

**Your GCP_PROJECT_ID:** `wedding-website-final` (most likely)

## Step 3: Create New Service Account

1. **Navigate to IAM & Admin > Service Accounts**
   - URL: https://console.cloud.google.com/iam-admin/serviceaccounts

2. **Click "CREATE SERVICE ACCOUNT"**

3. **Service Account Details:**
   - Name: `wedding-website-secure`
   - ID: `wedding-website-secure` (auto-generated)
   - Description: `Secure service account for wedding website with minimal permissions`

4. **Click "CREATE AND CONTINUE"**

## Step 4: Grant Minimal Permissions

Add only these roles (principle of least privilege):

### Required Roles:

- **Storage Object Admin**
  - For uploading images to Google Cloud Storage
  - Role ID: `roles/storage.objectAdmin`

- **Cloud Datastore User**
  - For Firestore database access
  - Role ID: `roles/datastore.user`

### Steps:

1. Click "ADD ANOTHER ROLE"
2. Search for "Storage Object Admin" → Select it
3. Click "ADD ANOTHER ROLE"
4. Search for "Cloud Datastore User" → Select it
5. Click "CONTINUE"
6. Skip "Grant users access" (click "DONE")

## Step 5: Generate Service Account Key

1. **Find your new service account** in the list
2. **Click on the service account name**
3. **Go to "KEYS" tab**
4. **Click "ADD KEY" > "Create new key"**
5. **Select "JSON" format**
6. **Click "CREATE"**

A JSON file will download automatically. **KEEP THIS FILE SECURE!**

## Step 6: Extract Credentials from JSON

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "wedding-website-final",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "wedding-website-secure@wedding-website-final.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Extract These Values:

**GCP_PROJECT_ID:**

- Value from `project_id` field
- Example: `wedding-website-final`

**GCP_CLIENT_EMAIL:**

- Value from `client_email` field
- Example: `wedding-website-secure@wedding-website-final.iam.gserviceaccount.com`

**GCP_PRIVATE_KEY:**

- Value from `private_key` field (entire string including newlines)
- Example: `-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n`

## Step 7: Find/Create Google Cloud Storage Bucket

### Check Existing Buckets:

1. Go to **Cloud Storage > Buckets**
   - URL: https://console.cloud.google.com/storage/browser

### If bucket exists:

- **GCS_BUCKET_NAME:** Use existing bucket name (likely `the-poradas-uploads`)

### If no bucket exists:

1. **Click "CREATE BUCKET"**
2. **Bucket Details:**
   - Name: `the-poradas-uploads` (must be globally unique)
   - Location: Choose region closest to your users
   - Storage class: Standard
   - Access control: Fine-grained
3. **Click "CREATE"**

**Your GCS_BUCKET_NAME:** `the-poradas-uploads`

## Step 8: Set Environment Variables

### For Local Development (.env file):

Create `.env.local` file in your project root:

```bash
GCP_PROJECT_ID=wedding-website-final
GCP_CLIENT_EMAIL=wedding-website-secure@wedding-website-final.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GCS_BUCKET_NAME=the-poradas-uploads
```

### For Production (Netlify):

1. Go to Netlify site settings
2. Build & Deploy > Environment variables
3. Add each variable individually

## Step 9: Test the Connection

Run this test script to verify credentials work:

```bash
# In your project directory
node -e "
const { getGoogleCredentials } = require('./backend/config/gcp-credentials.js');
try {
  const creds = getGoogleCredentials();
  console.log('✅ Credentials loaded successfully');
  console.log('Project ID:', creds.project_id);
  console.log('Client Email:', creds.client_email);
} catch (err) {
  console.error('❌ Error:', err.message);
}
"
```

## Step 10: Secure the JSON File

**IMPORTANT SECURITY:**

1. **Never commit the JSON file to Git**
2. **Store it in a secure location** (password manager, encrypted drive)
3. **Delete it from Downloads folder** after extracting values
4. **Only use environment variables** in your code

## Summary

You should now have these four values:

```bash
GCP_PROJECT_ID=wedding-website-final
GCP_CLIENT_EMAIL=wedding-website-secure@wedding-website-final.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GCS_BUCKET_NAME=the-poradas-uploads
```

## Troubleshooting

### Common Issues:

**"Access denied" errors:**

- Verify service account has correct roles
- Check bucket permissions

**"Invalid credentials" errors:**

- Ensure private key includes `\n` newlines
- Verify client email is correct

**"Bucket not found" errors:**

- Confirm bucket name and project match
- Check bucket exists in correct project

### Need Help?

If you encounter issues, run the security remediation script again for guidance:

```bash
.\scripts\security-remediation.ps1
```

# 🔑 GOOGLE CLOUD CREDENTIALS - STEP-BY-STEP SETUP

## 🚨 **WHAT YOU NEED TO FIX THE GCS ERROR:**

The error you're seeing means you need to set up Google Cloud Service Account credentials for photo uploads.

## 🎯 **STEP-BY-STEP CREDENTIAL SETUP:**

### **Step 1: Go to Google Cloud Console**

1. **Visit:** https://console.cloud.google.com/
2. **Select or create your project** (if you don't have one)

### **Step 2: Enable Required APIs**

1. **Go to:** https://console.cloud.google.com/apis/library
2. **Search for and enable:**
   - Cloud Storage API
   - Cloud Storage JSON API

### **Step 3: Create Service Account**

1. **Go to:** https://console.cloud.google.com/iam-admin/serviceaccounts
2. **Click:** "Create Service Account"
3. **Service account name:** `wedding-photo-uploads`
4. **Description:** `Service account for wedding website photo uploads`
5. **Click:** "Create and Continue"

### **Step 4: Grant Permissions**

1. **Role:** Storage Admin (or Storage Object Admin for more security)
2. **Click:** "Continue" → "Done"

### **Step 5: Create Key**

1. **Find your new service account** in the list
2. **Click:** Actions (3 dots) → "Manage Keys"
3. **Click:** "Add Key" → "Create New Key"
4. **Select:** JSON format
5. **Click:** "Create" (file downloads automatically)

### **Step 6: Create Storage Bucket**

1. **Go to:** https://console.cloud.google.com/storage/browser
2. **Click:** "Create Bucket"
3. **Bucket name:** `the-poradas-uploads` (must be globally unique)
4. **Region:** Choose closest to your users
5. **Click:** "Create"

### **Step 7: Set Bucket Permissions**

1. **Click on your bucket name**
2. **Go to:** "Permissions" tab
3. **Click:** "Grant Access"
4. **Principal:** Your service account email (from Step 3)
5. **Role:** Storage Object Admin
6. **Click:** "Save"

---

## 🎯 **EXTRACT YOUR CREDENTIALS:**

Open the downloaded JSON file and find these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "wedding-photo-uploads@your-project.iam.gserviceaccount.com",
  ...
}
```

**You need:**

- `project_id` → Use for `GCP_PROJECT_ID`
- `client_email` → Use for `GCP_CLIENT_EMAIL`
- `private_key` → Use for `GCP_PRIVATE_KEY`

---

## 🎯 **UPDATE YOUR ENVIRONMENT FILES:**

### **Local Development (.env.development):**

```bash
GCP_PROJECT_ID=your-project-id
GCP_CLIENT_EMAIL=wedding-photo-uploads@your-project.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-actual-key-here\n-----END PRIVATE KEY-----"
GCS_BUCKET_NAME=the-poradas-uploads
```

### **Vercel Environment Variables:**

Add these exact values to your Vercel dashboard (as updated in VERCEL-ENV-SETUP.md)

---

## 🚨 **SECURITY NOTES:**

1. **Never commit the JSON file to git**
2. **Keep the private key secure**
3. **Use environment variables in production**
4. **The private key in Vercel needs escaped newlines: `\n`**

---

## 🧪 **TEST YOUR SETUP:**

After setting up credentials, run this test:

```bash
cd backend
node -e "
const { getGoogleCredentials } = require('./config/gcp-credentials.js');
try {
  const creds = getGoogleCredentials();
  console.log('✅ GCS Credentials loaded successfully!');
  console.log('Project ID:', creds.project_id);
  console.log('Client Email:', creds.client_email);
} catch (err) {
  console.log('❌ Error:', err.message);
}
"
```

**Expected output:** `✅ GCS Credentials loaded successfully!`

# 🔍 GCP Service Account Analysis & Action Plan

Based on your current service accounts, here's what you need to do:

## 📋 Current Service Accounts (from your screenshot):

1. **wedding-website-backend@wedding-website-final.iam.gserviceaccount.com**
   - ❌ **COMPROMISED - DELETE IMMEDIATELY**
   - This is the service account whose keys were exposed in your repository
   - Status: Active but UNSAFE

## 🚨 IMMEDIATE ACTIONS REQUIRED:

### Step 1: Delete/Disable the Compromised Service Account

**The compromised account to remove:**

- Email: `wedding-website-backend@wedding-website-final.iam.gserviceaccount.com`
- Project: `wedding-website-final`

**How to delete it:**

1. Go to your service accounts page: https://console.cloud.google.com/iam-admin/serviceaccounts?project=wedding-website-final
2. Find `wedding-website-backend@wedding-website-final.iam.gserviceaccount.com`
3. Click the three dots menu (⋮) on the right
4. Click "Delete"
5. Confirm deletion

### Step 2: Create a NEW Secure Service Account

Since you only have one service account and it's compromised, you need to create a fresh one:

**Recommended new service account:**

- Name: `wedding-website-secure`
- Email: `wedding-website-secure@wedding-website-final.iam.gserviceaccount.com`

## 🛠️ Step-by-Step Creation Process:

### 1. Create New Service Account

```
Name: wedding-website-secure
Description: Secure service account with minimal permissions for wedding website
```

### 2. Assign MINIMAL Permissions (Only what you need):

- **Storage Object Admin** (for photo uploads to Cloud Storage)
- **Cloud Datastore User** (for Firestore database access)

### 3. Generate New JSON Key

- Download the JSON key file
- Extract these values for your environment:

```bash
GCP_PROJECT_ID=wedding-website-final
GCP_CLIENT_EMAIL=wedding-website-secure@wedding-website-final.iam.gserviceaccount.com
GCP_PRIVATE_KEY="[from the JSON file]"
GCS_BUCKET_NAME=the-poradas-uploads
```

## ✅ Your Correct Project Details:

From your screenshot, I can confirm:

- **Project ID:** `wedding-website-final` ✅
- **Project:** `Principal` (this is correct)

## 🗑️ Summary of Actions:

### DELETE:

- ❌ `wedding-website-backend@wedding-website-final.iam.gserviceaccount.com`

### CREATE:

- ✅ `wedding-website-secure@wedding-website-final.iam.gserviceaccount.com`

## 🔐 Security Best Practices:

1. **Never reuse the old service account** - it's been exposed publicly
2. **Use minimal permissions** - only Storage and Firestore access
3. **Store credentials as environment variables** - never in code files
4. **Rotate keys regularly** - consider monthly rotation for production

## 📝 Quick Command List:

Once you create the new service account, update your `.env.local`:

```bash
# Copy .env.template to .env.local
cp .env.template .env.local

# Edit .env.local with these values:
GCP_PROJECT_ID=wedding-website-final
GCP_CLIENT_EMAIL=wedding-website-secure@wedding-website-final.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[your-new-key]\n-----END PRIVATE KEY-----"
GCS_BUCKET_NAME=the-poradas-uploads
```

Would you like me to help you with any specific step in this process?

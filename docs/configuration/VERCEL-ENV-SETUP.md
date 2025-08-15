# 🚀 VERCEL ENVIRONMENT VARIABLES - EXACT STEPS

## 🎯 **EXACTLY WHERE TO ADD ENVIRONMENT VARIABLES:**

### **Step 1: Access Vercel Dashboard**

1. **Go to:** https://vercel.com/dashboard
2. **Find your project:** "wedding-website" (or your project name)
3. **Click on the project name**

### **Step 2: Navigate to Environment Variables**

1. **Click:** "Settings" tab (top of project page)
2. **Click:** "Environment Variables" (left sidebar)
3. **You'll see:** "Add New" button

### **Step 3: Add These EXACT Variables**

**Add each one separately by clicking "Add New" for each:**

#### **Variable 1: Session Secret**

```
Name: SESSION_SECRET
Value: ThePoradas2025MemorySiteSessionSecretForWeddingMemories!#$%
Environment: Production
```

#### **Variable 2: Admin Key**

```
Name: ADMIN_KEY
Value: ThePoradas2025AdminKeyForMemoryManagement$#@!
Environment: Production
```

#### **Variable 3: Wedding Date**

```
Name: WEDDING_DATE
Value: 2025-05-10
Environment: Production
```

#### **Variable 4: Venue Name**

```
Name: VENUE_NAME
Value: Indian Lake Lodge
Environment: Production
```

#### **Variable 5: Venue Address**

```
Name: VENUE_ADDRESS
Value: Indian Lake Lodge, Central City, PA
Environment: Production
```

#### **Variable 6: Email User (AFTER Gmail setup)**

```
Name: EMAIL_USER
Value: your-chosen-email@gmail.com
Environment: Production
```

#### **Variable 7: Email App Password (AFTER Gmail setup)**

```
Name: EMAIL_APP_PASSWORD
Value: your-16-character-app-password
Environment: Production
```

#### **Variable 8: Email From Name**

```
Name: EMAIL_FROM_NAME
Value: Austin & Jordyn Porada
Environment: Production
```

#### **Variable 9: Email Reply To**

```
Name: EMAIL_REPLY_TO
Value: your-chosen-email@gmail.com
Environment: Production
```

#### **Variable 10: Guest Upload Settings**

```
Name: GUEST_UPLOAD_ENABLED
Value: true
Environment: Production
```

#### **Variable 11: Memory Analytics**

```
Name: MEMORY_ANALYTICS_ENABLED
Value: true
Environment: Production
```

#### **Variable 12: GCP Project ID**

```
Name: GCP_PROJECT_ID
Value: wedding-website-final
Environment: Production
```

#### **Variable 13: GCP Client Email**

```
Name: GCP_CLIENT_EMAIL
Value: poradas-storage-uploader@wedding-website-final.iam.gserviceaccount.com
Environment: Production
```

#### **Variable 14: GCP Private Key**

```
Name: GCP_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCqFUXbTi/qyRwZ\nGEf0AjaS6gSFhwSJsvifQPucqkh7rZRPNP8231d7+EUZaEejAG8YyABy2lLnsTW3\nGyACXGjh72COh+u9sfVgqNHbT3z1LwQI55CY4TPk8xPd6nL4GWpBRhlaKmBktXtw\n4VZptlOsq7BkGVi4ZNZEX5XX7DEiOrzi6MGpxGlVLnd1mVPtEFxtFd29q3Xhv8S0\nPxJjzvK+ltZP0mxBsyD2R8zU4OWhz2/smhfRdOmLtIzDWt7xBnnWQsX9zoBI1ydE\nlVmZK2mD7dMMlWjsAUotniRSBbiWg/UuFpElevqEzoO87qPDHYCsTLkOSSX3YtXx\nFMWDbqPTAgMBAAECggEAAwbZHCANIiMbhIMH8MVt+ms30tNiyMmnEHUgbEV5f/bW\ni8UxK/Ns/NrYmGYZZgoIjIr1uxWDN2f8wTooEg8hRZR7PujCbSrWSxpXx36EIrUW\nbiCU1FZShiboJKha0/lYQXNzSwxsyX/MLmeTSwv5bR3VSCcw4CpKx9woRY0IpwfC\nh1ccimTsDe4O5f3GFP126zGSJc1/lrdAuM5IfwdnJM90Tp8NSCPdDCiF3oEgmgbg\nD5syiJJllswyNqHmaKdHEFgHadc8ZcQ6KmLGQyURGIhtG9IRfr7ZUgOMr0WXuwCp\n2/9YeGAWrr+8TNzcJPx9RDBDN1BS3Ab4GhVtTcCqQKBgQDrnoxb2laAJ+gh07hl\nAtTb74KAnnAGY6HI511IqE+8qPRrqe/DprhhWgprXnK8HkEVdihCFIXV09jIUGTJ\nkKLV0e/iExVgL6kbsZSoX3JBzu1nH21GmUyBLzMFT0kP+QyqY7n5rsW0ri0uhpzJ\nasLqSqUrtK+BzFlXkQul03U4CQKBgQC4y4TTCRfjvwYIpkeYX5Udf0LBj0F4o+sc\nBIMqTj5ofIwJyEfSR+Dd+E4nhTX7pygxT2bqHfHPUzo8bqTVnJn+Kzp4GNKCycpY\naV8bQzYoRT78LrM9t16qPrM1US888NbSMFtD8oIaBXQaHF5rQjvclUbAOVoMZrnk\nTkIk/knb+wKBgQC1mBa5XEe6sgcYuyKsx0fi0m+UTYgthHBWdOrSatY5o0XuDKU7\n96y3azwIkFyBXBfxQIW6mDKmIIY9rKhhKVY20Xy+ktKwtUryiyT1t8pJqgASsIf6\nF4B9ODFscDTxWJNIZ2AYbXj2zh8Icrs4CU58YFd4neN+eE6LTMDbZ2Q6cQKBgQCA\nWlvXeOlu9q9qMpRn8XvRESN87dO7x571xuyT5eTTDi72XHYGSIaXpnAiYxQrxt7T\n4SLKWiIqrtQ0RWWYOT18nOnvoM4WqbIx1n6IoRZswiwNXSKCK2tFNGelEM6OtXmA\nZLX/a+GR0VfjCvFJ7qdFfym1OiChnHhhaznmF/mVIQKBgQDgnHGlOCy6rbWI7tI5\nskDV/w8uO9/Tmik54yeAwpF8nAZEfbOb1p8AIsInNKEL+e3GG8lFfq+NR7+ezF0V\n2hIp0ScCw7VWxa8MkfhSueFFqcRFkPDTFTLIyWgXm8enDE1OfNiqPl5ydXz6rIOt\ntx9Y9/3AsScy09OsNQ7LqfPrTg==\n-----END PRIVATE KEY-----
Environment: Production
```

#### **Variable 15: GCS Bucket Name**

```
Name: GCS_BUCKET_NAME
Value: the-poradas-uploads
Environment: Production
```

### **Step 4: Deploy Changes**

1. **After adding all variables, click:** "Deployments" tab
2. **Click:** "Redeploy" on your latest deployment
3. **Select:** "Use existing Build Cache"
4. **Click:** "Redeploy"

---

## 🎯 **SUMMARY OF ALL VARIABLES TO ADD:**

```bash
SESSION_SECRET=ThePoradas2025MemorySiteSessionSecretForWeddingMemories!#$%
ADMIN_KEY=ThePoradas2025AdminKeyForMemoryManagement$#@!
WEDDING_DATE=2025-05-10
VENUE_NAME=Indian Lake Lodge
VENUE_ADDRESS=Indian Lake Lodge, Central City, PA
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
EMAIL_FROM_NAME=Austin & Jordyn Porada
EMAIL_REPLY_TO=your-email@gmail.com
GUEST_UPLOAD_ENABLED=true
MEMORY_ANALYTICS_ENABLED=true
GCP_PROJECT_ID=your-gcp-project-id
GCP_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GCP_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour-private-key-here\n-----END PRIVATE KEY-----
GCS_BUCKET_NAME=the-poradas-uploads
```

**Note:** Replace "your-email@gmail.com" and "your-app-password" with actual values after Gmail setup!

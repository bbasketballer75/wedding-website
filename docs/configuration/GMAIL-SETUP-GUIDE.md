# 📧 EMAIL SETUP - CUSTOM DOMAIN & GMAIL OPTIONS

## 🎯 **OPTION 1: CUSTOM DOMAIN EMAIL (RECOMMENDED)**

### **Using your @theporadas.com email is PERFECT for this!**

#### **Step 1: Find Your Email Hosting Provider**

Your domain `theporadas.com` likely has email hosting through:

- **Porkbun** (if they provide email hosting)
- **Google Workspace** (business email)
- **Microsoft 365** (business email)
- **Other hosting provider**

#### **Step 2: Get SMTP Settings**

Contact your email provider or check their documentation for:

```bash
SMTP Server: mail.theporadas.com (or smtp.gmail.com if Google Workspace)
SMTP Port: 587 (or 465 for SSL)
Username: memories@theporadas.com (your chosen email)
Password: your-email-password
```

#### **Step 3: Recommended Email Addresses**

- `memories@theporadas.com` - For guest photo uploads
- `hello@theporadas.com` - For guestbook entries
- `noreply@theporadas.com` - For automated emails

#### **Step 4: Configure Environment Variables**

```bash
EMAIL_HOST=mail.theporadas.com  # Your SMTP server
EMAIL_PORT=587
EMAIL_SECURE=false  # true if using port 465
EMAIL_USER=memories@theporadas.com
EMAIL_PASSWORD=your-email-password  # NOT an app password
EMAIL_FROM_NAME=Austin & Jordyn Porada
EMAIL_REPLY_TO=memories@theporadas.com
```

---

## 🎯 **OPTION 2: GMAIL APP PASSWORD (FALLBACK)**

### **Only use this if custom domain email doesn't work**

### **Step 1: Google Account Security**

1. **Go to:** https://myaccount.google.com/security
2. **Click:** "2-Step Verification" (must be enabled first)
3. **If not enabled:** Set up 2-Step Verification with your phone number

### **Step 2: Generate App Password**

1. **Still in Security settings, scroll down to:** "App passwords"
2. **Click:** "App passwords"
3. **Select app:** "Other (custom name)"
4. **Type:** "Wedding Website Email"
5. **Click:** "Generate"
6. **Copy the 16-character password** (looks like: abcd efgh ijkl mnop)

### **Step 3: Add to Your Environment Variables**

Use this 16-character password in your environment variables:

```bash
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # Replace with your actual password
```

## 📧 **WHICH EMAIL TO USE:**

### **Option A: Use Existing Gmail Account**

- Use any Gmail account you already have
- Follow steps above to get App Password
- Set EMAIL_USER to that Gmail address

### **Option B: Create New Wedding Email (Recommended)**

1. **Create:** memories@gmail.com (or similar available name)
2. **Set up 2FA** on the new account
3. **Generate App Password** for that account
4. **Use that email** for all wedding memory communications

---

## 🎯 **FINAL EMAIL CONFIGURATION:**

```bash
EMAIL_USER=your-email@gmail.com  # Your chosen Gmail address
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # 16-character App Password from Google
EMAIL_FROM_NAME=Austin & Jordyn Porada
EMAIL_REPLY_TO=your-email@gmail.com  # Same as EMAIL_USER
```

This email will be used for:

- ✅ Thank you emails when guests leave guestbook entries
- ✅ Confirmation emails when guests upload photos
- ✅ Anniversary memory emails to family and friends

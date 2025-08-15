# 📧 CUSTOM DOMAIN EMAIL SETUP - theporadas.com

## 🎯 **STEP 1: CHECK YOUR EMAIL HOSTING**

Since you own `theporadas.com`, you likely have email hosting. Let's find out where:

### **Option A: Check with Porkbun (Your Domain Registrar)**

1. **Login to:** https://porkbun.com/
2. **Go to:** Domain Management → theporadas.com
3. **Look for:** Email section or Email Hosting
4. **Check if:** Email hosting is included or available

### **Option B: Check Your Website Hosting**

1. **Check your hosting provider** (Netlify doesn't provide email)
2. **Look for:** Email or MX records in DNS settings
3. **Common providers:** Hostinger, SiteGround, Bluehost, etc.

### **Option C: Google Workspace (Business Gmail)**

1. **Check if you have:** Google Workspace account
2. **Login at:** admin.google.com
3. **If you have this:** You can use @theporadas.com emails with Gmail infrastructure

---

## 🎯 **STEP 2: RECOMMENDED EMAIL ADDRESSES**

Create these email addresses for your wedding site:

- `memories@theporadas.com` - Main contact for photo uploads
- `hello@theporadas.com` - Guestbook entries and general contact
- `noreply@theporadas.com` - Automated system emails

---

## 🎯 **STEP 3: GET SMTP SETTINGS**

### **For Most Email Providers:**

```bash
SMTP Server: mail.theporadas.com
Port: 587 (or 465 for SSL)
Security: STARTTLS (or SSL/TLS)
Username: memories@theporadas.com
Password: your-email-password
```

### **For Google Workspace:**

```bash
SMTP Server: smtp.gmail.com
Port: 587
Security: STARTTLS
Username: memories@theporadas.com
Password: your-google-workspace-password (or app password)
```

### **For Outlook/Microsoft 365:**

```bash
SMTP Server: smtp-mail.outlook.com
Port: 587
Security: STARTTLS
Username: memories@theporadas.com
Password: your-microsoft-password
```

---

## 🎯 **STEP 4: UPDATE ENVIRONMENT VARIABLES**

### **For Custom Domain SMTP:**

```bash
EMAIL_HOST=mail.theporadas.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=memories@theporadas.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM_NAME=Austin & Jordyn Porada
EMAIL_REPLY_TO=memories@theporadas.com
```

### **For Google Workspace:**

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=memories@theporadas.com
EMAIL_PASSWORD=your-workspace-password
EMAIL_FROM_NAME=Austin & Jordyn Porada
EMAIL_REPLY_TO=memories@theporadas.com
```

---

## 🎯 **STEP 5: VERIFY EMAIL SETUP**

### **Test Local Configuration:**

1. Create `backend/.env.development` with your real email settings
2. Test with this command:

```bash
cd backend
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'mail.theporadas.com',  // Your SMTP server
  port: 587,
  secure: false,
  auth: {
    user: 'memories@theporadas.com',
    pass: 'your-password'
  }
});

transporter.verify((error, success) => {
  if (error) console.log('❌ Error:', error);
  else console.log('✅ Custom domain email working!');
});
"
```

### **Expected Result:**

```
✅ Custom domain email working!
```

---

## 🎯 **STEP 6: UPDATE VERCEL VARIABLES**

Add these to your Vercel dashboard:

- `EMAIL_HOST` = mail.theporadas.com (or your SMTP server)
- `EMAIL_PORT` = 587
- `EMAIL_SECURE` = false
- `EMAIL_USER` = memories@theporadas.com
- `EMAIL_PASSWORD` = your-email-password
- `EMAIL_FROM_NAME` = Austin & Jordyn Porada
- `EMAIL_REPLY_TO` = memories@theporadas.com

---

## 🚨 **TROUBLESHOOTING:**

### **If you don't have email hosting:**

1. **Option A:** Add email hosting to your domain (usually $5-10/month)
2. **Option B:** Use Google Workspace ($6/month per user)
3. **Option C:** Use Gmail with app passwords (free, but less professional)

### **Common SMTP servers by provider:**

- **Hostinger:** mail.hostinger.com
- **SiteGround:** mail.siteground.com
- **Bluehost:** mail.bluehost.com
- **Google Workspace:** smtp.gmail.com
- **Microsoft 365:** smtp-mail.outlook.com

### **Need help finding your settings?**

Contact your domain/hosting provider and ask:

> "I need SMTP settings for my custom domain email addresses (@theporadas.com) to send emails from my website"

**Using custom domain email makes your wedding site look much more professional!** 🎉

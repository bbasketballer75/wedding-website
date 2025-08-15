# 🧪 COMPLETE TESTING PROCEDURE

## 🎯 **STEP-BY-STEP TESTING CHECKLIST:**

### **Phase 1: Local Development Testing**

#### **1. Start Development Environment**

```bash
npm run dev:full
```

**Expected:** Both frontend (port 3000) and backend (port 5000) running

#### **2. Test Basic Functionality**

- [ ] **Visit:** http://localhost:3000
- [ ] **Check:** Website loads correctly
- [ ] **Test:** Navigation between pages works
- [ ] **Verify:** Guestbook still functions

#### **3. Test New Photo Upload Component**

- [ ] **Navigate to:** Page where you added GuestPhotoUpload
- [ ] **Try:** Drag and drop a photo
- [ ] **Verify:** Preview appears
- [ ] **Test:** Upload button works
- [ ] **Check:** Success message appears

### **Phase 2: Email Testing (After Gmail Setup)**

#### **1. Test Email Configuration**

```bash
# In your backend folder, create test file:
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
console.log('Testing email...');
transporter.verify((error, success) => {
  if (error) console.log('Error:', error);
  else console.log('✅ Email configuration working!');
});
"
```

#### **2. Test Memory Email Features**

- [ ] **Submit:** Guestbook entry
- [ ] **Check:** Email confirmation received
- [ ] **Upload:** Photo via component
- [ ] **Verify:** Upload confirmation email
- [ ] **Test:** Admin approval notification

### **Phase 3: Production Deployment Testing**

#### **1. Deploy to Vercel**

```bash
npm run build
# Then deploy via Vercel dashboard or CLI
```

#### **2. Production Functionality Check**

- [ ] **Visit:** Your live website
- [ ] **Test:** All pages load
- [ ] **Try:** Guestbook submission
- [ ] **Test:** Photo upload
- [ ] **Check:** Email notifications work
- [ ] **Verify:** Admin dashboard access

### **Phase 4: Complete System Validation**

#### **1. End-to-End Guest Flow**

1. **Guest visits site**
2. **Guest submits guestbook entry**
3. **Guest receives thank you email**
4. **Guest uploads wedding photos**
5. **Guest receives upload confirmation**
6. **Admin receives approval notification**

#### **2. Admin Management Flow**

1. **Admin accesses dashboard**
2. **Admin reviews uploaded photos**
3. **Admin approves/rejects photos**
4. **System sends guest notifications**
5. **Analytics update correctly**

---

## 🎯 **TROUBLESHOOTING CHECKLIST:**

### **If Photo Upload Fails:**

- [ ] Check Google Cloud Storage bucket permissions
- [ ] Verify GCS_BUCKET_NAME environment variable
- [ ] Test file size limits (max 10MB)
- [ ] Check browser console for errors

### **If Emails Don't Send:**

- [ ] Verify Gmail App Password is correct
- [ ] Check EMAIL_USER and EMAIL_APP_PASSWORD variables
- [ ] Test email configuration with nodemailer test
- [ ] Check spam folder for test emails

### **If Component Doesn't Appear:**

- [ ] Verify import path is correct
- [ ] Check component is properly exported
- [ ] Ensure no TypeScript errors
- [ ] Test component isolation

---

## 🎯 **SUCCESS METRICS:**

✅ **All tests pass locally**
✅ **Photo uploads work in development**  
✅ **Email confirmations send correctly**
✅ **Production deployment successful**
✅ **End-to-end guest flow complete**
✅ **Admin management functions work**

**When all checkboxes are complete, your POST-WEDDING memory sharing system is fully operational! 🎉**

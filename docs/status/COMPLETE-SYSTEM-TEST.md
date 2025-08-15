# 🧪 COMPLETE SYSTEM TEST - STEP BY STEP

## 🎯 **IMMEDIATE TESTING (Local Development):**

### **Step 1: Test Your Website**

1. **Open:** http://localhost:3001
2. **Check:** Website loads correctly
3. **Navigate:** Through all sections (Home, Guestbook, Photos, etc.)

### **Step 2: Test Photo Upload Feature**

1. **Go to:** Guestbook section
2. **Scroll down:** Find "Share Your Wedding Memories" section
3. **Try uploading:** A test photo (drag & drop or click to select)
4. **Fill out:** Name, email, and message
5. **Click:** Upload button
6. **Verify:** Success message appears

### **Step 3: Test Email System**

1. **Submit:** A guestbook entry with your email
2. **Check:** Your Gmail for thank you email from memories@theporadas.com
3. **Verify:** Email forwarding is working

### **Step 4: Test Backend APIs**

Test in browser or with curl:

- **Guestbook API:** http://localhost:3002/api/guestbook
- **Health Check:** http://localhost:3002/api/health

---

## 🚀 **PRODUCTION DEPLOYMENT:**

### **If Local Testing Passes:**

#### **Deploy to Vercel:**

1. **Go to:** https://vercel.com/dashboard
2. **Find:** Your wedding-website project
3. **Check:** All 15 environment variables are added
4. **Click:** Deployments → Redeploy
5. **Wait:** For deployment to complete (~2-3 minutes)

#### **Test Production:**

1. **Visit:** https://www.theporadas.com
2. **Test:** All features work in production
3. **Verify:** Photo uploads work
4. **Check:** Emails are sent correctly

---

## 🎉 **SUCCESS CHECKLIST:**

- [ ] **Local website loads** (localhost:3001)
- [ ] **Photo upload component appears** in guestbook
- [ ] **Can upload test photos** successfully
- [ ] **Guestbook submissions work**
- [ ] **Email notifications received**
- [ ] **Production deployment successful**
- [ ] **Live website fully functional**

---

## 🚨 **IF SOMETHING DOESN'T WORK:**

### **Photo Upload Issues:**

- Check browser console for errors
- Verify Google Cloud Storage credentials
- Check backend logs for errors

### **Email Issues:**

- Verify Gmail App Password is correct
- Check Porkbun email forwarding setup
- Test email configuration

### **General Issues:**

- Check environment variables are loaded
- Verify both frontend and backend are running
- Check browser network tab for API errors

---

## 🎯 **READY FOR GUESTS:**

**Once everything tests successfully:**

✅ **Your guests can:**

- Visit www.theporadas.com
- Upload their favorite wedding photos
- Leave heartfelt guestbook messages
- Receive beautiful thank you emails

✅ **You can:**

- Manage uploaded photos via admin dashboard
- Receive notifications of new uploads
- Track guest engagement and memories

**Your POST-WEDDING memory sharing system is ready to collect all the precious moments from May 10th, 2025! 🎉**

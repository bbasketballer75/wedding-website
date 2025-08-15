# 🌐 Complete Vercel Custom Domain Setup Guide

## Step-by-Step Instructions for theporadas.com

### 🎯 **GOAL**: Set up theporadas.com to work perfectly with Vercel hosting

---

## **STEP 1: Install Vercel CLI (Required)**

### Windows PowerShell Installation:

```powershell
# Option 1: Install via npm (Recommended)
npm install -g vercel

# Option 2: Install via yarn
yarn global add vercel

# Option 3: Download installer from vercel.com/download
```

### Verify Installation:

```powershell
vercel --version
# Should show: Vercel CLI 32.x.x or similar
```

---

## **STEP 2: Login to Vercel**

### Login Command:

```powershell
vercel login
```

**What happens:**

1. Opens browser automatically
2. Login with GitHub, GitLab, or Bitbucket account
3. Authorize Vercel CLI access
4. Returns to terminal with "Success!" message

### Verify Login:

```powershell
vercel whoami
# Should show your username/email
```

---

## **STEP 3: Connect Your Project to Vercel**

### Navigate to your project:

```powershell
cd "c:\Users\Austin\Downloads\wedding-website"
```

### Initialize Vercel project:

```powershell
vercel
```

**Follow the prompts:**

1. **"Set up and deploy?"** → Press `Y` (Yes)
2. **"Which scope?"** → Select your personal account
3. **"Link to existing project?"** → Press `N` (No, create new)
4. **"What's your project's name?"** → `wedding-website` or `theporadas`
5. **"In which directory is your code located?"** → Press Enter (current directory)
6. **Override settings?** → Press `N` (No, use detected settings)

**Expected Output:**

```
✅ Production: https://wedding-website-xyz.vercel.app
📝 Deployed to production. Run `vercel --prod` to overwrite later.
```

---

## **STEP 4: Add Custom Domain in Vercel Dashboard**

### Access Vercel Dashboard:

1. Open browser: https://vercel.com/dashboard
2. Click on your project (`wedding-website` or similar)
3. Click **"Settings"** tab
4. Click **"Domains"** in left sidebar

### Add Domain:

1. Click **"Add Domain"** button
2. Enter: `theporadas.com`
3. Click **"Add"**
4. Vercel will suggest adding `www.theporadas.com` → Click **"Add"**

Before starting, ensure you have:

- ✅ Domain purchased from Porkbun: `theporadas.com`
- ✅ Vercel account created
- ✅ Wedding website project deployed to Vercel
- ✅ Access to Porkbun DNS management

---

## 🚀 **Step 1: Deploy to Vercel First**

### **1.1 Deploy Your Website**

```bash
# In your project directory
vercel --prod
```

### **1.2 Note Your Vercel Deployment URL**

After deployment, Vercel will give you a URL like:

- `https://wedding-website-xyz123.vercel.app`
- Keep this handy - you'll need it for testing

---

## 🔧 **Step 2: Configure Domain in Vercel Dashboard**

### **2.1 Access Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Click on your **wedding website project**

### **2.2 Add Custom Domain**

1. In your project dashboard, click **"Settings"** tab
2. Click **"Domains"** in the left sidebar
3. Click **"Add Domain"** button
4. Enter your domain: `theporadas.com`
5. Click **"Add"**

### **2.3 Add WWW Subdomain**

1. Click **"Add Domain"** again
2. Enter: `www.theporadas.com`
3. Click **"Add"**
4. Set `www.theporadas.com` as your **primary domain** (recommended)

### **2.4 Get DNS Instructions**

Vercel will show you DNS configuration instructions. You'll see something like:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @ (or leave blank)
Value: 76.76.19.19
```

**Important:** Copy these exact values - they're specific to your project!

---

## 🌐 **Step 3: Configure DNS at Porkbun**

### **3.1 Access Porkbun DNS Management**

1. Go to [porkbun.com](https://porkbun.com)
2. Sign in to your account
3. Click **"Account"** → **"Domain Management"**
4. Find `theporadas.com` and click **"Details"**
5. Click **"DNS"** tab

### **3.2 Clear Existing Records (If Any)**

**⚠️ Important:** Remove any existing A or CNAME records for:

- `@` (root domain)
- `www` (www subdomain)

### **3.3 Add New DNS Records**

#### **Record 1: WWW Subdomain (CNAME)**

- **Type:** `CNAME`
- **Host:** `www`
- **Answer:** `cname.vercel-dns.com`
- **TTL:** `600` (or leave default)

#### **Record 2: Root Domain (A Record)**

- **Type:** `A`
- **Host:** `@` (or leave blank)
- **Answer:** `76.76.19.19`
- **TTL:** `600` (or leave default)

#### **Record 3: Root Domain Redirect (Optional but Recommended)**

If you want `theporadas.com` to redirect to `www.theporadas.com`:

- **Type:** `ALIAS` or `ANAME` (if available)
- **Host:** `@`
- **Answer:** `www.theporadas.com`

### **3.4 Save Changes**

Click **"Save"** or **"Update"** to apply DNS changes.

---

## ⏱️ **Step 4: Wait for DNS Propagation**

### **4.1 Propagation Time**

- **Typical:** 15 minutes to 2 hours
- **Maximum:** Up to 48 hours (rare)
- **Most common:** 30-60 minutes

### **4.2 Check Propagation Status**

Use these tools to monitor DNS propagation:

**Online Tools:**

- [dnschecker.org](https://dnschecker.org) → Enter `theporadas.com`
- [whatsmydns.net](https://whatsmydns.net) → Enter `www.theporadas.com`

**Command Line (PowerShell):**

```powershell
# Check CNAME record
nslookup www.theporadas.com

# Check A record
nslookup theporadas.com
```

### **4.3 What You Should See**

**For www.theporadas.com:**

```
www.theporadas.com canonical name = cname.vercel-dns.com
```

**For theporadas.com:**

```
Name: theporadas.com
Address: 76.76.19.19
```

---

## ✅ **Step 5: Verify Everything Works**

### **5.1 Test Your Domain**

Once DNS propagates, test these URLs:

1. **Primary URL:** `https://www.theporadas.com`
   - Should load your wedding website
   - Should show HTTPS (secure padlock)

2. **Root Domain:** `https://theporadas.com`
   - Should redirect to `www.theporadas.com`

3. **Mobile Test:** Test on your phone/tablet

### **5.2 SSL Certificate**

Vercel automatically provides SSL certificates:

- ✅ Should show **padlock icon** in browser
- ✅ Should say **"Secure"** or **"Connection is secure"**
- ✅ Certificate issued by **"Vercel"** or **"Let's Encrypt"**

### **5.3 Performance Test**

Test your website speed:

- Use [PageSpeed Insights](https://pagespeed.web.dev)
- Enter: `https://www.theporadas.com`
- Should score 90+ for performance

---

## 🛠️ **Troubleshooting Common Issues**

### **Issue 1: "Domain not found" or 404 Error**

**Cause:** DNS not propagated yet  
**Solution:** Wait longer, check DNS propagation tools

### **Issue 2: "Not Secure" Warning**

**Cause:** SSL certificate still provisioning  
**Solution:** Wait 5-10 minutes, SSL auto-provisions

### **Issue 3: Old Website Still Showing**

**Cause:** Browser cache or DNS cache  
**Solution:**

```powershell
# Clear DNS cache
ipconfig /flushdns

# Hard refresh browser: Ctrl + Shift + R
```

### **Issue 4: www vs non-www Not Working**

**Cause:** Missing A record or CNAME configuration  
**Solution:** Double-check both DNS records are set correctly

### **Issue 5: Slow Loading**

**Cause:** DNS TTL too high  
**Solution:** Set TTL to 300-600 seconds in Porkbun

---

## 📧 **Email Configuration (Optional)**

If you want email at your domain (`hello@theporadas.com`):

### **Option 1: Google Workspace**

1. Set up Google Workspace for `theporadas.com`
2. Add MX records in Porkbun DNS

### **Option 2: Porkbun Email**

1. Check if Porkbun offers email hosting
2. Follow their email setup guide

**Note:** This is optional - focus on website first!

---

## ✨ **Step 6: Final Verification Checklist**

Once everything is set up, verify:

- [ ] `www.theporadas.com` loads your wedding website
- [ ] `theporadas.com` redirects to `www.theporadas.com`
- [ ] HTTPS works (green padlock icon)
- [ ] Website loads on mobile devices
- [ ] All pages work (home, gallery, guestbook, etc.)
- [ ] Forms work (guestbook submission)
- [ ] Images load properly
- [ ] Performance score 90+ on PageSpeed Insights

---

## 🎉 **Success! Your Domain is Live**

### **Share Your Wedding Website:**

Once everything works, you can share:

- **Primary URL:** `https://www.theporadas.com`
- **QR Code:** Generate QR code pointing to your website
- **Social Media:** Share on Facebook, Instagram, etc.

### **Monitor Your Website:**

- **Uptime:** Vercel provides 99.9% uptime
- **Analytics:** Check Vercel dashboard for visitor stats
- **Errors:** Monitor Sentry for any issues

---

## 📞 **Need Help?**

### **Support Resources:**

- **Vercel Docs:** [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- **Porkbun Support:** [porkbun.com/support](https://porkbun.com/support)
- **DNS Help:** [cloudflare.com/learning/dns/what-is-dns](https://cloudflare.com/learning/dns/what-is-dns/)

### **Emergency Contacts:**

- **Vercel Support:** Available in dashboard
- **Porkbun Support:** Email support available
- **DNS Issues:** Usually resolve automatically within 24 hours

---

## 📊 **Expected Timeline**

| Step                    | Time Required            | Status |
| ----------------------- | ------------------------ | ------ |
| Deploy to Vercel        | 5-10 minutes             | ⏳     |
| Configure Vercel Domain | 5 minutes                | ⏳     |
| Update DNS at Porkbun   | 10 minutes               | ⏳     |
| DNS Propagation         | 15 minutes - 2 hours     | ⏳     |
| SSL Certificate         | 5-10 minutes             | ⏳     |
| **Total**               | **30 minutes - 3 hours** | 🎯     |

---

**🎊 Once complete, your guests can visit `www.theporadas.com` to celebrate your special day!**

---

_Last updated: August 5, 2025_  
_Platform: Vercel + Porkbun DNS_  
_Status: Ready for configuration_ ✅

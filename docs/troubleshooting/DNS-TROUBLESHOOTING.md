# 🔧 DNS Troubleshooting Guide

## Common DNS Setup Issues & Solutions

---

## **Issue 1: DNS Records Not Working**

### **Symptoms:**

- Domain doesn't load after 2+ hours
- Gets "This site can't be reached" error
- DNS checker shows no records

### **Solution Steps:**

1. **Double-check DNS records in Porkbun:**

   ```
   CNAME: www → cname.vercel-dns.com
   A: @ → 76.76.19.19
   ```

2. **Remove conflicting records:**
   - Delete any old A records for `www`
   - Delete any old CNAME records for `@`
   - Remove parking page redirects

3. **Wait for propagation:**
   ```powershell
   # Check every 15 minutes
   nslookup www.theporadas.com
   ```

---

## **Issue 2: Domain Shows Vercel's "Domain Not Found" Page**

### **Symptoms:**

- Domain loads but shows Vercel error page
- Says "The domain is not configured"

### **Solution:**

1. **Check Vercel dashboard:**
   - Go to Project Settings → Domains
   - Ensure `www.theporadas.com` is added
   - Make sure it shows "Valid Configuration"

2. **Re-add domain if needed:**
   - Remove domain from Vercel
   - Wait 5 minutes
   - Add it back

---

## **Issue 3: Only WWW or Only Root Works**

### **Symptoms:**

- `www.theporadas.com` works but `theporadas.com` doesn't
- Or vice versa

### **Solution:**

Ensure both DNS records exist:

```
Type: CNAME | Host: www | Value: cname.vercel-dns.com
Type: A     | Host: @   | Value: 76.76.19.19
```

---

## **Issue 4: SSL Certificate "Not Secure" Warning**

### **Symptoms:**

- Browser shows "Not Secure"
- Certificate errors

### **Solution:**

1. **Wait for SSL provisioning** (5-15 minutes)
2. **Force refresh:** Ctrl + Shift + R
3. **Check Vercel dashboard:**
   - Settings → Domains
   - Should show SSL status as "Active"

---

## **Issue 5: Old Website Still Showing**

### **Symptoms:**

- Domain loads old content
- Shows previous hosting provider's content

### **Solutions:**

1. **Clear browser cache:**

   ```
   Ctrl + Shift + R (hard refresh)
   ```

2. **Clear DNS cache:**

   ```powershell
   ipconfig /flushdns
   ```

3. **Check in incognito/private mode**

4. **Test from different device/network**

---

## **Issue 6: Slow DNS Propagation**

### **Symptoms:**

- Takes longer than 2 hours to propagate
- Inconsistent results from different locations

### **Solutions:**

1. **Lower TTL values:**
   - Change TTL to 300 seconds
   - Save and wait

2. **Use Cloudflare DNS for testing:**
   - Set computer DNS to 1.1.1.1
   - Test domain loading

3. **Check multiple DNS servers:**
   ```powershell
   nslookup www.theporadas.com 8.8.8.8
   nslookup www.theporadas.com 1.1.1.1
   ```

---

## **Emergency Reset Procedure**

If nothing works after 24 hours:

### **Step 1: Complete DNS Reset**

1. Delete ALL records for `theporadas.com` in Porkbun
2. Wait 1 hour
3. Re-add only the required records:
   ```
   CNAME: www → cname.vercel-dns.com
   A: @ → 76.76.19.19
   ```

### **Step 2: Vercel Domain Reset**

1. Remove domain from Vercel project
2. Wait 30 minutes
3. Re-add domain to Vercel
4. Wait for new DNS instructions

### **Step 3: Test from Clean Environment**

1. Use different device/network
2. Test in incognito mode
3. Use online DNS checkers

---

## **Verification Tools**

### **Online DNS Checkers:**

- [dnschecker.org](https://dnschecker.org)
- [whatsmydns.net](https://whatsmydns.net)
- [dnslookup.org](https://dnslookup.org)

### **Command Line Tools:**

```powershell
# Basic lookup
nslookup www.theporadas.com

# Specific DNS server
nslookup www.theporadas.com 8.8.8.8

# Trace route
tracert www.theporadas.com

# Clear local DNS cache
ipconfig /flushdns
```

### **Browser Testing:**

```
https://www.theporadas.com
https://theporadas.com
http://www.theporadas.com (should redirect to HTTPS)
```

---

## **Get Help**

### **Porkbun Support:**

- Email: support@porkbun.com
- Help Center: porkbun.com/support

### **Vercel Support:**

- Dashboard: Click "Help" in Vercel dashboard
- Docs: vercel.com/docs

### **Community:**

- Vercel Discord
- Stack Overflow (tag: vercel, dns)

---

_DNS troubleshooting can take time - be patient!_

# 🌐 DNS Quick Reference - theporadas.com

## Porkbun DNS Settings for Vercel

### **DNS Records to Add:**

#### **1. WWW Subdomain (Primary)**

```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 600
```

#### **2. Root Domain**

```
Type: A
Host: @ (or blank)
Value: 76.76.19.19
TTL: 600
```

#### **3. Root Domain Redirect (Optional)**

```
Type: ALIAS/ANAME
Host: @
Value: www.theporadas.com
TTL: 600
```

---

## **Verification Commands:**

```powershell
# Check WWW
nslookup www.theporadas.com

# Check Root
nslookup theporadas.com

# Clear DNS cache if needed
ipconfig /flushdns
```

---

## **Expected Results:**

- ✅ `www.theporadas.com` → Your wedding website
- ✅ `theporadas.com` → Redirects to www version
- ✅ HTTPS works automatically
- ✅ Propagation: 15 minutes - 2 hours

---

_Quick reference for DNS setup_

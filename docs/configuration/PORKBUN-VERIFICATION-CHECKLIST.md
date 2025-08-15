# 🔍 Porkbun DNS Verification Checklist

## **Double-Check These Porkbun Settings**

### ✅ **Step 1: Verify Records Are Saved**

1. Log into [porkbun.com](https://porkbun.com)
2. Go to: Account → Domain Management → theporadas.com → DNS
3. **CONFIRM these exact records exist:**

   ```
   Type: A
   Host: @ (or blank/theporadas.com)
   Answer: 76.76.19.19
   TTL: 600
   Status: Active/Saved ✅

   Type: CNAME
   Host: www
   Answer: cname.vercel-dns.com
   TTL: 600
   Status: Active/Saved ✅
   ```

### ⚠️ **Step 2: Check for Conflicts**

**DELETE these if they exist:**

- Any A record for `www` host
- Any CNAME pointing to old domains
- Any parking page redirects
- Any "website redirect" services

### 🔧 **Step 3: Verify No Pending Changes**

Look for:

- "Pending" status on records
- "Changes not saved" warnings
- Red/orange status indicators

### 💾 **Step 4: Force Save (If Needed)**

If records show but might not be saved:

1. Click "Edit" on each record
2. Don't change anything
3. Click "Save" again
4. Look for confirmation message

### 🚨 **Step 5: Check Domain Status**

Verify:

- Domain is not locked for transfers
- No "domain hold" status
- Auto-renewal is enabled
- Domain hasn't expired

## **If You Find Issues:**

### **Problem: Records Not Saved**

**Solution:** Re-enter the records and ensure you click "Save Changes"

### **Problem: Conflicting Records**

**Solution:** Delete old A records for `www`, keep only the CNAME

### **Problem: Domain Lock**

**Solution:** Unlock domain in Porkbun settings

### **Problem: Pending Status**

**Solution:** Wait 5-10 minutes, refresh page, check if status changes

## **Alternative: Contact Porkbun**

If everything looks correct but still not working after 24 hours:

**Porkbun Support:**

- Email: support@porkbun.com
- Subject: "DNS CNAME not propagating for theporadas.com"
- Include: Screenshots of your DNS settings

## **Quick Test After Changes:**

```powershell
# Wait 10 minutes after making changes, then test:
ipconfig /flushdns
nslookup www.theporadas.com
```

## **Expected Timeline After Fixing:**

- **Immediate:** Porkbun shows changes saved
- **15-30 minutes:** DNS starts propagating
- **1-6 hours:** Most regions working
- **24 hours:** Fully propagated

---

**Action:** Please check your Porkbun dashboard now and verify each item above! 🎯
